import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BookOpen, Star, ExternalLink, ArrowLeft, Sparkles, Loader } from "lucide-react";

interface Book {
  id: number; title: string; author: string; rating: number;
  genre: string; description: string; url: string; summary: string; sentiment: string;
}

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<Book | null>(null);
  const [recs, setRecs] = useState<Book[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsDone, setInsightsDone] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://127.0.0.1:8000/api/books/${id}/`)
      .then(r => r.json()).then(data => { setBook(data); if (data.summary) setInsightsDone(true); });
    fetch(`http://127.0.0.1:8000/api/books/${id}/recommend/`)
      .then(r => r.json()).then(setRecs);
  }, [id]);

  const generateInsights = async () => {
    setLoadingInsights(true);
    const res = await fetch(`http://127.0.0.1:8000/api/books/${id}/insights/`, { method: "POST" });
    const data = await res.json();
    setBook(data); setInsightsDone(true); setLoadingInsights(false);
  };

  const sentimentColor: Record<string, string> = {
    Positive: "#4ade80", Uplifting: "#4ade80", Romantic: "#f472b6",
    Dark: "#f87171", Thrilling: "#fb923c", Mysterious: "#a78bfa",
    Neutral: "#7c9cbf", Negative: "#f87171",
  };

  if (!book) return (
    <div style={{ minHeight: "100vh", background: "#0d0f14", display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", fontFamily: "Georgia, serif" }}>
      Loading...
    </div>
  );

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

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          {book.genre && <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7c9cbf", marginBottom: "0.8rem" }}>{book.genre.toUpperCase()}</div>}
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: "400", margin: "0 0 0.8rem", lineHeight: "1.2" }}>{book.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", color: "#4b5563", fontSize: "0.85rem" }}>
            {book.author && <span>{book.author}</span>}
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Star size={12} color="#7c9cbf" fill="#7c9cbf" />
              <span style={{ color: "#7c9cbf" }}>{book.rating}</span>
            </div>
            {book.sentiment && (
              <span style={{ color: sentimentColor[book.sentiment] || "#7c9cbf", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                {book.sentiment.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div style={{ borderLeft: "2px solid #1e2330", paddingLeft: "1.5rem", marginBottom: "2.5rem" }}>
            <p style={{ color: "#9ca3af", lineHeight: "1.8", fontSize: "0.95rem", margin: 0 }}>{book.description}</p>
          </div>
        )}

        {/* AI Insights */}
        <div style={{ background: "#13161f", border: "1px solid #1e2330", padding: "1.8rem", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", letterSpacing: "0.15em", color: "#7c9cbf" }}>
              <Sparkles size={14} />
              AI INSIGHTS
            </div>
            {!insightsDone && (
              <button onClick={generateInsights} disabled={loadingInsights}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#7c9cbf", color: "#0d0f14", border: "none", padding: "0.5rem 1rem", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "monospace" }}>
                {loadingInsights ? <><Loader size={12} /> GENERATING...</> : "GENERATE INSIGHTS"}
              </button>
            )}
          </div>

          {insightsDone ? (
            <div style={{ display: "grid", gap: "1.2rem" }}>
              {book.summary && (
                <div>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#4b5563", marginBottom: "0.4rem" }}>SUMMARY</div>
                  <p style={{ color: "#9ca3af", lineHeight: "1.7", fontSize: "0.9rem", margin: 0 }}>{book.summary}</p>
                </div>
              )}
              {book.sentiment && (
                <div>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#4b5563", marginBottom: "0.4rem" }}>TONE</div>
                  <span style={{ color: sentimentColor[book.sentiment] || "#7c9cbf" }}>{book.sentiment}</span>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#4b5563", fontSize: "0.85rem", margin: 0 }}>Click "Generate Insights" to get AI-powered summary and sentiment analysis for this book.</p>
          )}
        </div>

        {/* External Link */}
        {book.url && (
          <a href={book.url} target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#7c9cbf", fontSize: "0.8rem", letterSpacing: "0.1em", textDecoration: "none", marginBottom: "2.5rem" }}>
            <ExternalLink size={13} /> VIEW ON SOURCE SITE
          </a>
        )}

        {/* Recommendations */}
        {recs.length > 0 && (
          <div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#4b5563", marginBottom: "1.2rem" }}>YOU MIGHT ALSO LIKE</div>
            <div style={{ display: "grid", gap: "1px", background: "#1e2330" }}>
              {recs.map(rec => (
                <Link key={rec.id} href={`/books/${rec.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#0d0f14", padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#13161f")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#0d0f14")}>
                    <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>{rec.title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Star size={11} color="#7c9cbf" fill="#7c9cbf" />
                      <span style={{ fontSize: "0.75rem", color: "#7c9cbf" }}>{rec.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}