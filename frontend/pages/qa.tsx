import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { BookOpen, Send, Loader, MessageSquare, ArrowLeft, Sparkles } from "lucide-react";

interface Source { id: number; title: string; }
interface QAResult { question: string; answer: string; sources: Source[]; }

export default function QA() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QAResult[]>([]);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const q = question;
    setQuestion("");
    const res = await fetch("http://127.0.0.1:8000/api/ask/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
    });
    const data = await res.json();
    setHistory(prev => [{ ...data, question: q }, ...prev]);
    setLoading(false);
  };

  return (
    <>
      <Head><title>Ask AI — Biblios</title></Head>
      <div style={{ minHeight: "100vh", background: "#f5f0e8", color: "#2c1f0e", fontFamily: "'EB Garamond', Georgia, serif" }}>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        {/* Top border */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #8b5e3c, #c8a876, #8b5e3c, #c8a876, #8b5e3c)" }} />

        {/* Navbar */}
        <nav style={{ borderBottom: "1px solid #d4c4a0", padding: "1.2rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#f5f0e8ee", backdropFilter: "blur(16px)", zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <BookOpen size={20} color="#8b5e3c" />
            <span style={{ fontSize: "1.3rem", letterSpacing: "0.15em", color: "#2c1f0e", fontFamily: "'Playfair Display', serif" }}>BIBLIOS</span>
          </div>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#8b7355", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            <ArrowLeft size={14} /> BACK TO LIBRARY
          </Link>
        </nav>

        {/* Hero band */}
        <div style={{ background: "linear-gradient(160deg, #ede6d6, #e0d4b8)", borderBottom: "1px solid #d4c4a0", padding: "0", position: "relative", overflow: "hidden" }}>

          {/* Background grid texture */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#c8b89a18 1px, transparent 1px), linear-gradient(90deg, #c8b89a18 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          {/* Decorative open book SVG — right side */}
          <div style={{ position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)", opacity: 0.15 }}>
            <svg width="280" height="220" viewBox="0 0 340 260" fill="none">
              <rect x="10" y="20" width="155" height="220" rx="4" fill="#8b5e3c" />
              <rect x="175" y="20" width="155" height="220" rx="4" fill="#8b5e3c" />
              <rect x="160" y="15" width="20" height="230" rx="3" fill="#6b4c2a" />
              {[40, 60, 80, 100, 120, 140, 160, 180, 200].map((y, i) => (
                <g key={i}>
                  <line x1="25" y1={y} x2="155" y2={y} stroke="#f5f0e8" strokeWidth="2" opacity="0.8" />
                  <line x1="185" y1={y} x2="325" y2={y} stroke="#f5f0e8" strokeWidth="2" opacity="0.8" />
                </g>
              ))}
            </svg>
          </div>

          {/* Hero content */}
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3.5rem 3rem 2.5rem", position: "relative" }}>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", color: "#8b5e3c", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ height: "1px", width: "20px", background: "#8b5e3c" }} />
              AI ASSISTANT
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "400", margin: "0 0 1.2rem", color: "#1a0f00", lineHeight: "1.15" }}>
              Ask anything<br /><em style={{ color: "#8b5e3c" }}>about your books.</em>
            </h1>

            <p style={{ color: "#6b5a3e", fontSize: "1.05rem", lineHeight: "1.8", margin: "0 0 2rem", maxWidth: "520px" }}>
              Powered by Claude AI — ask about themes, hidden meanings, genre recommendations, or anything across the entire library. The more specific your question, the better the answer.
            </p>

            <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
              {[
                { label: "Recommendations", hint: "Find your next read" },
                { label: "Themes & Tone", hint: "Explore book moods" },
                { label: "Comparisons", hint: "Which book suits me?" },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", color: "#8b5e3c", marginBottom: "0.25rem" }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: "0.85rem", color: "#8b7355", fontStyle: "italic" }}>{item.hint}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ maxWidth: "750px", margin: "0 auto", padding: "3rem" }}>

          {/* Input box */}
          <div style={{ background: "linear-gradient(135deg, #ede6d6, #e8dcc8)", border: "1px solid #d4c4a0", borderLeft: "4px solid #8b5e3c", padding: "1.5rem", marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", letterSpacing: "0.18em", color: "#8b5e3c", marginBottom: "1rem" }}>
              <Sparkles size={13} /> ASK A QUESTION
            </div>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && ask()}
                placeholder="What books deal with human history?"
                style={{ flex: 1, background: "#f5f0e8", border: "1px solid #d4c4a0", color: "#2c1f0e", padding: "0.9rem 1.2rem", fontSize: "1rem", fontFamily: "'EB Garamond', serif", outline: "none" }}
              />
              <button onClick={ask} disabled={loading || !question.trim()}
                style={{ background: loading ? "#d4c4a0" : "#8b5e3c", color: "#f5f0e8", border: "none", padding: "0.9rem 1.4rem", cursor: loading || !question.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", letterSpacing: "0.1em", fontFamily: "monospace", transition: "background 0.2s" }}>
                {loading ? <Loader size={16} /> : <><Send size={14} /> ASK</>}
              </button>
            </div>

            {/* Sample questions */}
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["Books about love?", "Best mystery books?", "Recommend a thriller"].map(q => (
                <button key={q} onClick={() => setQuestion(q)}
                  style={{ fontSize: "0.72rem", color: "#8b7355", border: "1px solid #d4c4a0", padding: "0.25rem 0.7rem", background: "#f5f0e8", cursor: "pointer", fontFamily: "inherit" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#8b7355", padding: "1.5rem", borderLeft: "3px solid #d4c4a0", marginBottom: "1.5rem", fontStyle: "italic" }}>
              <Loader size={16} /> Searching through the library...
            </div>
          )}

          {/* History */}
          {history.map((item, i) => (
            <div key={i} style={{ marginBottom: "2rem", animation: i === 0 ? "fadeIn 0.4s ease" : "none" }}>

              {/* Question */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem", marginBottom: "1rem" }}>
                <MessageSquare size={14} color="#8b7355" style={{ marginTop: "4px", flexShrink: 0 }} />
                <span style={{ fontSize: "0.95rem", color: "#6b5a3e", fontStyle: "italic" }}>{item.question}</span>
              </div>

              {/* Answer */}
              <div style={{ background: "linear-gradient(135deg, #ede6d6, #e8dcc8)", border: "1px solid #d4c4a0", borderLeft: "3px solid #8b5e3c", padding: "1.5rem", marginBottom: "0.8rem" }}>
                <p style={{ color: "#2c1f0e", lineHeight: "1.85", fontSize: "1rem", margin: 0 }}>{item.answer}</p>
              </div>

              {/* Sources */}
              {item.sources?.length > 0 && (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "#8b7355" }}>SOURCES:</span>
                  {item.sources.map(s => (
                    <Link key={s.id} href={`/books/${s.id}`}
                      style={{ fontSize: "0.72rem", color: "#8b5e3c", border: "1px solid #8b5e3c55", padding: "0.2rem 0.6rem", textDecoration: "none", background: "#f5f0e8", fontFamily: "monospace" }}>
                      {s.title.slice(0, 28)}{s.title.length > 28 ? "..." : ""}
                    </Link>
                  ))}
                </div>
              )}

              {i < history.length - 1 && <div style={{ height: "1px", background: "#d4c4a0", marginTop: "2rem" }} />}
            </div>
          ))}

          {/* Empty state */}
          {history.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "3rem", border: "1px dashed #d4c4a0", color: "#c8b89a", fontSize: "0.9rem", fontStyle: "italic" }}>
              Your conversation will appear here
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #d4c4a0", marginTop: "4rem", padding: "2rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ede6d6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <BookOpen size={16} color="#8b7355" />
            <span style={{ fontSize: "0.8rem", letterSpacing: "0.1em", color: "#8b7355", fontFamily: "'Playfair Display', serif" }}>BIBLIOS</span>
          </div>
          <div style={{ fontSize: "0.7rem", color: "#c8b89a", letterSpacing: "0.1em" }}>AI-POWERED BOOK INTELLIGENCE</div>
        </div>
      </div>
    </>
  );
}