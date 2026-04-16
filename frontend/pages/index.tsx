import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Star, ChevronRight, Layers } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  genre: string;
  description: string;
  url: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/books/")
      .then((r) => r.json())
      .then((data) => { setBooks(data); setLoading(false); });
  }, []);

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f14", color: "#e8e6e1", fontFamily: "'Georgia', serif" }}>
      
      {/* Navbar */}
      <nav style={{ borderBottom: "1px solid #1e2330", padding: "1.2rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0d0f14cc", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BookOpen size={22} color="#7c9cbf" />
          <span style={{ fontSize: "1.1rem", letterSpacing: "0.08em", color: "#c8d8e8" }}>BIBLIOS</span>
        </div>
        <div style={{ display: "flex", gap: "2rem", fontSize: "0.85rem", letterSpacing: "0.06em", color: "#6b7280" }}>
          <Link href="/" style={{ color: "#c8d8e8", textDecoration: "none" }}>LIBRARY</Link>
          <Link href="/qa" style={{ color: "#6b7280", textDecoration: "none" }}>ASK AI</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "5rem 2.5rem 3rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "#7c9cbf", marginBottom: "1.2rem" }}>AI-POWERED BOOK INTELLIGENCE</div>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: "400", lineHeight: "1.1", margin: "0 0 1.5rem", color: "#e8e6e1" }}>
          Discover books.<br />
          <span style={{ color: "#7c9cbf" }}>Ask anything.</span>
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.7", marginBottom: "2.5rem" }}>
          A curated library with AI-generated insights, sentiment analysis, and intelligent Q&A over your entire collection.
        </p>
        <Link href="/qa" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#7c9cbf", color: "#0d0f14", padding: "0.8rem 1.8rem", textDecoration: "none", fontSize: "0.85rem", letterSpacing: "0.1em", fontFamily: "monospace" }}>
          ASK THE AI <ChevronRight size={16} />
        </Link>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop: "1px solid #1e2330", borderBottom: "1px solid #1e2330", padding: "1rem 2.5rem", display: "flex", gap: "3rem", maxWidth: "900px", margin: "0 auto" }}>
        {[["BOOKS", books.length], ["GENRES", [...new Set(books.map(b => b.genre))].length], ["AI INSIGHTS", "Active"]].map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: "1.4rem", color: "#c8d8e8" }}>{val}</div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#4b5563" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search + Books */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", background: "#13161f", border: "1px solid #1e2330", padding: "0.8rem 1.2rem", marginBottom: "2.5rem" }}>
          <Search size={16} color="#4b5563" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or genre..."
            style={{ background: "transparent", border: "none", outline: "none", color: "#e8e6e1", fontSize: "0.9rem", width: "100%", fontFamily: "inherit" }}
          />
        </div>

        {loading ? (
          <div style={{ color: "#4b5563", textAlign: "center", padding: "4rem" }}>Loading library...</div>
        ) : (
          <div style={{ display: "grid", gap: "1px", background: "#1e2330" }}>
            {filtered.map((book) => (
              <Link key={book.id} href={`/books/${book.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#0d0f14", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#13161f")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#0d0f14")}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "0.95rem", color: "#c8d8e8" }}>{book.title}</span>
                      {book.genre && (
                        <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "#7c9cbf", border: "1px solid #1e3a5f", padding: "0.15rem 0.5rem" }}>{book.genre.toUpperCase()}</span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#4b5563" }}>{book.description?.slice(0, 100)}{book.description?.length > 100 ? "..." : ""}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginLeft: "1.5rem" }}>
                    <Star size={12} color="#7c9cbf" fill="#7c9cbf" />
                    <span style={{ fontSize: "0.8rem", color: "#7c9cbf" }}>{book.rating}</span>
                    <ChevronRight size={14} color="#2d3748" style={{ marginLeft: "0.5rem" }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}