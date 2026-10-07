/**
 * Base API URL for Biblios backend.
 * Configured via NEXT_PUBLIC_API_URL environment variable during deployment (e.g. Vercel).
 * Defaults to http://127.0.0.1:8000 for local development.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");
