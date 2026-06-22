# 🍽️ Dish Manager — Full Stack Assignment

A full-stack dish management dashboard with **real-time updates** via WebSockets.

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| Real-time | Socket.IO |

## Project Structure
```
├── backend/          # Express + Socket.IO API server
│   └── src/
│       ├── db.js         # SQLite connection + schema
│       ├── seed.js       # Seed data
│       ├── server.js     # Main server entry
│       └── routes/
│           └── dishes.js # REST API routes
└── frontend/         # React + Vite dashboard
    └── src/
        ├── App.jsx
        ├── App.css
        ├── components/
        │   ├── DishCard.jsx
        │   ├── Header.jsx
        │   └── ConnectionStatus.jsx
        └── hooks/
            └── useSocket.js
```

## Running Locally

### 1. Backend
```bash
cd backend
npm install
npm run dev     # starts on http://localhost:4000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev     # starts on http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dishes` | Get all dishes |
| PATCH | `/api/dishes/:id/toggle` | Toggle isPublished |
| GET | `/health` | Health check |

## Real-Time Updates (Bonus)
Socket.IO emits a `dish:updated` event to all clients whenever a dish's `isPublished` status changes — even if the change is made directly via the API without using the dashboard. The dashboard listens for this event and updates the UI instantly.
