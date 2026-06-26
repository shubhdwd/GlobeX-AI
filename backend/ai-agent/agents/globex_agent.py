"""
GlobeX AI — Core Agent
Orchestrates intent classification → RAG retrieval → tool calling → response generation.
This is the brain of GlobeX AI.
"""
from __future__ import annotations

import json
import re
from typing import Any, AsyncGenerator

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
# pyrefly: ignore [missing-import]
from services.llm_service import get_llm, get_classifier_llm

from memory.memory_manager import MemoryManager
from prompts.system_prompts import (
    INTENT_CLASSIFIER_PROMPT,
    MEMORY_EXTRACTION_PROMPT,
    SYSTEM_PROMPT,
)
from rag.pipeline import rag_pipeline
from tools.trade_tools import ALL_TOOLS, TOOL_MAP
from utils.config import get_settings
from utils.logger import get_logger

log = get_logger(__name__)
settings = get_settings()

# Intent → RAG category mapping
INTENT_CATEGORY_MAP: dict[str, str | None] = {
    "regulatory_query": "export_regulations",
    "document_query": "customs_procedures",
    "general_trade_query": "shipping",
    "country_rules": "country_rules",
    "hs_code_lookup": "hs_codes",
    "duty_calculation": None,
    "invoice_generation": None,
    "packing_list": None,
    "greeting": None,
    "off_topic": None,
    # Dataset-backed intents — tool MUST be called before LLM generation
    "market_research": None,
    "buyer_discovery": None,
    "trade_analytics": None,
    "expansion": None,
}

# Intents that REQUIRE a dataset tool call — no LLM generation allowed without it
DATASET_INTENTS = {"market_research", "buyer_discovery", "trade_analytics", "expansion"}


