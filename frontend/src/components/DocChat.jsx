import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { uploadDocument, loadSample, ask } from "../api";
import Icon from "./Icons";

const SAMPLE_QS = [
  "How many vacation days do I get?",
  "Is two-factor authentication required?",
  "How are decisions made at Northwind?",
];
const GENERIC_QS = ["What is this document about?", "Summarise the key points"];

function WordFade({ text }) {
  const parts = text.split(/(\s+)/);
  let w = -1;
  return (
    <>
      {parts.map((p, i) => {
        if (!p.trim()) return <span key={i}>{p}</span>;
        w += 1;
        return <span key={i} className="w" style={{ animationDelay: `${Math.min(w * 0.022, 1.4)}s` }}>{p}</span>;
      })}
    </>
  );
}

function SourceCard({ s }) {
  const [open, setOpen] = useState(false);
  return (
    <button className={`srccard ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="h"><span>✦ Page {s.page}</span><span className="pct">{Math.round(s.score * 100)}% match</span></div>
      <div className="snip">{s.text}</div>
    </button>
  );
}

function Answer({ ex }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="answer"><WordFade text={ex.a} /></div>
      {ex.sources?.length > 0 && (
        <>
          <div className="srclabel">Sources · {ex.sources.length} passages</div>
          <div className="srcgrid">
            {ex.sources.map((s, i) => <SourceCard key={i} s={s} />)}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function DocChat() {
  const [doc, setDoc] = useState(null);
  const [docBusy, setDocBusy] = useState(false);
  const [exchanges, setExchanges] = useState([]);
  const [asking, setAsking] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState(SAMPLE_QS);
  const inputRef = useRef(null);

  const useSample = async () => {
    setDocBusy(true); setError("");
    try { setDoc(await loadSample()); setExchanges([]); setSuggestions(SAMPLE_QS); }
    catch (e) { setError(e.message); }
    setDocBusy(false);
  };
  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setDocBusy(true); setError("");
    try { setDoc(await uploadDocument(f)); setExchanges([]); setSuggestions(GENERIC_QS); }
    catch (e) { setError(e.message); }
    setDocBusy(false);
  };
  const submit = async (q) => {
    const question = (q ?? input).trim();
    if (!question || !doc || asking) return;
    setInput(""); setError("");
    setExchanges((x) => [...x, { q: question, pending: true }]);
    setAsking(true);
    try {
      const r = await ask(doc.doc_id, question);
      setExchanges((x) => x.map((e, i) => i === x.length - 1 ? { q: question, a: r.answer, sources: r.sources } : e));
    } catch (e) {
      setExchanges((x) => x.map((ex, i) => i === x.length - 1 ? { q: question, a: `⚠ ${e.message}`, sources: [] } : ex));
    }
    setAsking(false);
    inputRef.current?.focus();
  };

  return (
    <div className="glass surface">
      <div className="surface-inner">
        <div className="docbar">
          <div className="d">
            <Icon name={doc ? "file" : "spark"} size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {doc ? doc.filename : "No document loaded"}
              </div>
              {doc && <div className="m">{doc.pages} page{doc.pages > 1 ? "s" : ""} · {doc.chunks} passages indexed</div>}
            </div>
          </div>
          {doc && (
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button className="mini" onClick={() => document.getElementById("mg-file").click()}>Replace</button>
              <button className="mini" onClick={useSample} disabled={docBusy}>Sample</button>
            </div>
          )}
        </div>

        <div className="stage">
          {!doc ? (
            <div style={{ margin: "auto 0" }}>
              <div className="dropzone" onClick={() => document.getElementById("mg-file").click()}>
                <Icon name="upload" size={24} style={{ color: "var(--gold)" }} />
                <div className="font-display" style={{ fontSize: 24, marginTop: 10 }}>Bring a document</div>
                <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 5 }}>PDF or plain text · up to 20&nbsp;MB</div>
              </div>
              <div style={{ textAlign: "center", margin: "16px 0" }}>
                <button className="btn btn-ghost" onClick={useSample} disabled={docBusy}>
                  <Icon name="book" size={16} /> {docBusy ? "Opening…" : "Try the sample handbook"}
                </button>
              </div>
              {error && <div style={{ color: "var(--rose)", fontSize: 13, textAlign: "center" }}>{error}</div>}
            </div>
          ) : (
            <>
              {exchanges.length === 0 ? (
                <div style={{ margin: "auto 0", textAlign: "center" }}>
                  <div className="font-display" style={{ fontSize: 26, color: "var(--ink-soft)" }}>
                    Ask <em style={{ fontStyle: "italic" }}>{doc.filename.replace(/\.[^.]+$/, "")}</em> anything.
                  </div>
                  <div className="suggests" style={{ justifyContent: "center", marginTop: 18 }}>
                    {suggestions.map((q) => <button key={q} className="suggest" onClick={() => submit(q)}>{q}</button>)}
                  </div>
                </div>
              ) : (
                <div className="qa">
                  {exchanges.map((ex, i) => (
                    <div key={i}>
                      <div className="q-row"><div className="qb">Q</div><div className="qt">{ex.q}</div></div>
                      <div style={{ marginTop: 14 }}>
                        {ex.pending
                          ? <div className="thinking">Reading the passages<span className="dots"><span /><span /><span /></span></div>
                          : <Answer ex={ex} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="ask">
                <div className="field">
                  <Icon name="search" size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
                  <input ref={inputRef} value={input} placeholder="Ask the document…" disabled={asking}
                    onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
                </div>
                <button className="send" disabled={asking || !input.trim()} onClick={() => submit()}>
                  <Icon name="send" size={17} />
                </button>
              </div>
              {error && <div style={{ color: "var(--rose)", fontSize: 13, marginTop: 10 }}>{error}</div>}
            </>
          )}
        </div>
      </div>
      <input id="mg-file" type="file" accept=".pdf,.txt,text/plain,application/pdf" onChange={onFile} hidden />
    </div>
  );
}
