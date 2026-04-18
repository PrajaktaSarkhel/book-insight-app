import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { BookOpen, Search, Star, ChevronRight, Grid, List } from "lucide-react";

interface Book {
  id: number; title: string; author: string; rating: number;
  genre: string; description: string; url: string;
}

const GENRE_COLORS: Record<string, string> = {
  "Mystery": "#8b5e3c", "Romance": "#a0522d", "History": "#6b4c2a",
  "Science": "#4a7c59", "Fiction": "#5c6b7a", "Thriller": "#7a3b3b",
  "Poetry": "#7a5c6b", "Default": "#8b7355",
};

const BOOK_PATTERNS = [
  "repeating-linear-gradient(45deg, #c8b89a 0px, #c8b89a 1px, transparent 1px, transparent 8px)",
  "repeating-linear-gradient(-45deg, #c8b89a 0px, #c8b89a 1px, transparent 1px, transparent 8px)",
  "repeating-linear-gradient(90deg, #c8b89a 0px, #c8b89a 1px, transparent 1px, transparent 12px)",
  "repeating-linear-gradient(0deg, #c8b89a 0px, #c8b89a 1px, transparent 1px, transparent 10px)",
  "radial-gradient(circle, #c8b89a 1px, transparent 1px)",
];

const FLOATING_BOOKS = [
  { title: "Sapiens", x: 75, y: 8, rotate: 6, delay: 0, color: "#8b5e3c" },
  { title: "Dune", x: 82, y: 52, rotate: -5, delay: 0.5, color: "#6b4c2a" },
  { title: "1984", x: 88, y: 75, rotate: 5, delay: 1, color: "#7a3b3b" },
  { title: "Poetry", x: 68, y: 80, rotate: -4, delay: 1.5, color: "#7a5c6b" },
  { title: "History", x: 92, y: 30, rotate: 4, delay: 2, color: "#4a7c59" },
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/books/")
      .then(r => r.json())
      .then(data => { setBooks(data); setLoading(false); });

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.genre.toLowerCase().includes(search.toLowerCase())
  );

  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))];

  return (
    <>
      <Head><title>Biblios — AI-Powered Book Intelligence</title></Head>
      <div style={{ minHeight: "100vh", background: "#f5f0e8", color: "#2c1f0e", fontFamily: "'EB Garamond', Georgia, serif" }}>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
          @keyframes float0 { 0%,100%{transform:translateY(0px) rotate(6deg)} 50%{transform:translateY(-12px) rotate(6deg)} }
          @keyframes float1 { 0%,100%{transform:translateY(0px) rotate(-5deg)} 50%{transform:translateY(-8px) rotate(-5deg)} }
          @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(5deg)} 50%{transform:translateY(-15px) rotate(5deg)} }
          @keyframes float3 { 0%,100%{transform:translateY(0px) rotate(-4deg)} 50%{transform:translateY(-10px) rotate(-4deg)} }
          @keyframes float4 { 0%,100%{transform:translateY(0px) rotate(4deg)} 50%{transform:translateY(-6px) rotate(4deg)} }
        `}</style>

        {/* Top decorative border */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #8b5e3c, #c8a876, #8b5e3c, #c8a876, #8b5e3c)" }} />

        {/* Navbar */}
        <nav style={{ borderBottom: "1px solid #d4c4a0", padding: "1.2rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#f5f0e8ee", backdropFilter: "blur(16px)", zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <BookOpen size={20} color="#8b5e3c" />
            <span style={{ fontSize: "1.3rem", letterSpacing: "0.15em", color: "#2c1f0e", fontFamily: "'Playfair Display', serif" }}>BIBLIOS</span>
          </div>
          <div style={{ display: "flex", gap: "2.5rem", fontSize: "0.8rem", letterSpacing: "0.12em" }}>
            <Link href="/" style={{ color: "#2c1f0e", textDecoration: "none", borderBottom: "1px solid #8b5e3c", paddingBottom: "2px" }}>LIBRARY</Link>
            <Link href="/qa" style={{ color: "#8b7355", textDecoration: "none" }}>ASK AI</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div ref={heroRef} style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid #d4c4a0", background: "linear-gradient(160deg, #f0e6d0 0%, #e8d9bc 40%, #ddd0b0 100%)" }}>

          {/* Background grid texture */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#c8b89a22 1px, transparent 1px), linear-gradient(90deg, #c8b89a22 1px, transparent 1px)", backgroundSize: "60px 60px", transform: `translateY(${scrollY * 0.2}px)` }} />

          {/* Floating book cards — right side only */}
          {FLOATING_BOOKS.map((book, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${book.x}%`,
              top: `${book.y}%`,
              animation: `float${i} 6s ease-in-out infinite`,
              animationDelay: `${book.delay}s`,
              opacity: 0.2,
              zIndex: 1,
            }}>
              <div style={{ width: "60px", height: "85px", background: `linear-gradient(135deg, ${book.color}dd, ${book.color}88)`, borderRadius: "2px 6px 6px 2px", boxShadow: "4px 4px 12px #00000022, inset -3px 0 6px #00000011", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: `4px solid ${book.color}` }}>
                <span style={{ fontSize: "0.45rem", color: "#f5f0e8", letterSpacing: "0.1em", writingMode: "vertical-rl", textAlign: "center", fontFamily: "monospace" }}>{book.title}</span>
              </div>
            </div>
          ))}

          {/* Decorative open book — right background */}
          <div style={{ position: "absolute", right: "3%", top: "50%", transform: `translateY(calc(-50% + ${scrollY * 0.1}px))`, opacity: 0.06, zIndex: 1 }}>
            <svg width="340" height="260" viewBox="0 0 340 260" fill="none">
              <rect x="10" y="20" width="155" height="220" rx="4" fill="#8b5e3c" />
              <rect x="175" y="20" width="155" height="220" rx="4" fill="#8b5e3c" />
              <rect x="160" y="15" width="20" height="230" rx="3" fill="#6b4c2a" />
              {[40, 60, 80, 100, 120, 140, 160, 180, 200].map((y, i) => (
                <g key={i}>
                  <line x1="25" y1={y} x2="155" y2={y} stroke="#f5f0e8" strokeWidth="1.5" opacity="0.6" />
                  <line x1="185" y1={y} x2="325" y2={y} stroke="#f5f0e8" strokeWidth="1.5" opacity="0.6" />
                </g>
              ))}
            </svg>
          </div>

          {/* Hero Content */}
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 3rem 2rem", position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", color: "#8b5e3c", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <div style={{ height: "1px", width: "30px", background: "#8b5e3c" }} />
              AI-POWERED BOOK INTELLIGENCE
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: "400", lineHeight: "1.05", margin: "0 0 1.5rem", maxWidth: "650px", color: "#1a0f00" }}>
              Discover books.<br />
              <em style={{ color: "#8b5e3c", fontStyle: "italic" }}>Ask anything.</em>
            </h1>

            <p style={{ fontSize: "1.1rem", color: "#6b5a3e", maxWidth: "460px", lineHeight: "1.8", marginBottom: "2.5rem" }}>
              A curated library with AI-generated insights, sentiment analysis, and intelligent Q&A over your entire collection.
            </p>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/qa" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#8b5e3c", color: "#f5f0e8", padding: "0.9rem 2rem", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "0.12em", fontFamily: "monospace" }}>
                ASK THE AI <ChevronRight size={14} />
              </Link>
              <a href="#library" style={{ fontSize: "0.85rem", color: "#8b7355", textDecoration: "none", borderBottom: "1px dashed #8b7355" }}>browse library ↓</a>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ borderTop: "1px solid #d4c4a055", padding: "1.5rem 3rem", maxWidth: "1100px", margin: "0 auto", width: "100%", position: "relative", zIndex: 2, display: "flex" }}>
            {[
              ["BOOKS INDEXED", books.length],
              ["GENRES", genres.length],
              ["AI STATUS", "Active"],
              ["POWERED BY", "Claude API"],
            ].map(([label, val], i) => (
              <div key={String(label)} style={{ paddingRight: "3rem", marginRight: "3rem", borderRight: i < 3 ? "1px solid #d4c4a0" : "none" }}>
                <div style={{ fontSize: "1.5rem", color: "#1a0f00", fontFamily: "'Playfair Display', serif" }}>{val}</div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.18em", color: "#8b7355" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Library Section */}
        <div id="library" style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem" }}>

          {/* Search + View Toggle */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.8rem", background: "#ede6d6", border: "1px solid #d4c4a0", padding: "0.8rem 1.2rem" }}>
              <Search size={15} color="#8b7355" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by title, author or genre..."
                style={{ background: "transparent", border: "none", outline: "none", color: "#2c1f0e", fontSize: "1rem", width: "100%", fontFamily: "'EB Garamond', serif" }} />
            </div>
            <button onClick={() => setView("grid")}
              style={{ padding: "0.8rem", background: view === "grid" ? "#8b5e3c" : "transparent", border: "1px solid #d4c4a0", color: view === "grid" ? "#f5f0e8" : "#8b7355", cursor: "pointer" }}>
              <Grid size={16} />
            </button>
            <button onClick={() => setView("list")}
              style={{ padding: "0.8rem", background: view === "list" ? "#8b5e3c" : "transparent", border: "1px solid #d4c4a0", color: view === "list" ? "#f5f0e8" : "#8b7355", cursor: "pointer" }}>
              <List size={16} />
            </button>
          </div>

          {/* Genre Pills */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            {genres.slice(0, 12).map(genre => (
              <button key={genre} onClick={() => setSearch(genre)}
                style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: GENRE_COLORS[genre] || GENRE_COLORS.Default, border: `1px solid ${GENRE_COLORS[genre] || GENRE_COLORS.Default}66`, padding: "0.3rem 0.8rem", background: "transparent", cursor: "pointer", fontFamily: "monospace" }}>
                {genre.toUpperCase()}
              </button>
            ))}
            {search && (
              <button onClick={() => setSearch("")}
                style={{ fontSize: "0.7rem", color: "#7a3b3b", border: "1px solid #7a3b3b66", padding: "0.3rem 0.8rem", background: "transparent", cursor: "pointer", fontFamily: "monospace" }}>
                CLEAR ×
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ color: "#8b7355", textAlign: "center", padding: "5rem", fontSize: "1.1rem" }}>Opening the library...</div>
          ) : view === "grid" ? (
            /* Grid View */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: "1.5rem" }}>
              {filtered.map((book, idx) => {
                const color = GENRE_COLORS[book.genre] || GENRE_COLORS.Default;
                const pattern = BOOK_PATTERNS[idx % BOOK_PATTERNS.length];
                return (
                  <Link key={book.id} href={`/books/${book.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ cursor: "pointer" }}
                      onMouseEnter={e => {
                        const cover = e.currentTarget.querySelector('.book-cover') as HTMLElement;
                        if (cover) { cover.style.transform = "translateY(-8px)"; cover.style.boxShadow = `0 20px 40px ${color}44`; }
                      }}
                      onMouseLeave={e => {
                        const cover = e.currentTarget.querySelector('.book-cover') as HTMLElement;
                        if (cover) { cover.style.transform = "translateY(0)"; cover.style.boxShadow = "0 4px 16px #00000022"; }
                      }}>
                      <div className="book-cover" style={{ height: "220px", background: "#ede6d6", backgroundImage: pattern, backgroundSize: "8px 8px", border: `1px solid ${color}55`, borderLeft: `4px solid ${color}`, position: "relative", transition: "transform 0.3s ease, box-shadow 0.3s ease", boxShadow: "0 4px 16px #00000022", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1rem 0.8rem", overflow: "hidden" }}>
                        <div>
                          <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color, marginBottom: "0.5rem", fontFamily: "monospace" }}>
                            {book.genre?.toUpperCase().slice(0, 10) || "BOOK"}
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#1a0f00", lineHeight: "1.3", fontFamily: "'Playfair Display', serif" }}>
                            {book.title.slice(0, 50)}{book.title.length > 50 ? "..." : ""}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Star size={10} color={color} fill={color} />
                          <span style={{ fontSize: "0.75rem", color }}>{book.rating}</span>
                        </div>
                      </div>
                      <div style={{ padding: "0.5rem 0.2rem" }}>
                        <div style={{ fontSize: "0.78rem", color: "#6b5a3e", lineHeight: "1.3" }}>
                          {book.title.slice(0, 35)}{book.title.length > 35 ? "..." : ""}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div style={{ display: "grid", gap: "1px", background: "#d4c4a0" }}>
              {filtered.map(book => {
                const color = GENRE_COLORS[book.genre] || GENRE_COLORS.Default;
                return (
                  <Link key={book.id} href={`/books/${book.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#f5f0e8", padding: "1.2rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${color}55`, transition: "all 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#ede6d6"; (e.currentTarget as HTMLElement).style.borderLeftColor = color; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#f5f0e8"; (e.currentTarget as HTMLElement).style.borderLeftColor = `${color}55`; }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "1rem", color: "#1a0f00", fontFamily: "'Playfair Display', serif", marginBottom: "0.3rem" }}>{book.title}</div>
                        <div style={{ fontSize: "0.8rem", color: "#8b7355" }}>{book.description?.slice(0, 90)}{book.description?.length > 90 ? "..." : ""}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "1.5rem", flexShrink: 0 }}>
                        {book.genre && <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color, fontFamily: "monospace" }}>{book.genre.toUpperCase()}</span>}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Star size={11} color={color} fill={color} />
                          <span style={{ fontSize: "0.8rem", color }}>{book.rating}</span>
                        </div>
                        <ChevronRight size={14} color="#d4c4a0" />
                      </div>
                    </div>
                  </Link>
                );
              })}
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