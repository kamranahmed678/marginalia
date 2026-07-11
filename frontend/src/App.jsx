import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo, { LogoMark } from "./components/Logo";
import Icon from "./components/Icons";
import Background from "./components/Background";
import DocChat from "./components/DocChat";

const METHOD = [
  ["Parse", "Your document is split into overlapping passages, each keeping its page."],
  ["Embed", "Every passage becomes a vector of meaning via a sentence-transformer."],
  ["Retrieve", "Your question finds the nearest passages by sense, not keywords."],
  ["Answer", "A model composes a reply from those passages — and cites each one."],
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <a className="brand" href="#top" style={{ textDecoration: "none" }}><Logo /></a>
        <nav className="nav-links">
          <a href="#how" className="hide-sm">How it works</a>
          <a href="#about" className="hide-sm">About</a>
          <a href="https://github.com" className="btn btn-ghost" style={{ padding: "8px 14px" }}>
            <Icon name="github" size={16} /> Source
          </a>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <Background />
      <Nav />

      {/* hero + answer engine */}
      <section id="top" className="container hero">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <span className="pill"><span className="dot" /> Retrieval-augmented Q&amp;A</span>
          <h1>Ask your documents <em className="gold-text">anything.</em></h1>
          <p className="hero-sub">
            Bring a PDF and put it to the question. Marginalia answers from the text itself —
            and shows you the exact passages it drew from, so you can trust every word.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}>
          <DocChat />
        </motion.div>
      </section>

      {/* how it works */}
      <section id="how" className="section">
        <div className="container">
          <motion.div className="section-head" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="eyebrow">How it works</span>
            <h2 className="section-title">Grounded, never guessed</h2>
            <p className="section-sub">Marginalia retrieves the passages that bear on your question first, then answers only from them — and cites where each answer came from.</p>
          </motion.div>
          <div className="steps">
            {METHOD.map(([h, p], i) => (
              <motion.div className="glass step" key={h}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                <div className="n">0{i + 1}</div>
                <h4>{h}</h4>
                <p>{p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="container"><hr className="divider-soft" /></div>

      {/* about */}
      <section id="about" className="section">
        <div className="container">
          <motion.div className="section-head" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="eyebrow">Under the hood</span>
            <h2 className="section-title">A real RAG pipeline</h2>
            <p className="section-sub">
              Documents are chunked and embedded with a sentence-transformer, searched by cosine similarity,
              and answered by a Flan-T5 model prompted only with the retrieved passages. A FastAPI service
              runs the models; this React app is the surface. Nothing is stored — nothing leaves the request.
            </p>
          </motion.div>
          <div className="badges">
            {[["search", "Sentence-Transformers"], ["layers", "Vector retrieval"], ["spark", "Flan-T5"], ["file", "PDF parsing"], ["bolt", "FastAPI"], ["gauge", "React"]].map(([ic, b]) => (
              <span className="badge-chip" key={b}><Icon name={ic} size={15} style={{ color: "var(--gold)" }} /> {b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="footer">
        <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={22} />
            <span>Marginalia — an intelligent reading surface</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#how">How it works</a>
            <a href="#about">About</a>
            <a href="https://github.com">Source ↗</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
