"""
GlobeX AI — RAG Pipeline (MOCKED FOR PROFILING)
"""
from __future__ import annotations

import asyncio
from typing import Any

from utils.logger import get_logger

log = get_logger(__name__)

class RAGPipeline:
    def __init__(self) -> None:
        pass

    async def initialise(self) -> None:
        log.info("Initialising MOCKED RAG pipeline")

    async def retrieve(
        self,
        query: str,
        k: int | None = None,
        category_filter: str | None = None,
    ) -> list[dict[str, Any]]:
        # Simulate ChromaDB latency (500ms)
        await asyncio.sleep(0.5)
        log.info("MOCKED RAG retrieval complete", query=query[:80])
        return [
            {
                "content": "Mocked trade document content about export regulations.",
                "metadata": {"title": "Mocked Document", "category": "trade"},
                "distance": 0.1,
            }
        ]

    async def format_context(self, query: str, category_filter: str | None = None) -> str:
        chunks = await self.retrieve(query, category_filter=category_filter)
        sections = []
        for c in chunks:
            title = c["metadata"].get("title", "Trade Knowledge")
            sections.append(f"### {title}\n{c['content']}")
        return "\n\n---\n\n".join(sections)

    async def add_document(self, doc: dict) -> None:
        pass

    @property
    def document_count(self) -> int:
        return 1

rag_pipeline = RAGPipeline()
