import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="AI-powered book intelligence with RAG-based Q&A, sentiment analysis, and smart recommendations." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' rx='12' fill='%238b5e3c'/><rect x='20' y='15' width='28' height='70' rx='3' fill='%23f5f0e8'/><rect x='52' y='15' width='28' height='70' rx='3' fill='%23ede6d6'/><rect x='46' y='12' width='8' height='76' rx='2' fill='%236b4c2a'/></svg>" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}