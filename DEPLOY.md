# Deploying Marginalia to Google Cloud Run

One Docker container (React site + FastAPI + RAG models). Cloud Run runs it and
scales to zero (~$0 for demo traffic). The model weights are **baked into the
image at build time** — so, unlike the other apps, there's no model file to fetch.

Final URL looks like: `https://marginalia-xxxxxxxx-uc.a.run.app`

> Reuses the same Google Cloud project as the other two apps — billing + build
> service-account IAM are already in place.

---

## 1. Deploy (Cloud Shell)
```bash
git clone https://github.com/kamranahmed678/marginalia
cd marginalia
gcloud run deploy marginalia \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300
```
- **Y** to create the Artifact Registry repo if asked.
- The build downloads + bakes Flan-T5 and MiniLM, so it's the slowest build of the
  three — **~12–16 min** the first time. That's expected.
- Prints a **Service URL** — that's the live app. ✦

---

## Notes
- **Memory:** `4Gi` — Flan-T5-base + torch needs headroom when loading. If a deploy
  ever OOMs on startup, it's already at a comfortable size; don't drop below `2Gi`.
- **Cold start:** scale-to-zero means the first hit wakes the container and loads
  the model (~30–50 s). A background warmup starts as soon as the container boots,
  so if the page has been open a moment, the first question is usually quick.
- **Image size:** this image is large (~3 GB with torch + baked models), so it
  adds a few cents/month of Artifact Registry storage. Still pennies.
- **Updates:** re-run `gcloud run deploy marginalia --source .` after `git pull`.

## Troubleshooting
- **Build fails / OOM during build:** the model-baking step needs memory; Cloud
  Build's default machine is fine, but if it fails, add `--machine-type=e2-highcpu-8`
  to the deploy (Cloud Build) or build the image separately with more memory.
- **Container killed on startup:** raise `--memory` (already 4Gi).
- **First question slow:** that's the cold-start model load; it's fast afterwards.
