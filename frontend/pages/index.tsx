import { useEffect, useState } from "react";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  description: string;
  genre: string;
  url: string;
  summary: string;
  sentiment: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/books/")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">📚 Book Insights</h1>
          <Link
            href="/qa"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ask AI a Question
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-500 text-center text-xl mt-20">Loading books...</p>
        )}

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link href={`/books/${book.id}`} key={book.id}>
              <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 cursor-pointer h-full">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {book.genre || "Unknown"}
                </span>
                <h2 className="text-lg font-semibold text-gray-800 mt-3 mb-1 line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">by {book.author || "Unknown"}</p>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < book.rating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}