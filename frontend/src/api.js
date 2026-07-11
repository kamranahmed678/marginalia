// API client for the Marginalia backend.
// Dev: Vite proxies /api -> http://localhost:8002 (see vite.config.js).
// Prod (single container): built with VITE_API_BASE="" so it calls the API on
// the same origin, where FastAPI serves both the site and the endpoints.
const BASE = import.meta.env.VITE_API_BASE ?? "/api";

async function unwrap(res) {
  if (!res.ok) {
    let detail = `Server error (${res.status})`;
    try {
      const j = await res.json();
      if (j.detail) detail = j.detail;
    } catch {
      /* keep default */
    }
    throw new Error(detail);
  }
  return res.json();
}

export async function uploadDocument(file) {
  const form = new FormData();
  form.append("file", file);
  return unwrap(await fetch(`${BASE}/upload`, { method: "POST", body: form }));
}

export async function loadSample() {
  return unwrap(await fetch(`${BASE}/sample`));
}

export async function ask(docId, question) {
  return unwrap(
    await fetch(`${BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doc_id: docId, question }),
    })
  );
}