class GlobeXAgent:
    """
    Production-ready LangChain agent for international trade assistance.

    Pipeline per user turn:
      1. Classify intent (Gemini, structured JSON)
      2. Retrieve RAG context (if needed)
      3. Execute tool calls (if needed)
      4. Generate final response (Gemini with full context)
      5. Extract & persist memory
    """

    def __init__(self) -> None:
        self._llm = get_llm(temperature=0.3)
        self._classifier_llm = get_classifier_llm(temperature=0.0)
        self._llm_with_tools = self._llm.bind_tools(ALL_TOOLS)

    # ── Public Entry Point ───────────────────────────────────────────────────

    async def chat(
        self,
        session_id: str,
        user_message: str,
        memory: MemoryManager,
    ) -> dict[str, Any]:
        """
        Process a user message and return the agent's response.

        Returns:
            {
                "response": str,
                "intent": str,
                "tools_used": list[str],
                "rag_used": bool,
                "tool_results": dict,
            }
        """
        log.info("Agent processing message", session_id=session_id, message=user_message[:80])
        print("STARTING CHAT FOR SESSION:", session_id, flush=True)

        import time
        start_time = time.time()
        perf_profile = {}
        
        # 1. Classify intent
        t0 = time.perf_counter()
        print("\n" + "="*50, flush=True)
        print(f"🕵️ SUPERVISOR AGENT AUDIT LOG | Session: {session_id}", flush=True)
        print("="*50, flush=True)
        print("CALLING CLASSIFY INTENT...", flush=True)
        intent_data = await self._classify_intent(user_message)
        perf_profile["Intent Detection"] = time.perf_counter() - t0
        print("CLASSIFY INTENT RETURNED!", flush=True)
        intent = intent_data.get("intent", "general_trade_query")
        needs_rag = intent_data.get("needs_rag", True)
        needs_tool = intent_data.get("needs_tool", False)
        tool_name = intent_data.get("tool_name")
        entities = intent_data.get("entities", {})
        
        print(f"[1/6] 🧠 Detected Intent  : {intent}", flush=True)
        print(f"      📦 Detected Product : {entities.get('product', 'None')}", flush=True)
        print(f"      🌍 Detected Country : {entities.get('country', 'None')}", flush=True)
        print(f"      🔢 Detected HS Code : {entities.get('hs_code', 'None')}", flush=True)
        print(f"      🤖 Agent Selected   : {tool_name if needs_tool else 'None (RAG/Direct)'}", flush=True)

        # Force tool for dataset-backed intents
        if intent in DATASET_INTENTS and not needs_tool:
            needs_tool = True
            tool_name = intent_data.get("tool_name") or intent.replace("expansion", "expansion_analysis")

        log.info(
            "[PIPELINE] Intent classified",
            intent=intent,
            needs_rag=needs_rag,
            needs_tool=needs_tool,
            tool=tool_name,
        )

        # 2. Retrieve RAG context (skip for greetings / off-topic / dataset intents)
        t0 = time.perf_counter()
        print(f"[2/6] 📚 ChromaDB / RAG   : {'Required' if needs_rag else 'Skipped'}", flush=True)
        rag_context = ""
        rag_chunks = 0
        _skip_rag_intents = {"greeting", "off_topic"} | DATASET_INTENTS
        if needs_rag and intent not in _skip_rag_intents:
            category = INTENT_CATEGORY_MAP.get(intent)
            try:
                rag_context = await rag_pipeline.format_context(user_message, category_filter=category)
                rag_chunks = rag_context.count("---") + 1 if rag_context else 0
                print(f"      ✅ Retrieved Documents: {rag_chunks}", flush=True)
                print(f"      ✅ Chroma Results: SUCCESS", flush=True)
            except Exception as exc:
                log.warning("RAG retrieval failed", error=str(exc))
                print(f"      ❌ Chroma Results: FAILED ({exc})", flush=True)
                rag_context = "Knowledge base temporarily unavailable."
        elif intent not in _skip_rag_intents and not needs_rag:
            # For regulatory intents where model decided no RAG, still attempt
            pass

        log.info("[PIPELINE] RAG retrieval", status="DONE" if rag_context else "SKIPPED", chunks=rag_chunks)
        perf_profile["ChromaDB Retrieval"] = time.perf_counter() - t0

        # 3. Execute tool calls if required
        t0 = time.perf_counter()
        tool_results: dict[str, Any] = {}
        tools_used: list[str] = []

        print(f"[3/6] 🛠️ Tool Execution  : {'Executing ' + str(tool_name) if needs_tool else 'Skipped'}", flush=True)
        if needs_tool and tool_name and tool_name in TOOL_MAP:
            tool_results, tools_used = await self._execute_tool(
                tool_name, user_message, entities, memory, session_id
            )
            
            # --- BROWSER USE SCRAPER INTEGRATION ---
            # Enrich missing information with the Web Scraper Agent fallback
            from tools.scraper_tool import enrich_missing_information
            tool_results = await enrich_missing_information(tool_name, tool_results, user_message)
            # ---------------------------------------

            rows = len(tool_results.get(tool_name, {}).get("opportunities", [])
                    or tool_results.get(tool_name, {}).get("buyers", [])
                    or tool_results.get(tool_name, {}).get("top_destinations", []))
            print(f"      ✅ Rows Returned   : {rows} (PostgreSQL)", flush=True)
            
            log.info(
                "[PIPELINE] Dataset search",
                tool=tool_name,
                status="SUCCESS" if tool_results else "EMPTY",
                rows_retrieved=rows,
            )
        elif intent in DATASET_INTENTS:
            log.warning("[PIPELINE] Dataset intent but no tool called", intent=intent, tool_name=tool_name)
            print(f"      ⚠️ Warning: Dataset intent but tool was skipped!", flush=True)
            
        perf_profile["Tool Calls"] = time.perf_counter() - t0

        # 4. Fetch session context & conversation history
        session_context = await memory.get_session_context_string(session_id)
        history = await memory.build_langchain_history(session_id)

        # 5. Build messages for Gemini
        # For dataset intents with no results, explicitly forbid hallucination
        effective_rag = rag_context or "No additional knowledge retrieved."
        if intent in DATASET_INTENTS and not tool_results:
            effective_rag = (
                "CRITICAL: The GlobeX dataset retrieval returned no results. "
                "You MUST respond with: 'Information not found in the current GlobeX knowledge base.' "
                "Do NOT use your training knowledge to answer this question."
            )

        system_content = SYSTEM_PROMPT.format(
            session_context=session_context,
            rag_context=effective_rag,
        )

        # Inject tool results into user turn if tools were used
        user_turn = user_message
        if tool_results:
            tool_summary = json.dumps(tool_results, indent=2)
            context_size = len(tool_summary)
            user_turn = (
                f"{user_message}\n\n"
                f"[RETRIEVED DATA from GlobeX Dataset — Use ONLY this data, do not add anything not in it:]\n"
                f"```json\n{tool_summary}\n```\n"
                f"INSTRUCTION: Base your response EXCLUSIVELY on the retrieved data above."
            )
            log.info("[PIPELINE] LLM context built", context_size_chars=context_size, rag_chunks=rag_chunks, llm_called=True)
        else:
            log.info("[PIPELINE] LLM called without dataset results", rag_chunks=rag_chunks, llm_called=True)

        messages = [SystemMessage(content=system_content)]
        for role, content in history[-10:]:  # Last 10 turns
            if role == "human":
                messages.append(HumanMessage(content=content))
            else:
                messages.append(AIMessage(content=content))
        messages.append(HumanMessage(content=user_turn))

        # 6. Generate response
        t0 = time.perf_counter()
        print(f"[4/6] 🧠 LLM Called       : YES ({settings.groq_model})", flush=True)
        response_msg = await self._llm.ainvoke(messages)
        response_text = response_msg.content
        perf_profile["LLM Call (Groq)"] = time.perf_counter() - t0

        # 7. Persist messages to memory
        await memory.add_message(session_id, "user", user_message)
        await memory.add_message(
            session_id, "assistant", response_text,
            tool_calls=tool_results if tool_results else None,
        )

        # 8. Extract & update session context
        t0 = time.perf_counter()
        print(f"[5/6] 💾 Memory Updated   : SUCCESS", flush=True)
        await self._update_memory(session_id, user_message, response_text, entities, memory)
        perf_profile["Memory Update"] = time.perf_counter() - t0

        exec_time = time.time() - start_time
        print(f"[6/6] 🏁 Final Status     : COMPLETE", flush=True)
        print(f"      ⏱️ Execution Time   : {exec_time:.2f}s", flush=True)
        print("="*50 + "\n", flush=True)

        return {
            "response": response_text,
            "intent": intent,
            "tools_used": tools_used,
            "rag_used": bool(rag_context),
            "tool_results": tool_results,
            "profile": perf_profile,
        }

    # ── Streaming variant ────────────────────────────────────────────────────

    async def chat_stream(
        self,
        session_id: str,
        user_message: str,
        memory: MemoryManager,
    ) -> AsyncGenerator[str, None]:
        """Stream the agent response token-by-token."""
        print("CALLING CLASSIFY INTENT...", flush=True)
        intent_data = await self._classify_intent(user_message)
        print("CLASSIFY INTENT RETURNED!", flush=True)
        intent = intent_data.get("intent", "general_trade_query")
        needs_rag = intent_data.get("needs_rag", True)
        needs_tool = intent_data.get("needs_tool", False)
        tool_name = intent_data.get("tool_name")
        entities = intent_data.get("entities", {})

        rag_context = ""
        if needs_rag:
            category = INTENT_CATEGORY_MAP.get(intent)
            try:
                rag_context = await rag_pipeline.format_context(user_message, category_filter=category)
            except Exception:
                rag_context = ""

        tool_results: dict[str, Any] = {}
        if needs_tool and tool_name and tool_name in TOOL_MAP:
            tool_results, _ = await self._execute_tool(tool_name, user_message, entities, memory, session_id)
            
            # --- BROWSER USE SCRAPER INTEGRATION ---
            # Enrich missing information with the Web Scraper Agent fallback
            from tools.scraper_tool import enrich_missing_information
            tool_results = await enrich_missing_information(tool_name, tool_results, user_message)
            # ---------------------------------------

        session_context = await memory.get_session_context_string(session_id)
        history = await memory.build_langchain_history(session_id)

        system_content = SYSTEM_PROMPT.format(
            session_context=session_context,
            rag_context=rag_context or "No additional knowledge retrieved.",
        )

        user_turn = user_message
        if tool_results:
            user_turn = (
                f"{user_message}\n\n[Tool Results:]\n```json\n{json.dumps(tool_results, indent=2)}\n```"
            )

        messages = [SystemMessage(content=system_content)]
        for role, content in history[-8:]:
            messages.append(HumanMessage(content=content) if role == "human" else AIMessage(content=content))
        messages.append(HumanMessage(content=user_turn))

        full_response = ""
        async for chunk in self._llm.astream(messages):
            token = chunk.content
            full_response += token
            yield token

        await memory.add_message(session_id, "user", user_message)
        await memory.add_message(session_id, "assistant", full_response)
        await self._update_memory(session_id, user_message, full_response, entities, memory)

    # ── Private Helpers ──────────────────────────────────────────────────────

    async def _classify_intent(self, user_message: str) -> dict:
        """Use Gemini to classify user intent into structured JSON."""
        prompt = INTENT_CLASSIFIER_PROMPT.format(user_message=user_message)
        response = await self._classifier_llm.ainvoke(prompt)
        raw = response.content.strip()
        raw = re.sub(r"```(?:json)?|```", "", raw).strip()
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            log.warning("Intent classification JSON parse failed", raw=raw[:200])
            return {"intent": "general_trade_query", "needs_rag": True, "needs_tool": False}

    async def _execute_tool(
        self,
        tool_name: str,
        user_message: str,
        entities: dict,
        memory: MemoryManager,
        session_id: str,
    ) -> tuple[dict, list[str]]:
        """Parse tool arguments from entities and invoke the tool."""
        tool_fn = TOOL_MAP[tool_name]
        tool_results: dict = {}
        tools_used: list[str] = []

        try:
            # Build tool inputs from extracted entities + LLM-parsed args
            args = await self._parse_tool_args(tool_name, user_message, entities, memory, session_id)
            log.info("Invoking tool", tool=tool_name, args=args)
            result = await tool_fn.ainvoke(args)
            tool_results[tool_name] = result
            tools_used.append(tool_name)
        except Exception as exc:
            log.error("Tool execution failed", tool=tool_name, error=str(exc))
            tool_results[tool_name] = {"error": str(exc)}

        return tool_results, tools_used

    async def _parse_tool_args(
        self,
        tool_name: str,
        user_message: str,
        entities: dict,
        memory: MemoryManager,
        session_id: str,
    ) -> dict:
        """
        Directly map extracted entities to tool arguments to avoid redundant LLM calls.
        """
        product = entities.get("product") or ""
        country = entities.get("country") or ""
        company = entities.get("company") or ""
        
        if tool_name == "hs_code_lookup":
            return {"product_name": product}
        elif tool_name == "duty_calculator":
            return {"product": product, "destination_country": country, "product_value_usd": 1000}
        elif tool_name == "country_rules":
            return {"country": country, "product_category": product}
        elif tool_name == "market_research":
            return {"product_category": product, "limit": 10}
        elif tool_name == "buyer_discovery":
            return {"country": country, "industry": product, "limit": 10}
        elif tool_name == "trade_analytics":
            return {"metric": "overview"}
        elif tool_name == "expansion_analysis":
            return {"product": product, "limit": 5}
            
        # Fallback for complex tools or unmapped ones (e.g. invoice/packing list)
        return entities

    async def _update_memory(
        self,
        session_id: str,
        user_message: str,
        assistant_response: str,
        entities: dict,
        memory: MemoryManager,
    ) -> None:
        """Update session context based on entities already extracted."""
        try:
            # Use entities from intent classification
            company = entities.get("company")
            country = entities.get("country")
            product = entities.get("product")

            # Update memory only if we have at least one valid entity
            if company or country or product:
                await memory.update_session_context(
                    session_id,
                    company_name=company,
                    product_category=product,
                    destination_country=country,
                )
        except Exception as exc:
            log.warning("Memory extraction failed", error=str(exc))


# ── Singleton ────────────────────────────────────────────────────────────────
globex_agent = GlobeXAgent()

