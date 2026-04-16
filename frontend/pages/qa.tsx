import { useState } from "react";
import Link from "next/link";
import { BookOpen, Send, Loader, MessageSquare, ArrowLeft } from "lucide-react";

interface Source { id: number; title: string; }
interface QAResult { question: string; answer: string; sources: Source[]; }

export default function QA() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<QAResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QAResult[]>([]);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/api/ask/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setResult(data);
    setHistory(prev => [data, ...prev]);
    setQuestion("");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f14", color: "#e8e6e1", fontFamily: "Georgia, serif" }}>
      <nav style={{ borderBottom: "1px solid #1e2330", padding: "1.2rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0d0f14cc", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BookOpen size={22} color="#7c9cbf" />
          <span style={{ fontSize: "1.1rem", letterSpacing: "0.08em", color: "#c8d8e8" }}>BIBLIOS</span>
        </div>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#6b7280", textDecoration: "none", fontSize: "0.85rem" }}>
          <ArrowLeft size={14} /> BACK TO LIBRARY
        </Link>
      </nav>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "3rem 2.5rem" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "#7c9cbf", marginBottom: "0.8rem" }}>AI ASSISTANT</div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "400", margin: "0 0 0.8rem" }}>Ask anything<br /><span style={{ color: "#7c9cbf" }}>about your books.</span></h1>
        <p style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: "3rem", lineHeight: "1.6" }}>
          Powered by TinyLlama running locally. Ask about themes, genres, recommendations, or any book in the library.
        </p>

        {/* Input */}
        <div style={{ display: "flex", gap: "0.8rem", marginBottom: "3rem" }}>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && ask()}
            placeholder="What books deal with human history?"
            style={{ flex: 1, background: "#13161f", border: "1px solid #1e2330", color: "#e8e6e1", padding: "0.9rem 1.2rem", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }}
          />
          <button onClick={ask} disabled={loading || !question.trim()}
            style={{ background: loading ? "#1e2330" : "#7c9cbf", color: "#0d0f14", border: "none", padding: "0.9rem 1.4rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", letterSpacing: "0.1em", fontFamily: "monospace", opacity: !question.trim() ? 0.5 : 1 }}>
            {loading ? <Loader size={16} /> : <><Send size={14} /> ASK</>}
          </button>
        </div>

        {/* Results */}
        {history.map((item, i) => (
          <div key={i} style={{ marginBottom: "2rem", borderLeft: "2px solid #1e2330", paddingLeft: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
              <MessageSquare size={13} color="#4b5563" />
              <span style={{ fontSize: "0.8rem", color: "#6b7280", fontStyle: "italic" }}>{item.question}</span>
            </div>
            <p style={{ color: "#c8d8e8", lineHeight: "1.8", fontSize: "0.95rem", margin: "0 0 0.8rem" }}>{item.answer}</p>
            {item.sources?.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {item.sources.map(s => (
                  <Link key={s.id} href={`/books/${s.id}`}
                    style={{ fontSize: "0.7rem", letterSpacing: "0.08em", color: "#7c9cbf", border: "1px solid #1e3a5f", padding: "0.2rem 0.6rem", textDecoration: "none" }}>
                    {s.title.slice(0, 30)}{s.title.length > 30 ? "..." : ""}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {history.length === 0 && (
          <div style={{ color: "#2d3748", textAlign: "center", padding: "3rem", border: "1px dashed #1e2330", fontSize: "0.85rem" }}>
            Your conversation will appear here
          </div>
        )}
      </div>
    </div>
  );
}