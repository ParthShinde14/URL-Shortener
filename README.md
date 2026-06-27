# Snip — URL Shortener

A full-stack URL shortener built with Node.js, MySQL, Redis, and React.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MySQL |
| Cache | Redis |
| Deploy | Vercel (frontend) + Railway (backend + DB) |

## Features

- Shorten any URL instantly
- Redis caching for fast redirects
- Click tracking per link
- Link expiry (1 day / 7 days / 30 days / never)
- Dashboard to manage and delete links
- Rate limiting on the API

## Project Structure

```
url-shortener/
├── backend/
│   └── src/
│       ├── config/       # DB + Redis connections
│       ├── controllers/  # Business logic
│       ├── middleware/   # Rate limiter
│       ├── routes/       # Express routes
│       └── index.js      # Entry point
└── frontend/
    └── src/
        ├── components/   # React components
        ├── hooks/        # API helpers
        └── App.jsx
```

## Setup

### Prerequisites
- Node.js 18+
- MySQL running locally
- Redis running locally (optional — app works without it)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MySQL credentials in .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## How It Works

1. User pastes a URL → `POST /api/shorten` generates a 6-char nanoid code
2. Code + URL saved to MySQL
3. Result also cached in Redis with 1 hour TTL
4. When someone visits `/:code`:
   - Redis checked first (fast path, ~1ms)
   - If miss → MySQL lookup → cache it → redirect
   - Click count incremented in DB
