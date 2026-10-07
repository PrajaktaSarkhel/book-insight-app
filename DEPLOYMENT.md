# Deployment Guide for Biblios

This guide outlines the causes of previous deployment issues, the implemented fixes, and step-by-step instructions to deploy the full-stack application (Next.js + Django REST Framework + Cloud AI) completely free on **Render** (Backend) and **Vercel** (Frontend).

---

## 1. Why Deployment Was Failing Previously

| Issue | Root Cause | Fix Implemented |
|---|---|---|
| **Cloud Build Crash (OOM / Timeout)** | `requirements.txt` had 111 packages including **PyTorch (`torch==2.11.0`, ~2GB)**, `transformers`, `sentence-transformers`, `selenium`, and `kubernetes` which were never used in the Django backend. This crashed free-tier build containers (512MB RAM cap). | Streamlined to a lightweight, ~50MB production `requirements.txt` containing only Django, DRF, Cors-headers, Gunicorn, WhiteNoise, dj-database-url, and requests. |
| **Frontend Network Errors (`ERR_CONNECTION_REFUSED`)** | All pages (`index.tsx`, `qa.tsx`, `books/[id].tsx`) had hardcoded `fetch("http://127.0.0.1:8000/...")`. In production, client browsers tried to connect to `localhost:8000` on the visitor's computer rather than the deployed server. | Created `frontend/lib/api.ts` using `process.env.NEXT_PUBLIC_API_URL` with fallback to `http://127.0.0.1:8000` for local development. |
| **AI Insights & Q&A Failing in Cloud** | `ai_service.py` was hardcoded to `http://127.0.0.1:1234/v1/chat/completions` (LM Studio desktop app). Desktop apps cannot run in cloud serverless or container hosting. | Updated `ai_service.py` to support **Groq** (free, ultra-fast Llama 3.1 8B), **OpenAI**, **OpenRouter**, or any OpenAI-compatible provider via environment variables, while keeping LM Studio fallback for local testing. |
| **Django DisallowedHost & Static Assets** | `ALLOWED_HOSTS = []` blocked all non-localhost requests. `STATIC_ROOT` and WhiteNoise were missing, breaking admin and static files in production. | Configured dynamic `ALLOWED_HOSTS`, WhiteNoise static asset compression, `SECRET_KEY`, and optional PostgreSQL database support via `dj-database-url`. |
| **Empty Database on Cloud Deploy** | SQLite was not seeded on new instances, leaving the catalog empty. | Created `backend/books/fixtures/initial_books.json` (with all 39 scraped books) and an automated build script (`build.sh`) that auto-seeds initial data when the database is first created. |

---

## 2. Recommended Free Deployment Architecture

```
┌───────────────────────────────────────┐
│         User Web Browser              │
└───────────────┬───────────────────────┘
                │
                ├─────────────────────────────────────────────┐
                │ (HTML / JS / CSS)                           │ (REST API calls)
                ▼                                             ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│     Vercel (Frontend)         │             │      Render (Backend)         │
│     Next.js Application       │             │   Django REST Framework       │
│  NEXT_PUBLIC_API_URL pointing ├────────────►│   Gunicorn + WhiteNoise       │
│      to Render backend        │             │   Auto-seeded SQLite or PG    │
└───────────────────────────────┘             └───────────────┬───────────────┘
                                                              │
                                                              ▼
                                              ┌───────────────────────────────┐
                                              │      Groq Cloud AI (Free)     │
                                              │  llama-3.1-8b-instant (~500t/s)│
                                              │   Summaries + Sentiment + QA  │
                                              └───────────────────────────────┘
```

---

## 3. Step-by-Step Deployment Instructions

### Step 1: Push Changes to GitHub

Commit the fixes made to your repository:
```bash
git add .
git commit -m "Configure production deployment for Render, Vercel, and Cloud AI"
git push origin main
```

---

### Step 2: Get a Free Groq Cloud AI API Key (1 Minute)

Groq provides a 100% free API tier with ultra-fast inference for Llama 3 models (replaces local LM Studio):
1. Visit **[console.groq.com](https://console.groq.com)** and sign in with Google or GitHub.
2. In the left sidebar, click **API Keys** → **Create API Key**.
3. Name it `biblios` and copy the key (starts with `gsk_...`).

*(Note: OpenAI or any OpenAI-compatible API key can also be used if preferred).*

---

### Step 3: Deploy Backend on Render (Free)

1. Log in to **[dashboard.render.com](https://dashboard.render.com)**.
2. Click **New +** → **Web Service**.
3. Select your GitHub repository: `PrajaktaSarkhel/book-insight-app` (or `Biblios`).
4. Configure the settings:
   - **Name**: `biblios-backend`
   - **Region**: Choose closest to you (e.g., Singapore, Frankfurt, Oregon, Ohio)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `chmod +x build.sh && ./build.sh`
   - **Start Command**: `gunicorn core.wsgi:application`
   - **Instance Type**: `Free`
5. Click **Advanced** → **Add Environment Variable**:
   - `PYTHON_VERSION` = `3.11.9`
   - `DEBUG` = `False`
   - `ALLOWED_HOSTS` = `*`
   - `CORS_ALLOW_ALL_ORIGINS` = `True`
   - `SECRET_KEY` = *(generate any random 32+ character string)*
   - `GROQ_API_KEY` = *(paste your key from Step 2)*
6. Click **Deploy Web Service**.
7. Once deployment finishes, copy your backend URL (e.g. `https://biblios-backend.onrender.com`).
   - You can test it by visiting: `https://biblios-backend.onrender.com/api/books/` in your browser. It should return the JSON list of 39 books!

> **Note on Render Free Tier**: Render free instances enter sleep mode after 15 minutes of inactivity. The first request after sleep takes ~30-45 seconds to spin up, after which it runs at full speed.

---

### Step 4: Deploy Frontend on Vercel (Free)

1. Log in to **[vercel.com](https://vercel.com)**.
2. Click **Add New…** → **Project**.
3. Import your GitHub repository (`book-insight-app`).
4. In the Project Configuration screen:
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: Click **Edit** and select `frontend`
5. Expand **Environment Variables**:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://biblios-backend.onrender.com` *(paste your actual Render backend URL without trailing slash)*
6. Click **Deploy**.
7. Vercel will build the frontend and provide your live production domain (e.g., `https://biblios-frontend.vercel.app`)!

---

## 4. Local Development (Unchanged)

Your local development workflow remains fully supported and backwards-compatible:

### Backend:
```bash
cd backend

```
*(Optionally provide a `GROQ_API_KEY` in `backend/.env` to use cloud AI locally, or run LM Studio on `localhost:1234`)*

### Frontend:
```bash
cd frontend
npm run dev
```
*(Automatically connects to `http://127.0.0.1:8000` when `NEXT_PUBLIC_API_URL` is omitted).*
