import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BookOpen, Star, ExternalLink, ArrowLeft, Sparkles, Loader } from "lucide-react";

interface Book {
  id: number; title: string; author: string; rating: number;
  genre: string; description: string; url: string; summary: string; sentiment: string;
}

const GENRE_COLORS: Record<string, string> = {
  "Mystery": "#8b5e3c", "Romance": "#a0522d", "History": "#6b4c2a",
  "Science": "#4a7c59", "Fiction": "#5c6b7a", "Thriller": "#7a3b3b",
  "Poetry": "#7a5c6b", "Default": "#8b7355",
};

const SENTIMENT_COLORS: Record<string, string> = {
  Positive: "#4a7c59", Uplifting: "#4a7c59", Romantic: "#a0522d",
  Dark: "#7a3b3b", Thrilling: "#8b5e3c", Mysterious: "#7a5c6b",
  Neutral: "#8b7355", Negative: "#7a3b3b",
};

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<Book | null>(null);
  const [recs, setRecs] = useState<Book[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsDone, setInsightsDone] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  if (!book) return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b7355", fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>
      Opening book...
    </div>
  );

  const color = GENRE_COLORS[book.genre] || GENRE_COLORS.Default;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", color: "#2c1f0e", fontFamily: "'EB Garamond', Georgia, serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        ::selection { background: #8b5e3c44; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f5f0e8; }
        ::-webkit-scrollbar-thumb { background: #d4c4a0; }
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
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#c8b89a18 1px, transparent 1px), linear-gradient(90deg, #c8b89a18 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div style={{ position: "absolute", right: "6%", top: "10%", bottom: "10%", display: "flex", gap: "8px", opacity: 0.12 }}>
          {[50, 35, 60, 40, 55].map((w, i) => (
            <div key={i} style={{ width: `${w * 0.4}px`, height: "100%", background: `hsl(${25 + i * 15}, 40%, ${35 + i * 5}%)`, borderRadius: "2px 0 0 2px" }} />
          ))}
        </div>

        {/* ✅ Fixed: max-width container matching homepage */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3.5rem 3rem 2.5rem", position: "relative" }}>
          {book.genre && (
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color, marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ height: "1px", width: "20px", background: color }} />
              {book.genre.toUpperCase()}
            </div>
          )}
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "400", margin: "0 0 1rem", lineHeight: "1.15", color: "#1a0f00" }}>
            {book.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.85rem", color: "#8b7355", flexWrap: "wrap" }}>
            {book.author && <span style={{ fontStyle: "italic" }}>{book.author}</span>}
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Star size={12} color={color} fill={color} />
              <span style={{ color }}>{book.rating} / 5</span>
            </div>
            {book.sentiment && (
              <span style={{ color: SENTIMENT_COLORS[book.sentiment] || color, fontSize: "0.75rem", letterSpacing: "0.12em", border: `1px solid ${SENTIMENT_COLORS[book.sentiment] || color}55`, padding: "0.15rem 0.6rem" }}>
                {book.sentiment.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem" }}>

        {/* Description */}
        {book.description && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#8b7355", marginBottom: "1rem" }}>ABOUT THIS BOOK</div>
            <div style={{ borderLeft: `3px solid ${color}44`, paddingLeft: "1.5rem" }}>
              <p style={{ color: "#4a3728", lineHeight: "1.9", fontSize: "1.05rem", margin: 0 }}>
                {expanded ? book.description : book.description.slice(0, 400)}
                {book.description.length > 400 && (
                  <button onClick={() => setExpanded(!expanded)}
                    style={{ background: "none", border: "none", color, cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit", marginLeft: "0.4rem", textDecoration: "underline" }}>
                    {expanded ? "show less" : "...read more"}
                  </button>
                )}
              </p>
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div style={{ background: "linear-gradient(135deg, #ede6d6, #e8dcc8)", border: "1px solid #d4c4a0", borderLeft: `4px solid ${color}`, padding: "2rem", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", letterSpacing: "0.18em", color }}>
              <Sparkles size={14} />
              AI INSIGHTS
            </div>
            {!insightsDone && (
              <button onClick={generateInsights} disabled={loadingInsights}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: color, color: "#f5f0e8", border: "none", padding: "0.6rem 1.2rem", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: loadingInsights ? "not-allowed" : "pointer", fontFamily: "monospace", opacity: loadingInsights ? 0.7 : 1 }}>
                {loadingInsights ? <><Loader size={12} /> GENERATING...</> : "GENERATE INSIGHTS"}
              </button>
            )}
          </div>

          {insightsDone ? (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {book.summary && (
                <div>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "#8b7355", marginBottom: "0.5rem" }}>SUMMARY</div>
                  <p style={{ color: "#4a3728", lineHeight: "1.8", fontSize: "0.95rem", margin: 0 }}>{book.summary}</p>
                </div>
              )}
              {book.sentiment && (
                <div>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "#8b7355", marginBottom: "0.5rem" }}>TONE & SENTIMENT</div>
                  <span style={{ color: SENTIMENT_COLORS[book.sentiment] || color, fontSize: "0.95rem" }}>{book.sentiment}</span>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#8b7355", fontSize: "0.9rem", margin: 0, fontStyle: "italic" }}>
              Click "Generate Insights" to get an AI-powered summary and sentiment analysis for this book.
            </p>
          )}
        </div>

        {/* External link */}
        {book.url && (
          <a href={book.url} target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color, fontSize: "0.8rem", letterSpacing: "0.1em", textDecoration: "none", marginBottom: "2.5rem", borderBottom: `1px dashed ${color}` }}>
            <ExternalLink size={13} /> VIEW ON SOURCE SITE
          </a>
        )}

        {/* Recommendations */}
        {recs.length > 0 && (
          <div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#8b7355", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ height: "1px", flex: 1, background: "#d4c4a0" }} />
              YOU MIGHT ALSO LIKE
              <div style={{ height: "1px", flex: 1, background: "#d4c4a0" }} />
            </div>
            <div style={{ display: "grid", gap: "1px", background: "#d4c4a0" }}>
              {recs.map(rec => {
                const recColor = GENRE_COLORS[rec.genre] || GENRE_COLORS.Default;
                return (
                  <Link key={rec.id} href={`/books/${rec.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#f5f0e8", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${recColor}44`, transition: "all 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#ede6d6"; (e.currentTarget as HTMLElement).style.borderLeftColor = recColor; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#f5f0e8"; (e.currentTarget as HTMLElement).style.borderLeftColor = `${recColor}44`; }}>
                      <span style={{ color: "#2c1f0e", fontSize: "0.95rem", fontFamily: "'Playfair Display', serif" }}>{rec.title}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Star size={11} color={recColor} fill={recColor} />
                        <span style={{ fontSize: "0.8rem", color: recColor }}>{rec.rating}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
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
  );
}