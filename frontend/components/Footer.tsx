import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowUp, Compass, Cpu, BookMarked, Heart } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer style={{
      background: "linear-gradient(180deg, #ede6d6 0%, #e3d7be 100%)",
      borderTop: "1px solid #d4c4a0",
      marginTop: "5rem",
      position: "relative",
      overflow: "hidden",
      color: "#2c1f0e",
      fontFamily: "'EB Garamond', Georgia, serif",
    }}>
      {/* Background architectural grid pattern */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(#c8b89a22 1px, transparent 1px), linear-gradient(90deg, #c8b89a22 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
        opacity: 0.6,
      }} />

      {/* Decorative top gold gradient accent line */}
      <div style={{
        height: "3px",
        background: "linear-gradient(90deg, #8b5e3c, #c8a876, #dfc699, #c8a876, #8b5e3c)",
      }} />

      <div style={{
        maxWidth: "1140px",
        margin: "0 auto",
        padding: "4.5rem 2rem 2.5rem",
        position: "relative",
        zIndex: 2,
      }}>
        {/* Main 4-column layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "3rem 2rem",
          marginBottom: "3.5rem",
        }}>
          {/* Col 1: Brand & Literary Vision */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.2rem" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #8b5e3c, #5c3b1e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(139, 94, 60, 0.25)",
              }}>
                <BookOpen size={19} color="#f5f0e8" />
              </div>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.45rem",
                letterSpacing: "0.15em",
                fontWeight: 600,
                color: "#1a0f00",
              }}>
                BIBLIOS
              </span>
            </div>

            <p style={{
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "#6b5438",
              marginBottom: "1.4rem",
              maxWidth: "290px",
            }}>
              An AI-augmented book intelligence engine. Harmonizing classical curation with semantic RAG retrieval and sentiment synthesis.
            </p>

            {/* Live Status indicator pill */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "#ffffff66",
              border: "1px solid #d4c4a0",
              borderRadius: "999px",
              padding: "0.4rem 0.85rem",
              fontSize: "0.75rem",
              color: "#4a3c28",
              backdropFilter: "blur(6px)",
            }}>
              <span style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px #22c55e",
                display: "inline-block",
              }} />
              <span>Cloud Engine Live • Groq Llama 3</span>
            </div>
          </div>

          {/* Col 2: Exploration */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              color: "#8b5e3c",
              textTransform: "uppercase",
              fontFamily: "monospace",
              marginBottom: "1.2rem",
            }}>
              <Compass size={14} /> Exploration
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li>
                <Link href="/" style={{ color: "#4a3820", textDecoration: "none", fontSize: "0.95rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#8b5e3c")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4a3820")}>
                  Full Library Catalog
                </Link>
              </li>
              <li>
                <Link href="/qa" style={{ color: "#4a3820", textDecoration: "none", fontSize: "0.95rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#8b5e3c")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4a3820")}>
                  Ask AI (RAG Q&A)
                </Link>
              </li>
              <li>
                <Link href="/#library" style={{ color: "#4a3820", textDecoration: "none", fontSize: "0.95rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#8b5e3c")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4a3820")}>
                  Browse by Genres
                </Link>
              </li>
              <li>
                <a href="https://books.toscrape.com" target="_blank" rel="noreferrer" style={{ color: "#4a3820", textDecoration: "none", fontSize: "0.95rem", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#8b5e3c")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4a3820")}>
                  Source Archive ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Technology Architecture */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              color: "#8b5e3c",
              textTransform: "uppercase",
              fontFamily: "monospace",
              marginBottom: "1.2rem",
            }}>
              <Cpu size={14} /> Architecture
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem", color: "#6b5438" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#8b5e3c" }}>▪</span> Next.js 16 (Turbopack)
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#8b5e3c" }}>▪</span> Django REST Framework
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#8b5e3c" }}>▪</span> Groq Cloud LPU (~500 t/s)
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#8b5e3c" }}>▪</span> Semantic RAG Pipeline
              </li>
            </ul>
          </div>

          {/* Col 4: Literary Quote Card */}
          <div>
            <div style={{
              background: "#fbf8f2cc",
              border: "1px solid #d4c4a0",
              borderRadius: "8px",
              padding: "1.4rem",
              boxShadow: "0 4px 16px rgba(139, 94, 60, 0.08)",
              position: "relative",
            }}>
              <BookMarked size={20} color="#8b5e3c" style={{ marginBottom: "0.8rem", opacity: 0.8 }} />
              <p style={{
                fontStyle: "italic",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "#2c1f0e",
                marginBottom: "0.75rem",
              }}>
                “A reader lives a thousand lives before he dies. The man who never reads lives only one.”
              </p>
              <div style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: "#8b7355",
                fontFamily: "'Playfair Display', serif",
                textAlign: "right",
              }}>
                — George R.R. Martin
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider with ornamental central medallion */}
        <div style={{
          position: "relative",
          borderTop: "1px solid #d4c4a0",
          paddingTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.2rem",
        }}>
          <div style={{
            fontSize: "0.85rem",
            color: "#7a674d",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}>
            <span>© {new Date().getFullYear()} Biblios Intelligence.</span>
            <span>Crafted with</span>
            <Heart size={13} color="#8b5e3c" fill="#8b5e3c" />
            <span>for curious minds.</span>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#f5f0e8",
              border: "1px solid #c8b89a",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              color: "#4a3c28",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#8b5e3c";
              e.currentTarget.style.color = "#f5f0e8";
              e.currentTarget.style.borderColor = "#8b5e3c";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#f5f0e8";
              e.currentTarget.style.color = "#4a3c28";
              e.currentTarget.style.borderColor = "#c8b89a";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
