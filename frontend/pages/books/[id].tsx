import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [book, setBook] = useState<Book | null>(null);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://127.0.0.1:8000/api/books/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      });

    fetch(`http://127.0.0.1:8000/api/books/${id}/recommend/`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data));
  }, [id]);

  const generateInsights = async () => {
    setInsightLoading(true);
    const res = await fetch(`http://127.0.0.1:8000/api/books/${id}/insights/`, {
      method: "POST",
    });
    const data = await res.json();
    setBook(data);
    setInsightLoading(false);
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!book) return <p className="text-center mt-20 text-gray-500">Book not found</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to all books
        </Link>

        {/* Book Card */}
        <div className="bg-white rounded-xl shadow p-8 mb-6">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {book.genre || "Unknown"}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-1">{book.title}</h1>
          <p className="text-gray-500 mb-3">by {book.author || "Unknown"}</p>
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < book.rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>
                ★
              </span>
            ))}
          </div>
          <p className="text-gray-700 mb-6">{book.description}</p>
          <a href={book.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
            View on source site →
          </a>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🤖 AI Insights</h2>

          {book.summary ? (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Summary</p>
              <p className="text-gray-700">{book.summary}</p>
            </div>
          ) : null}

          {book.sentiment ? (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Tone / Sentiment</p>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {book.sentiment}
              </span>
            </div>
          ) : null}

          {!book.summary && !book.sentiment && (
            <p className="text-gray-400 mb-4">No AI insights generated yet.</p>
          )}

          <button
            onClick={generateInsights}
            disabled={insightLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {insightLoading ? "Generating..." : "✨ Generate AI Insights"}
          </button>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📖 Similar Books</h2>
            <div className="flex flex-col gap-3">
              {recommendations.map((rec) => (
                <Link href={`/books/${rec.id}`} key={rec.id}>
                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <p className="font-medium text-gray-800">{rec.title}</p>
                    <p className="text-sm text-gray-500">{rec.genre}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}