# Marginalia — an intelligent reading surface
# Single container: builds the React site, then runs the FastAPI RAG service
# which serves BOTH the site (/) and the API (/upload, /ask). Model weights are
# baked into the image at build time, so the running container never downloads.

# ---------- stage 1: build the React frontend ----------
FROM node:20-slim AS frontend
WORKDIR /fe
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend/ ./
ENV VITE_API_BASE=""
RUN npm run build

# ---------- stage 2: python backend + baked models ----------
FROM python:3.10-slim
WORKDIR /app

# CPU torch first (avoids the huge CUDA wheel), then the RAG + API deps
RUN pip install --no-cache-dir torch==2.2.2 --index-url https://download.pytorch.org/whl/cpu \
 && pip install --no-cache-dir \
      transformers==4.44.2 sentence-transformers==3.0.1 sentencepiece pypdf \
      fastapi==0.115.* "uvicorn[standard]==0.30.*" python-multipart==0.0.* "numpy<2" hf_transfer

# bake the weights into the image (MiniLM + Flan-T5-base) — one-time at build
ENV HF_HUB_ENABLE_HF_TRANSFER=1
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2'); from transformers import AutoTokenizer, AutoModelForSeq2SeqLM; AutoTokenizer.from_pretrained('google/flan-t5-base'); AutoModelForSeq2SeqLM.from_pretrained('google/flan-t5-base')"

# from here on, never touch the network for models
ENV TRANSFORMERS_OFFLINE=1
ENV HF_HUB_OFFLINE=1

COPY backend/ ./
COPY --from=frontend /fe/dist ./static

ENV PORT=7860
EXPOSE 7860
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-7860}"]
