<div align="center">
  <img src="frontend/public/logo.png" alt="GlobeX AI Logo" width="120" />

  # 🌍 GlobeX AI

  **Discover Global Buyers From 203 Countries In A Single Platform**

  [![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-8.1-646CFF.svg)](https://vitejs.dev/)
  [![Express](https://img.shields.io/badge/Express-TypeScript-000000.svg)](https://expressjs.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748.svg)](https://www.prisma.io/)
</div>

<br />

GlobeX AI is an advanced, AI-powered B2B platform built for the **Hackverse 2026** hackathon. It empowers businesses to ditch multiple vendors and expensive subscriptions by providing comprehensive global trade data, uncovering new markets, and automating international outreach through specialized AI Agents.

---

## ✨ Key Features

- 🧠 **Multi-Agent AI System:** Specialized AI agents for Buyer Discovery, Lead Scoring, Market Research, and Outreach.
- 🔐 **Secure Authentication:** JWT-based sessions and "Continue with Google" OAuth 2.0 integration.
- 📊 **Real-time Dashboard:** Live metrics, lead tracking, and interactive data visualization.
- 🌎 **Global Scope:** Immersive 3D globe visualizations using `react-globe.gl` and `three.js`.
- ⚡ **Modern Stack:** Ultra-fast Vite frontend combined with a robust Express + Prisma backend.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **Visuals:** Three.js, React Globe, Lucide Icons, Recharts
- **Auth:** `@react-oauth/google`

### Backend
- **Server:** Node.js + Express (TypeScript)
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** Prisma
- **Auth:** bcryptjs, jsonwebtoken, google-auth-library
- **AI Engine:** Python-based multi-agent system (`ai-agent/`) with RAG, ChromaDB, and custom LLM integrations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.10+ (for AI Agents)
- A PostgreSQL Database (e.g. Supabase)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL="postgresql://user:password@host:port/db?pgbouncer=true"
JWT_SECRET="your_jwt_secret"
GOOGLE_CLIENT_ID="your_google_oauth_client_id"
```

Run database migrations and start the server:
```bash
npx prisma db push
npx prisma generate
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_GOOGLE_CLIENT_ID="your_google_oauth_client_id"
```

Start the Vite dev server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and will proxy API requests to `http://localhost:3000`.

---

## 🏗️ Architecture

- **`frontend/`**: The React UI, featuring highly polished landing pages and authenticated dashboards.
- **`backend/`**: The Express API managing database interactions, JWT sessions, and routing.
- **`backend/ai-agent/`**: A specialized Python microservice housing intelligent agents designed for parsing global trade knowledge bases, web scraping, and executing RAG pipelines.

---

## 📜 License

Created for **Hackverse 2026**.
