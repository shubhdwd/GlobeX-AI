"""
GlobeX AI - Centralized LLM Service
Exports shared LLM instances across all agents.
Currently configured to use Groq for generation and classification.
"""
from __future__ import annotations

import os
from langchain_groq import ChatGroq
from utils.config import get_settings
from utils.logger import get_logger

log = get_logger(__name__)
settings = get_settings()

def get_llm(temperature: float = 0.3) -> ChatGroq:
    """
    Returns the main Groq LLM instance for response generation.
    Configured with standard temperature.
    """
    api_key = settings.groq_api_key or os.getenv("GROQ_API_KEY")
    model = settings.groq_model or os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    
    if not api_key:
        log.error("GROQ_API_KEY is not set. LLM initialization will fail.")
        
    return ChatGroq(
        model=model,
        api_key=api_key,
        temperature=temperature,
        max_tokens=2048,
        timeout=10,
        max_retries=1
    )

def get_classifier_llm(temperature: float = 0.0) -> ChatGroq:
    """
    Returns a specialized Groq LLM instance for deterministic tasks:
    intent classification, entity extraction, tool argument parsing.
    """
    api_key = settings.groq_api_key or os.getenv("GROQ_API_KEY")
    model = settings.groq_model or os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    
    return ChatGroq(
        model=model,
        api_key=api_key,
        temperature=temperature,
        max_tokens=1024,
        timeout=8,
        max_retries=1
    )
