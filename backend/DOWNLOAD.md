# 📥 GlobeX AI Backend — Download & Getting Started

## 📦 Download Options

### Option 1: Download Archive (Recommended)

**File**: `globex-ai-backend.tar.gz` (62 KB)

#### macOS / Linux
```bash
# Download (replace with actual URL)
wget https://your-url/globex-ai-backend.tar.gz

# Extract
tar -xzf globex-ai-backend.tar.gz

# Navigate
cd globex-ai
```

#### Windows
- Download `globex-ai-backend.tar.gz`
- Right-click → Extract with 7-Zip or WinRAR
- Or use WSL: `tar -xzf globex-ai-backend.tar.gz`

---

### Option 2: Clone from Git

```bash
git clone https://github.com/yourusername/globex-ai-backend.git
cd globex-ai
```

---

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database

#### Quick Way (Docker)
```bash
docker-compose up -d
```
This starts PostgreSQL + Adminer automatically.

#### Manual Way
```bash
# Install PostgreSQL locally or use cloud database
# Update DATABASE_URL in .env
```

### Step 3: Configure Environment
```bash
cp .env.example .env

# Edit .env with your settings:
# - DATABASE_URL (required)
# - JWT_SECRET (generate: openssl rand -base64 32)
# - JWT_REFRESH_SECRET (generate: openssl rand -base64 32)
```

### Step 4: Initialize Database
```bash
npx prisma migrate dev --name init
npm run db:seed
```

### Step 5: Start Server
```bash
npm run dev
```

**Expected output**:
```
╔══════════════════════════════════════════════════════╗
║           🌍  GlobeX AI — Backend Running            ║
╠══════════════════════════════════════════════════════╣
║  Environment : development                           ║
║  Port        : 3000                                  ║
║  API Base    : http://localhost:3000/api/v1          ║
║  API Docs    : http://localhost:3000/api-docs        ║
║  Health      : http://localhost:3000/health          ║
╚══════════════════════════════════════════════════════╝
```

### Step 6: Open API Docs
**Visit**: http://localhost:3000/api-docs

---

## 📚 What's Inside

After extraction, you'll have:

```
globex-ai/
├── README.md              ← Project overview
├── SETUP.md               ← Detailed setup guide
├── API.md                 ← Complete API reference
├── Dockerfile             ← Docker containerization
├── docker-compose.yml     ← Local dev stack
├── .env.example           ← Environment template
├── package.json           ← Dependencies
├── tsconfig.json          ← TypeScript config
├── src/
│   ├── modules/           ← 8 feature modules
│   ├── middleware/        ← Auth, validation
│   ├── config/            ← DB, env, Swagger
│   ├── utils/             ← Helpers
│   ├── app.ts             ← Express setup
│   └── server.ts          ← Entry point
└── prisma/
    ├── schema.prisma      ← Database schema
    └── seed.ts            ← Demo data
```

---

## ✅ Demo Credentials

After seeding, use these to test:

**Email**: `demo@spicesexport.in`
**Password**: `Demo@123`

Or create your own via signup endpoint.

---

## 🔧 Troubleshooting

### "npm: command not found"
Install Node.js from https://nodejs.org (LTS version)

### "Cannot connect to database"
```bash
# Check DATABASE_URL in .env
# Make sure PostgreSQL is running
psql postgresql://postgres:password@localhost:5432/globex_ai
```

### "Port 3000 already in use"
```bash
# Change PORT in .env, or kill process
lsof -i :3000
kill -9 <PID>
```

### "prisma: command not found"
```bash
npx prisma generate
npm install
```

See **SETUP.md** for more troubleshooting.

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Project overview, architecture, tech stack |
| **SETUP.md** | Installation, configuration, troubleshooting |
| **API.md** | Complete API endpoint reference |
| **Swagger UI** | http://localhost:3000/api-docs (interactive) |

---

## 🤖 Next Steps

1. ✅ **Start Server** → `npm run dev`
2. ✅ **Test Endpoints** → Visit Swagger docs
3. ✅ **Plug in AI** → Replace mock agents with real LLMs
4. ✅ **Build Frontend** → React/Vue/Next.js
5. ✅ **Deploy** → Docker, Heroku, Railway, AWS

---

## 💡 Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production build

# Database
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed demo data
npm run db:migrate       # Run migrations

# Code Quality
npm run lint             # Check code style
npm run format           # Format code
```

---

## 🌟 Key Features to Explore

1. **Authentication** (`/api/v1/auth`)
   - Signup, login, refresh tokens
   - Profile management
   - JWT auth

2. **Products** (`/api/v1/products`)
   - Register products for export
   - Filter by category

3. **Market Intelligence** (`/api/v1/market`)
   - AI-powered opportunity analysis
   - Ready to plug in real LLMs

4. **Buyers** (`/api/v1/buyers`)
   - Search global buyers
   - Filter by country, industry, score

5. **Leads** (`/api/v1/leads`)
   - AI-based lead scoring
   - Pipeline tracking

6. **Outreach** (`/api/v1/outreach`)
   - AI-generated emails
   - Professional templates

7. **Compliance** (`/api/v1/compliance`)
   - Export requirements by country
   - Pre-seeded USA, Germany, UAE

8. **Dashboard** (`/api/v1/dashboard`)
   - Real-time analytics
   - Lead pipeline metrics

---

## 🚢 Deployment

### Docker
```bash
docker build -t globex-ai .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=... \
  globex-ai:latest
```

### Docker Compose
```bash
docker-compose up -d
```

### Heroku
```bash
git push heroku main
```

### Railway
```bash
railway up
```

---

## 🔗 Resources

- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **Express Guide**: https://expressjs.com/
- **Prisma Docs**: https://www.prisma.io/docs/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **JWT Explained**: https://jwt.io/

---

## 💬 Support

- **Documentation**: See README.md, SETUP.md, API.md
- **API Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **Database UI**: http://localhost:8080 (with docker-compose)

---

## 🎯 Architecture Highlights

- ✅ **Modular Design** — Service + Repository pattern
- ✅ **Type Safety** — Full TypeScript
- ✅ **Security** — JWT, bcrypt, rate limiting, CORS
- ✅ **AI Ready** — Pluggable agent architecture
- ✅ **Production Ready** — Error handling, logging, auditing
- ✅ **Well Documented** — Swagger, API reference, setup guide
- ✅ **Scalable** — Stateless, indexing, connection pooling
- ✅ **Developer Friendly** — Hot reload, Prisma Studio, validation

---

## 🎉 You're Ready!

Everything you need is included. Just:

1. **Extract** the archive
2. **Run** `npm install`
3. **Configure** `.env`
4. **Start** `npm run dev`
5. **Build** your frontend!

**Questions?** Check documentation files or refer to code comments.

---

**Made with ❤️ for Indian exporters going global**

Happy coding! 🚀
