"""
GlobeX AI — FastAPI Routes
REST API endpoints for chat, sessions, tools, and RAG management.
"""
from __future__ import annotations

import json
import re
import uuid
from datetime import datetime
from typing import Any, AsyncGenerator

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from agents.globex_agent import globex_agent
from database.models import Session, get_db
from memory.memory_manager import MemoryManager
from rag.pipeline import rag_pipeline
from tools.trade_tools import (
    country_rules,
    duty_calculator,
    hs_code_lookup,
    invoice_generator,
    packing_list_generator,
)
from utils.config import get_settings
from utils.logger import get_logger

log = get_logger(__name__)
settings = get_settings()
router = APIRouter()


# ── Request / Response Schemas ───────────────────────────────────────────────

class ChatRequest(BaseModel):
    session_id: str | None = Field(None, description="Existing session ID; omit to start new session")
    message: str = Field(..., min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    session_id: str
    response: str
    intent: str
    tools_used: list[str]
    rag_used: bool
    tool_results: dict[str, Any]


class SessionInfo(BaseModel):
    session_id: str
    company_name: str | None
    product_category: str | None
    destination_country: str | None
    message_count: int


class HSCodeRequest(BaseModel):
    product_name: str


class DutyRequest(BaseModel):
    product: str
    destination_country: str
    product_value_usd: float
    hs_code: str = ""


class CountryRulesRequest(BaseModel):
    country: str
    product_category: str = ""


class InvoiceRequest(BaseModel):
    seller_name: str
    seller_address: str
    buyer_name: str
    buyer_address: str
    product_description: str
    quantity: float
    unit: str
    unit_price_usd: float
    incoterm: str = "FOB"
    payment_terms: str = "T/T 30 days"
    country_of_origin: str = "India"
    hs_code: str = ""
    freight_usd: float = 0.0
    insurance_usd: float = 0.0


class PackingListRequest(BaseModel):
    shipper_name: str
    consignee_name: str
    product_description: str
    number_of_packages: int
    package_type: str
    gross_weight_per_package_kg: float
    net_weight_per_package_kg: float
    dimensions_cm: str
    marks_and_numbers: str = "As per Commercial Invoice"


class RAGQueryRequest(BaseModel):
    query: str
    category: str | None = None
    k: int = 5


# ── Agent Specific Request Schemas ───────────────────────────────────────────

class MarketResearchRequest(BaseModel):
    product: str
    target_regions: list[str] | None = None
    user_industry: str | None = None


class LeadScoringAgentRequest(BaseModel):
    buyer: dict[str, Any]
    product: dict[str, Any] | None = None


class OutreachAgentRequest(BaseModel):
    buyer: dict[str, Any]
    sender: dict[str, Any]
    tone: str
    language: str
    custom_context: str | None = None


# ── Chat Endpoints ───────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse, summary="Main agent chat endpoint")
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
) -> ChatResponse:
    """
    Send a message to GlobeX AI and receive a complete response.
    The agent will:
    - Classify intent
    - Retrieve relevant RAG context
    - Call tools if needed
    - Return a structured, personalised response
    """
    session_id = request.session_id or str(uuid.uuid4())
    memory = MemoryManager(db)

    try:
        result = await globex_agent.chat(
            session_id=session_id,
            user_message=request.message,
            memory=memory,
        )
        return ChatResponse(session_id=session_id, **result)
    except Exception as exc:
        log.error("Chat error", error=str(exc), session_id=session_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent error: {str(exc)}",
        )


@router.post("/chat/stream", summary="Streaming chat endpoint (Server-Sent Events)")
async def chat_stream(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
) -> StreamingResponse:
    """Stream the agent response token-by-token using SSE."""
    session_id = request.session_id or str(uuid.uuid4())
    memory = MemoryManager(db)

    async def event_generator() -> AsyncGenerator[str, None]:
        yield f'data: {{"session_id": "{session_id}"}}\n\n'
        try:
            async for token in globex_agent.chat_stream(session_id, request.message, memory):
                yield f"data: {{\"token\": {json.dumps(token)}}}\n\n"
        except Exception as exc:
            yield f'data: {{"error": {json.dumps(str(exc))}}}\n\n'
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"X-Session-Id": session_id},
    )


# ── Session Endpoints ────────────────────────────────────────────────────────

