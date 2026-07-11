# ✦ Marginalia — an intelligent reading surface

Bring a PDF and put it to the question. Marginalia answers **from the text itself**
and shows the exact passages it drew from — retrieval-augmented generation, end to end.

Ask a document anything; get a grounded answer with **cited source passages**. No
hallucinating past the page.

## Stack

| Layer | Tech |
|-------|------|
| Retrieval | Sentence-Transformers (MiniLM) embeddings + cosine search |
| Generation | Flan-T5 (grounded only in retrieved passages) |
| Parsing | pypdf · plain text |
| API | FastAPI (`/upload`, `/ask`, `/sample`, `/health`) |
| Frontend | React + Vite + Tailwind + Framer Motion (glass UI, streaming answers) |
| Deploy | Single Docker container (weights baked in) on Google Cloud Run |

## Run locally

**Backend** (Python 3.10+):
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8002
```

**Frontend** (Node 20+), in another terminal:
```bash
cd frontend
npm install
npm run dev        # http://localhost:5175  (proxies /api -> :8002)
```

## Production container
```bash
docker build -t marginalia .     # downloads + bakes the models (first build is slow)
docker run -p 7860:7860 marginalia
# open http://localhost:7860
```

Deployed to **Google Cloud Run** — see `DEPLOY.md`. The model weights are baked into
the image at build time, so the running container never downloads anything.

---
<sub>A retrieval-augmented Q&A demo. No data is stored; nothing leaves the request.</sub>
