"""
Marginalia — retrieval-augmented document Q&A API (FastAPI).

POST /upload  (multipart file)         -> { doc_id, filename, pages, chunks }
POST /ask     (json: doc_id, question) -> { answer, sources[], time_ms }
GET  /sample                           -> loads a bundled sample doc, same shape as /upload
GET  /health                           -> { status, embed_model, gen_model }
"""

import os

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import rag

app = FastAPI(title="Marginalia")


@app.on_event("startup")
def _warm():
    # load the models in the background so the container is ready fast and the
    # first question doesn't pay the full load cost mid-request.
    import threading
    threading.Thread(target=lambda: _safe_warm(), daemon=True).start()


def _safe_warm():
    try:
        rag.warm()
    except Exception:
        pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

MAX_BYTES = 20 * 1024 * 1024
_HERE = os.path.dirname(os.path.abspath(__file__))


class AskBody(BaseModel):
    doc_id: str
    question: str


@app.get("/health")
def health():
    return {"status": "ok", "embed_model": rag.EMBED_MODEL, "gen_model": rag.GEN_MODEL}


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    raw = await file.read()
    if not raw:
        raise HTTPException(400, "Empty file.")
    if len(raw) > MAX_BYTES:
        raise HTTPException(413, "File too large (max 20 MB).")
    try:
        _, meta = rag.ingest(raw, file.filename or "document")
    except ValueError as e:
        raise HTTPException(400, str(e))
    return JSONResponse(meta)


@app.get("/sample")
def sample():
    path = os.path.join(_HERE, "sample.txt")
    with open(path, "rb") as f:
        _, meta = rag.ingest(f.read(), "Northwind Labs — Handbook.txt")
    return JSONResponse(meta)


@app.post("/ask")
def ask(body: AskBody):
    q = (body.question or "").strip()
    if not q:
        raise HTTPException(400, "Ask a question.")
    try:
        return JSONResponse(rag.answer(body.doc_id, q))
    except KeyError as e:
        raise HTTPException(404, str(e))


# Serve the built React site in production (./static exists only in the image).
_STATIC = os.path.join(_HERE, "static")
if os.path.isdir(_STATIC):
    app.mount("/", StaticFiles(directory=_STATIC, html=True), name="site")