@router.get("/sessions/{session_id}", response_model=SessionInfo)
async def get_session(session_id: str, db: AsyncSession = Depends(get_db)) -> SessionInfo:
    """Retrieve session information and context."""
    result = await db.execute(
        select(Session)
        .options(selectinload(Session.messages))
        .where(Session.id == session_id)
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    msg_count = len(session.messages)

    return SessionInfo(
        session_id=session.id,
        company_name=session.company_name,
        product_category=session.product_category,
        destination_country=session.destination_country,
        message_count=msg_count,
    )


@router.get("/sessions/{session_id}/history")
async def get_history(session_id: str, db: AsyncSession = Depends(get_db)) -> dict:
    """Get conversation history for a session."""
    memory = MemoryManager(db)
    history = await memory.get_conversation_history(session_id)
    return {"session_id": session_id, "messages": history, "count": len(history)}


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str, db: AsyncSession = Depends(get_db)) -> dict:
    """Delete a session and all its messages."""
    result = await db.execute(select(Session).where(Session.id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    await db.commit()
    return {"message": f"Session {session_id} deleted"}


# ── Direct Tool Endpoints ────────────────────────────────────────────────────

@router.post("/tools/hs-code", summary="Direct HS Code Lookup")
async def lookup_hs_code(request: HSCodeRequest) -> dict:
    """Look up HS code for a product directly."""
    try:
        return await hs_code_lookup.ainvoke({"product_name": request.product_name})
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/tools/duty-calculator", summary="Import Duty Calculator")
async def calculate_duty(request: DutyRequest) -> dict:
    """Calculate import duty for a product and country."""
    try:
        return await duty_calculator.ainvoke(request.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/tools/country-rules", summary="Country Trade Rules")
async def get_country_rules(request: CountryRulesRequest) -> dict:
    """Get trade rules for a specific country."""
    try:
        return await country_rules.ainvoke(request.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/tools/invoice", summary="Generate Commercial Invoice")
async def generate_invoice(request: InvoiceRequest) -> dict:
    """Generate a commercial invoice for an export shipment."""
    try:
        return await invoice_generator.ainvoke(request.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/tools/packing-list", summary="Generate Packing List")
async def generate_packing_list(request: PackingListRequest) -> dict:
    """Generate a packing list for an export shipment."""
    try:
        return await packing_list_generator.ainvoke(request.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ── RAG Endpoints ────────────────────────────────────────────────────────────

@router.post("/rag/query", summary="Direct RAG Knowledge Query")
async def query_knowledge_base(request: RAGQueryRequest) -> dict:
    """Query the trade knowledge base directly."""
    try:
        chunks = await rag_pipeline.retrieve(request.query, k=request.k, category_filter=request.category)
        return {
            "query": request.query,
            "results": chunks,
            "count": len(chunks),
            "total_documents": rag_pipeline.document_count,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/rag/status", summary="RAG System Status")
async def rag_status() -> dict:
    """Check the status of the RAG knowledge base."""
    return {
        "status": "operational",
        "document_count": rag_pipeline.document_count,
        "collection": "globex_trade_knowledge",
    }


# ── Agent Specific Endpoints ──────────────────────────────────────────────────

@router.post("/agents/market-research", summary="Agent Market Research")
async def agent_market_research(request: MarketResearchRequest) -> dict:
    """Analyze export markets for a product and return recommended countries."""
    try:
        regions_str = f" in regions: {', '.join(request.target_regions)}" if request.target_regions else ""
        prompt = f"""You are a market research AI agent. Analyze the global export potential of the product '{request.product}'{regions_str}.
        Identify 3-5 high-potential country destinations.
        Provide:
        - demandScore (0 to 100)
        - growthRate (percentage growth expected, e.g. "18%")
        - competition (Low, Medium, or High)
        - marketSize (estimated market size in USD, e.g. "$2.4B")
        - trend (e.g. Growing, Accelerating, Stable)
        - insights (specific reasons/tailwinds for this destination)
        - countryCode (2-letter ISO code)

        Return ONLY a JSON object (no markdown formatting, no backticks, no explainers):
        {{
          "product": "{request.product}",
          "analyzedAt": "{datetime.now().isoformat()}",
          "summary": "<overall concise market summary>",
          "recommendedCountries": [
            {{
              "country": "<country name>",
              "countryCode": "<2-letter code e.g. US>",
              "demandScore": <integer>,
              "growthRate": "<e.g. 18%>",
              "competition": "<Low | Medium | High>",
              "marketSize": "<e.g. $2.4B>",
              "trend": "<e.g. Growing>",
              "insights": "<insights>"
            }}
          ]
        }}"""
        
        response = await globex_agent._classifier_llm.ainvoke(prompt)
        raw = response.content.strip()
        raw = re.sub(r"```(?:json)?|```", "", raw).strip()
        return json.loads(raw)
    except Exception as exc:
        log.error("Market research agent failed", error=str(exc))
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/agents/lead-scoring", summary="Agent Lead Scoring")
async def agent_lead_scoring(request: LeadScoringAgentRequest) -> dict:
    """Score a lead based on buyer and product details using Gemini."""
    try:
        buyer = request.buyer
        product = request.product
        
        prompt = f"""You are an AI lead scoring agent. Evaluate the fit of this global buyer for importing our product.
        
        Buyer Details:
        - Company Name: {buyer.get('companyName')}
        - Country: {buyer.get('country')}
        - Industry: {buyer.get('industry')}
        - Import Volume: {buyer.get('importVolume')}
        - Verified Status: {buyer.get('isVerified')}
        - Annual Revenue: {buyer.get('annualRevenue')}
        - Employee Count: {buyer.get('employeeCount')}
        - Email Available: {bool(buyer.get('email'))}
        - Website Available: {bool(buyer.get('website'))}
        
        Product Details:
        {json.dumps(product) if product else 'General Indian export goods'}
        
        Analyze factors such as:
        1. Industry alignment
        2. Importer import volume (Higher volume = positive)
        3. Verification and contact status
        4. Target market compatibility
        
        Calculate a final leadScore between 0 and 100.
        Provide a list of key positive/negative factors with impact and weight.
        Provide a concise reasoning.
        
        Return ONLY a JSON object (no markdown):
        {{
          "score": <integer 0-100>,
          "confidence": <float 0.0-1.0>,
          "factors": [
            {{
              "factor": "<factor name>",
              "impact": "<positive | negative | neutral>",
              "weight": <integer weight contribution>
            }}
          ],
          "reasoning": "<concise summary of score reasoning>"
        }}"""
        
        response = await globex_agent._classifier_llm.ainvoke(prompt)
        raw = response.content.strip()
        raw = re.sub(r"```(?:json)?|```", "", raw).strip()
        return json.loads(raw)
    except Exception as exc:
        log.error("Lead scoring agent failed", error=str(exc))
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/agents/outreach", summary="Agent Outreach Email Generator")
async def agent_outreach(request: OutreachAgentRequest) -> dict:
    """Generate a highly personalized outreach email to a global buyer using Gemini."""
    try:
        buyer = request.buyer
        sender = request.sender
        
        prompt = f"""You are an expert international trade and B2B outreach consultant.
        Write a {request.tone} B2B outreach email in {request.language} from the Indian exporter to the global buyer.
        
        Exporter Details (Sender):
        - Name: {sender.get('name')}
        - Company: {sender.get('companyName')}
        - Industry: {sender.get('industry')}
        
        Buyer Details (Recipient):
        - Company: {buyer.get('companyName')}
        - Country: {buyer.get('country')}
        - Industry: {buyer.get('industry')}
        - Import Volume: {buyer.get('importVolume')}
        
        {f'Additional Custom Context: {request.custom_context}' if request.custom_context else ''}
        
        The email should:
        1. Be written with a polite, professional {request.tone} tone.
        2. Introduce the exporter, their product range, and standard certifications (e.g. ISO, GMP).
        3. Explain why this partnership makes sense for the buyer.
        4. End with a clear call-to-action (e.g., brief Zoom call, product catalogue).
        5. Be concise (under 200 words).
        
        Return ONLY a JSON object (no markdown):
        {{
          "subject": "<Compelling, high-open-rate subject line>",
          "content": "<Full email body with placeholders like [Phone] or [Email] for contact info>",
          "model": "{settings.gemini_model}",
          "prompt": "<concise description of prompt configuration>"
        }}"""
        
        response = await globex_agent._classifier_llm.ainvoke(prompt)
        raw = response.content.strip()
        raw = re.sub(r"```(?:json)?|```", "", raw).strip()
        return json.loads(raw)
    except Exception as exc:
        log.error("Outreach agent failed", error=str(exc))
        raise HTTPException(status_code=500, detail=str(exc))


# ── Health ───────────────────────────────────────────────────────────────────

@router.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "GlobeX AI", "version": "1.0.0"}
