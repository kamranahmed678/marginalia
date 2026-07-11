"""
Marginalia — retrieval-augmented Q&A engine.

Pipeline: parse a document -> chunk it (keeping page numbers for citations) ->
embed chunks (MiniLM) -> at query time, embed the question, retrieve the closest
chunks by cosine similarity, and generate a grounded answer with Flan-T5 that
cites the passages it used.

Everything runs on CPU with small open models; weights are baked into the image.
"""

import io
import os
import time
import uuid
import threading
import numpy as np

EMBED_MODEL = os.environ.get("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
GEN_MODEL = os.environ.get("GEN_MODEL", "google/flan-t5-base")
CHUNK_CHARS = int(os.environ.get("CHUNK_CHARS", "600"))
CHUNK_OVERLAP = int(os.environ.get("CHUNK_OVERLAP", "120"))
TOP_K = int(os.environ.get("TOP_K", "4"))
MAX_DOCS = int(os.environ.get("MAX_DOCS", "24"))   # in-memory LRU cap

_embedder = None
_tokenizer = None
_generator = None
_lock = threading.Lock()

# ephemeral in-memory doc store: doc_id -> {filename, chunks:[{text,page}], emb}
_STORE = {}
_ORDER = []


# --------------------------------------------------------------------------- #
# model loading (lazy)
# --------------------------------------------------------------------------- #
def _get_embedder():
    global _embedder
    if _embedder is None:
        with _lock:
            if _embedder is None:
                from sentence_transformers import SentenceTransformer
                _embedder = SentenceTransformer(EMBED_MODEL, device="cpu")
    return _embedder


def _get_generator():
    global _tokenizer, _generator
    if _generator is None:
        with _lock:
            if _generator is None:
                from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
                tok = AutoTokenizer.from_pretrained(GEN_MODEL)
                gen = AutoModelForSeq2SeqLM.from_pretrained(GEN_MODEL)
                gen.eval()
                _tokenizer, _generator = tok, gen
    return _tokenizer, _generator


def warm():
    """Load both models (used by a background thread at startup)."""
    _get_embedder()
    _get_generator()


# --------------------------------------------------------------------------- #
# ingest
# --------------------------------------------------------------------------- #
def _pages_from_pdf(data):
    from pypdf import PdfReader
    reader = PdfReader(io.BytesIO(data))
    return [(i + 1, (p.extract_text() or "")) for i, p in enumerate(reader.pages)]


def _pages_from_text(data):
    text = data.decode("utf-8", errors="ignore")
    return [(1, text)]


def _chunk(pages):
    chunks = []
    for page, text in pages:
        text = " ".join(text.split())
        if not text:
            continue
        i = 0
        while i < len(text):
            piece = text[i:i + CHUNK_CHARS].strip()
            if len(piece) > 40:
                chunks.append({"text": piece, "page": page})
            i += CHUNK_CHARS - CHUNK_OVERLAP
    return chunks


def ingest(data, filename):
    """Parse + chunk + embed a document; return (doc_id, meta)."""
    lower = filename.lower()
    pages = _pages_from_pdf(data) if lower.endswith(".pdf") else _pages_from_text(data)
    chunks = _chunk(pages)
    if not chunks:
        raise ValueError("No readable text found in that file.")

    emb = _get_embedder().encode(
        [c["text"] for c in chunks], normalize_embeddings=True,
        batch_size=64, show_progress_bar=False,
    ).astype("float32")

    doc_id = uuid.uuid4().hex[:12]
    _STORE[doc_id] = {"filename": filename, "chunks": chunks, "emb": emb}
    _ORDER.append(doc_id)
    while len(_ORDER) > MAX_DOCS:
        old = _ORDER.pop(0)
        _STORE.pop(old, None)

    return doc_id, {
        "doc_id": doc_id, "filename": filename,
        "pages": pages[-1][0] if pages else 0, "chunks": len(chunks),
    }


# --------------------------------------------------------------------------- #
# retrieve + generate
# --------------------------------------------------------------------------- #
def _retrieve(doc, query, k):
    q = _get_embedder().encode([query], normalize_embeddings=True).astype("float32")[0]
    scores = doc["emb"] @ q                     # cosine (all normalized)
    idx = np.argsort(scores)[::-1][:k]
    return [{**doc["chunks"][i], "score": float(scores[i])} for i in idx]


def _build_prompt(question, sources):
    ctx, budget = [], 1600  # chars of context (keeps us within Flan-T5's window)
    for s in sources:
        if budget <= 0:
            break
        piece = s["text"][:budget]
        ctx.append(f"[p{s['page']}] {piece}")
        budget -= len(piece)
    context = "\n\n".join(ctx)
    return (
        "Answer the question using only the context below. Be concise and specific. "
        "If the answer is not in the context, reply exactly: "
        "I couldn't find that in the document.\n\n"
        f"Context:\n{context}\n\nQuestion: {question}\nAnswer:"
    )


def answer(doc_id, question):
    doc = _STORE.get(doc_id)
    if doc is None:
        raise KeyError("This document isn't loaded anymore — please re-upload it.")

    t0 = time.time()
    sources = _retrieve(doc, question, TOP_K)
    tok, gen = _get_generator()
    prompt = _build_prompt(question, sources)
    inputs = tok(prompt, return_tensors="pt", truncation=True, max_length=512)
    import torch
    with torch.no_grad():
        out = gen.generate(**inputs, max_new_tokens=128, num_beams=4,
                           early_stopping=True, do_sample=False)
    text = tok.decode(out[0], skip_special_tokens=True).strip()

    return {
        "answer": text or "I couldn't find that in the document.",
        "sources": [{"text": s["text"], "page": s["page"], "score": round(s["score"], 3)}
                    for s in sources],
        "time_ms": int((time.time() - t0) * 1000),
    }
