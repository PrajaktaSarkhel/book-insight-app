import { useState } from "react";
import Link from "next/link";

interface Source {
  id: number;
  title: string;
}

interface QAResult {
  question: string;
  answer: string;
  sources: Source[];
}

export default function QA() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<QAResult | null>(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResult(null);

    const res = await fetch("http://127.0.0.1:8000/api/ask/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to all books
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🧠 Ask AI</h1>
        <p className="text-gray-500 mb-8">Ask any question about the books in our library</p>

        {/* Input */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <textarea
            className="w-full border rounded-lg p-3 text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="e.g. Which books are about history? What is Sapiens about?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {loading ? "Thinking..." : "Ask Question"}
          </button>
        </div>

        {/* Answer */}
        {result && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold text-gray-500 text-sm uppercase mb-2">Answer</h2>
            <p className="text-gray-800 mb-6">{result.answer}</p>

            {result.sources && result.sources.length > 0 && (
              <>
                <h2 className="font-semibold text-gray-500 text-sm uppercase mb-2">
                  Sources Used
                </h2>
                <div className="flex flex-col gap-2">
                  {result.sources.map((s) => (
                    <Link href={`/books/${s.id}`} key={s.id}>
                      <div className="border rounded-lg p-2 hover:bg-gray-50 cursor-pointer text-blue-600 text-sm">
                        📖 {s.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}