# 🌍 GlobeX AI — Intelligent Export-Import Assistant

> Production-ready AI Agent for Indian manufacturers, exporters, and MSMEs seeking global expansion.  
> Powered by **Gemini 2.5 Flash · LangChain · ChromaDB · FastAPI**

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GlobeX AI Agent                          │
│                                                                  │
│  User Message → Intent Classifier → Decision Router              │
│                        ↓               ↓                         │
│                    RAG Pipeline    Tool Calling                  │
│                  (ChromaDB +      (HS Code / Duty /             │
│                  Gemini Embed)     Invoice / Packing)            │
│                        ↓               ↓                         │
│                    Context Injection + Tool Results              │
│                        ↓                                         │
│                  Gemini 2.5 Flash (Final Response)               │
│                        ↓                                         │
│               Memory Storage (SQLite) → Session Context          │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
backend/
├── app.py                        # FastAPI entrypoint
├── requirements.txt              # Python dependencies
├── .env.example                  # Environment variable template
│
├── agents/
│   └── globex_agent.py           # Core AI agent orchestrator
│
├── rag/
│   ├── pipeline.py               # ChromaDB + Gemini embeddings RAG
│   └── knowledge_base.py         # Seed trade knowledge documents
│
├── tools/
│   └── trade_tools.py            # LangChain tools (HS code, duty, invoice, etc.)
│
├── memory/
│   └── memory_manager.py         # SQLAlchemy session & conversation memory
│
├── database/
│   └── models.py                 # SQLAlchemy ORM models (Session, Message)
│
├── routes/
│   └── api.py                    # FastAPI route handlers
│
├── prompts/
│   └── system_prompts.py         # Gemini system & tool prompts
│
└── utils/
    ├── config.py                 # Pydantic settings management
    └── logger.py                 # Structured logging (structlog)
```

---

## Quick Start

### 1. Prerequisites

- Python 3.11+
- Google AI Studio API key (free at [aistudio.google.com](https://aistudio.google.com))

### 2. Clone and Set Up

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Run the Server

```bash
# Development (with auto-reload)
python app.py

# Or with uvicorn directly
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be live at: **http://localhost:8000**  
Interactive docs: **http://localhost:8000/docs**

---

## API Reference

### Core Chat

#### `POST /api/v1/chat`
Main agent endpoint — full response.

```json
// Request
{
  "session_id": "optional-existing-session-id",
  "message": "What documents are required to export cotton garments to Germany?"
}

// Response
{
  "session_id": "uuid-session-id",
  "response": "To export cotton garments to Germany...",
  "intent": "document_query",
  "tools_used": [],
  "rag_used": true,
  "tool_results": {}
}
```

#### `POST /api/v1/chat/stream`
Streaming response via Server-Sent Events.

```javascript
const response = await fetch('/api/v1/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ session_id: 'my-session', message: 'Find HS code for cotton shirts' })
});

const reader = response.body.getReader();
// Handle SSE tokens: data: {"token": "..."}
```

### Direct Tools

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/tools/hs-code` | POST | HS Code lookup |
| `/api/v1/tools/duty-calculator` | POST | Import duty estimation |
| `/api/v1/tools/country-rules` | POST | Country trade rules |
| `/api/v1/tools/invoice` | POST | Commercial invoice generation |
| `/api/v1/tools/packing-list` | POST | Packing list generation |

### Sessions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/sessions/{id}` | GET | Get session context |
| `/api/v1/sessions/{id}/history` | GET | Get conversation history |
| `/api/v1/sessions/{id}` | DELETE | Delete session |

### RAG Knowledge Base

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/rag/query` | POST | Direct knowledge base query |
| `/api/v1/rag/status` | GET | Knowledge base status |

---

## Example Queries

### Agent Automatically Chooses the Right Action

```bash
# RAG: Document requirements
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What documents are required to export cotton garments to Germany?"}'

# Tool Call: HS Code lookup
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "abc", "message": "Find HS code for cotton shirts"}'

# Tool Call: Duty calculation
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "abc", "message": "What is the import duty for cotton shirts in Germany? Value is $5000 FOB"}'

# Tool Call: Generate commercial invoice
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "abc", "message": "Generate a commercial invoice for 500 pieces of cotton shirts at $12 each. Buyer is ACME GmbH, Berlin."}'
```

---

## Agent Decision Making

| User Query Pattern | Agent Action |
|-------------------|--------------|
| "What documents for...?" | RAG (customs_procedures) |
| "Find HS code for..." | HS Code Lookup Tool |
| "What is the duty/tariff for...?" | Duty Calculator Tool |
| "What are the rules for exporting to...?" | Country Rules Tool |
| "Generate a commercial invoice..." | Invoice Generator Tool |
| "Create a packing list for..." | Packing List Generator Tool |
| "What regulations apply for...?" | RAG (export_regulations) |

---

## Memory System

The agent remembers across turns:

- **Company Name** — extracted from conversation
- **Product Category** — what the exporter sells
- **Destination Country** — target export market
- **Conversation History** — last 20 messages used for context

Sessions persist in SQLite until explicitly deleted.

---

## Extending the Knowledge Base

Add documents to ChromaDB at runtime:

```python
from rag.pipeline import rag_pipeline

await rag_pipeline.add_document({
    "id": "custom-001",
    "title": "Your Document Title",
    "category": "export_regulations",  # or: import_regulations, customs_procedures, hs_codes, country_rules, shipping, compliance
    "content": "Your document content here..."
})
```

Or place real PDFs in a `documents/` folder and add a PDF ingestion service (skeleton in `services/`).

---

## Production Deployment

```bash
# With Gunicorn
pip install gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Docker (create Dockerfile)
docker build -t globex-ai .
docker run -p 8000:8000 --env-file .env globex-ai
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GOOGLE_API_KEY` | **required** | Google AI Studio API key |
| `GEMINI_MODEL` | `gemini-2.5-flash-preview-05-20` | Gemini model version |
| `CHROMA_PERSIST_DIR` | `./database/chroma_db` | ChromaDB storage path |
| `DATABASE_URL` | SQLite (local) | SQLAlchemy-compatible DB URL |
| `APP_PORT` | `8000` | Server port |
| `CHUNK_SIZE` | `1000` | RAG document chunk size |
| `RETRIEVER_K` | `5` | Number of RAG results to retrieve |
| `LOG_LEVEL` | `INFO` | Logging verbosity |

---

Built with ❤️ for Indian exporters. GlobeX AI — Go Global, Go Smart.
