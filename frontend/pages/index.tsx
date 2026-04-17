import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Star, ChevronRight, Grid, List } from "lucide-react";

interface Book {
  id: number; title: string; author: string; rating: number;
  genre: string; description: string; url: string;
}

const GENRE_COLORS: Record<string, string> = {
  "Mystery": "#c084fc", "Romance": "#f472b6", "History": "#fb923c",
  "Science": "#34d399", "Fiction": "#60a5fa", "Thriller": "#f87171",
  "Poetry": "#a78bfa", "Default": "#7c9cbf",
};

const BOOK_PATTERNS = [
  "repeating-linear-gradient(45deg, #1a1f2e 0px, #1a1f2e 2px, transparent 2px, transparent 8px)",
  "repeating-linear-gradient(-45deg, #1a1f2e 0px, #1a1f2e 2px, transparent 2px, transparent 8px)",
  "repeating-linear-gradient(90deg, #1a1f2e 0px, #1a1f2e 1px, transparent 1px, transparent 12px)",
  "radial-gradient(circle at 20% 80%, #1a1f2e 1px, transparent 1px), radial-gradient(circle at 80% 20%, #1a1f2e 1px, transparent 1px)",
  "repeating-linear-gradient(0deg, #1a1f2e 0px, #1a1f2e 1px, transparent 1px, transparent 10px)",
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/books/")
      .then(r => r.json())
      .then(data => { setBooks(data); setLoading(false); });
  }, []);

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.genre.toLowerCase().includes(search.toLowerCase())
  );

  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0b0f", color: "#e8e4dc", fontFamily: "'EB Garamond', Georgia, serif" }}>

      {/* Decorative top border */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, transparent, #7c9cbf, #c8d8e8, #7c9cbf, transparent)" }} />

      {/* Navbar */}
      <nav style={{ borderBottom: "1px solid #1a1f2e", padding: "1.2rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0a0b0fee", backdropFilter: "blur(16px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <BookOpen size={20} color="#7c9cbf" />
          <span style={{ fontSize: "1.3rem", letterSpacing: "0.15em", color: "#c8d8e8", fontFamily: "'Playfair Display', serif" }}>BIBLIOS</span>
        </div>
        <div style={{ display: "flex", gap: "2.5rem", fontSize: "0.8rem", letterSpacing: "0.12em" }}>
          <Link href="/" style={{ color: "#c8d8e8", textDecoration: "none", borderBottom: "1px solid #7c9cbf", paddingBottom: "2px" }}>LIBRARY</Link>
          <Link href="/qa" style={{ color: "#4b5563", textDecoration: "none" }}>ASK AI</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid #1a1f2e" }}>
        {/* Background decorative grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#1a1f2e 1px, transparent 1px), linear-gradient(90deg, #1a1f2e 1px, transparent 1px)", backgroundSize: "60px 60px", opacity: 0.3 }} />
        
        {/* Decorative book spines on right */}
        <div style={{ position: "absolute", right: "5%", top: "10%", display: "flex", gap: "6px", height: "80%", opacity: 0.15 }}>
          {[80, 60, 90, 70, 55, 85, 65].map((w, i) => (
            <div key={i} style={{ width: `${w * 0.3}px`, height: "100%", background: `hsl(${200 + i * 20}, 30%, ${15 + i * 2}%)`, borderRadius: "2px 0 0 2px" }} />
          ))}
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 3rem", position: "relative" }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", color: "#7c9cbf", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <div style={{ height: "1px", width: "30px", background: "#7c9cbf" }} />
            AI-POWERED BOOK INTELLIGENCE
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: "400", lineHeight: "1.05", margin: "0 0 1.5rem", maxWidth: "700px" }}>
            Discover books.<br />
            <em style={{ color: "#7c9cbf", fontStyle: "italic" }}>Ask anything.</em>
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#6b7280", maxWidth: "480px", lineHeight: "1.8", marginBottom: "2.5rem" }}>
            A curated library with AI-generated insights, sentiment analysis, and intelligent Q&A over your entire collection.
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/qa" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#7c9cbf", color: "#0a0b0f", padding: "0.9rem 2rem", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "0.12em", fontFamily: "monospace", fontWeight: "600" }}>
              ASK THE AI <ChevronRight size={14} />
            </Link>
            <span style={{ fontSize: "0.8rem", color: "#2d3748" }}>or browse below</span>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ borderTop: "1px solid #1a1f2e", padding: "1.2rem 3rem", display: "flex", gap: "0", maxWidth: "1100px", margin: "0 auto" }}>
          {[["BOOKS", books.length], ["GENRES", genres.length], ["AI", "Active"], ["MODEL", "TinyLlama"]].map(([label, val], i) => (
            <div key={label} style={{ paddingRight: "3rem", marginRight: "3rem", borderRight: i < 3 ? "1px solid #1a1f2e" : "none" }}>
              <div style={{ fontSize: "1.5rem", color: "#c8d8e8", fontFamily: "'Playfair Display', serif" }}>{val}</div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "#374151" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 3rem" }}>

        {/* Search + View Toggle */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.8rem", background: "#0f111a", border: "1px solid #1a1f2e", padding: "0.8rem 1.2rem" }}>
            <Search size={15} color="#374151" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, author or genre..."
              style={{ background: "transparent", border: "none", outline: "none", color: "#e8e4dc", fontSize: "1rem", width: "100%", fontFamily: "'EB Garamond', serif" }} />
          </div>
          <button onClick={() => setView("grid")} style={{ padding: "0.8rem", background: view === "grid" ? "#1a1f2e" : "transparent", border: "1px solid #1a1f2e", color: view === "grid" ? "#7c9cbf" : "#374151", cursor: "pointer" }}>
            <Grid size={16} />
          </button>
          <button onClick={() => setView("list")} style={{ padding: "0.8rem", background: view === "list" ? "#1a1f2e" : "transparent", border: "1px solid #1a1f2e", color: view === "list" ? "#7c9cbf" : "#374151", cursor: "pointer" }}>
            <List size={16} />
          </button>
        </div>

        {/* Genre Filter Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {genres.slice(0, 12).map(genre => (
            <button key={genre} onClick={() => setSearch(genre)}
              style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: GENRE_COLORS[genre] || GENRE_COLORS.Default, border: `1px solid ${GENRE_COLORS[genre] || GENRE_COLORS.Default}33`, padding: "0.3rem 0.8rem", background: "transparent", cursor: "pointer", fontFamily: "monospace" }}>
              {genre.toUpperCase()}
            </button>
          ))}
          {search && <button onClick={() => setSearch("")} style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "#f87171", border: "1px solid #f8717133", padding: "0.3rem 0.8rem", background: "transparent", cursor: "pointer", fontFamily: "monospace" }}>CLEAR ×</button>}
        </div>

        {loading ? (
          <div style={{ color: "#374151", textAlign: "center", padding: "5rem", fontSize: "1.1rem" }}>Opening the library...</div>
        ) : view === "grid" ? (
          /* GRID VIEW — Book Spine Style */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1.5rem" }}>
            {filtered.map((book, idx) => {
              const color = GENRE_COLORS[book.genre] || GENRE_COLORS.Default;
              const pattern = BOOK_PATTERNS[idx % BOOK_PATTERNS.length];
              return (
                <Link key={book.id} href={`/books/${book.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ cursor: "pointer" }}
                    onMouseEnter={e => { (e.currentTarget.querySelector('.book-cover') as HTMLElement)!.style.transform = "translateY(-6px)"; (e.currentTarget.querySelector('.book-cover') as HTMLElement)!.style.boxShadow = `0 16px 40px ${color}33`; }}
                    onMouseLeave={e => { (e.currentTarget.querySelector('.book-cover') as HTMLElement)!.style.transform = "translateY(0)"; (e.currentTarget.querySelector('.book-cover') as HTMLElement)!.style.boxShadow = `0 4px 16px #00000066`; }}>
                    {/* Book Cover */}
                    <div className="book-cover" style={{ height: "220px", background: `#0f111a`, backgroundImage: pattern, backgroundSize: "8px 8px", border: `1px solid ${color}44`, borderLeft: `4px solid ${color}`, position: "relative", transition: "transform 0.3s ease, box-shadow 0.3s ease", boxShadow: "0 4px 16px #00000066", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1rem 0.8rem", overflow: "hidden" }}>
                      {/* Spine accent */}
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: color }} />
                      
                      <div>
                        <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: color, marginBottom: "0.5rem", fontFamily: "monospace" }}>
                          {book.genre?.toUpperCase().slice(0, 10) || "BOOK"}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#c8d8e8", lineHeight: "1.3", fontFamily: "'Playfair Display', serif" }}>
                          {book.title.slice(0, 50)}{book.title.length > 50 ? "..." : ""}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Star size={10} color={color} fill={color} />
                        <span style={{ fontSize: "0.75rem", color: color }}>{book.rating}</span>
                      </div>
                    </div>
                    {/* Book label below */}
                    <div style={{ padding: "0.6rem 0.2rem" }}>
                      <div style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: "1.3", fontFamily: "'EB Garamond', serif" }}>
                        {book.title.slice(0, 35)}{book.title.length > 35 ? "..." : ""}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div style={{ display: "grid", gap: "1px", background: "#1a1f2e" }}>
            {filtered.map(book => {
              const color = GENRE_COLORS[book.genre] || GENRE_COLORS.Default;
              return (
                <Link key={book.id} href={`/books/${book.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#0a0b0f", padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${color}44`, transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#0f111a"; (e.currentTarget as HTMLElement).style.borderLeftColor = color; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#0a0b0f"; (e.currentTarget as HTMLElement).style.borderLeftColor = `${color}44`; }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "1rem", color: "#c8d8e8", fontFamily: "'Playfair Display', serif", marginBottom: "0.3rem" }}>{book.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#374151" }}>{book.description?.slice(0, 90)}{book.description?.length > 90 ? "..." : ""}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "1.5rem", flexShrink: 0 }}>
                      {book.genre && <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color, fontFamily: "monospace" }}>{book.genre.toUpperCase()}</span>}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Star size={11} color={color} fill={color} />
                        <span style={{ fontSize: "0.8rem", color }}>{book.rating}</span>
                      </div>
                      <ChevronRight size={14} color="#1a1f2e" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1a1f2e", marginTop: "4rem", padding: "2rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BookOpen size={16} color="#374151" />
          <span style={{ fontSize: "0.8rem", letterSpacing: "0.1em", color: "#374151", fontFamily: "'Playfair Display', serif" }}>BIBLIOS</span>
        </div>
        <div style={{ fontSize: "0.7rem", color: "#1e2330", letterSpacing: "0.1em" }}>AI-POWERED BOOK INTELLIGENCE</div>
      </div>
    </div>
  );
}