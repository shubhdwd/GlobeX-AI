"""
GlobeX AI — Agentic Tool Implementations
All tools are async, typed, and return structured Pydantic models.
"""
from __future__ import annotations

import json
import re
import uuid
from datetime import date
from typing import Any

from langchain_core.tools import tool
from services.llm_service import get_classifier_llm
from pydantic import BaseModel, Field

from utils.config import get_settings
from utils.logger import get_logger

log = get_logger(__name__)
settings = get_settings()


def _get_llm():
    return get_classifier_llm(temperature=0.1)


# ── Pydantic Schemas ─────────────────────────────────────────────────────────

class HSCodeResult(BaseModel):
    hs_code: str
    description: str
    chapter: str
    heading: str
    unit: str
    export_policy: str
    notes: str


class DutyResult(BaseModel):
    product: str
    country: str
    product_value_usd: float
    hs_code: str
    basic_customs_duty_pct: float
    igst_pct: float
    social_welfare_surcharge_pct: float
    other_levies_pct: float
    total_duty_pct: float
    estimated_duty_usd: float
    landed_cost_usd: float
    notes: str


class CountryRulesResult(BaseModel):
    country: str
    trade_agreements: list[str]
    import_duty_regime: str
    key_requirements: list[str]
    prohibited_items: list[str]
    required_certifications: list[str]
    currency: str
    key_ports: list[str]
    notes: str


class CommercialInvoice(BaseModel):
    invoice_number: str
    invoice_date: str
    seller: dict[str, Any]
    buyer: dict[str, Any]
    line_items: list[dict[str, Any]]
    subtotal_usd: float
    freight_usd: float
    insurance_usd: float
    total_usd: float
    incoterm: str
    payment_terms: str
    country_of_origin: str
    hs_code: str
    declaration: str


class PackingListResult(BaseModel):
    packing_list_number: str
    date: str
    shipper: str
    consignee: str
    packages: list[dict[str, Any]]
    total_packages: int
    total_gross_weight_kg: float
    total_net_weight_kg: float
    total_volume_cbm: float
    marks_and_numbers: str


# ── Tool 1: HS Code Lookup ───────────────────────────────────────────────────

@tool
async def hs_code_lookup(product_name: str) -> dict:
    """
    Look up the HS Code (Harmonized System Code) for a product.

    Args:
        product_name: Name or description of the product.

    Returns:
        Dictionary with HS code, description, chapter, heading, and trade notes.
    """
    log.info("HS code lookup", product=product_name)
    llm = _get_llm()

    prompt = f"""You are an expert in the Harmonized System (HS) / ITC-HS classification used in India.
Provide the most accurate HS code for the following product.

Product: {product_name}

Respond ONLY with a valid JSON object (no markdown backticks, no explanation):
{{
  "hs_code": "<8-digit ITC-HS code e.g. 61051000>",
  "description": "<official description of the HS heading>",
  "chapter": "<2-digit chapter number and title>",
  "heading": "<4-digit heading and description>",
  "unit": "<unit of measurement e.g. KGS, NOS, MTR>",
  "export_policy": "<Free / Restricted / Prohibited / STE / Canalized>",
  "notes": "<any important notes on classification, common errors, or related codes>"
}}"""

    response = await llm.ainvoke(prompt)
    raw = response.content.strip()
    raw = re.sub(r"```(?:json)?|```", "", raw).strip()

    result = json.loads(raw)
    log.info("HS code found", hs_code=result.get("hs_code"))
    return result


# ── Tool 2: Duty Calculator ──────────────────────────────────────────────────

@tool
async def duty_calculator(
    product: str,
    destination_country: str,
    product_value_usd: float,
    hs_code: str = "",
) -> dict:
    """
    Estimate import duty and taxes for a product shipped to a country.

    Args:
        product: Product name / description.
        destination_country: Country where goods will be imported.
        product_value_usd: FOB value of the product in USD.
        hs_code: HS code if known (optional).

    Returns:
        Dictionary with duty rates, estimated duty amount, and landed cost.
    """
    log.info("Duty calculation", product=product, country=destination_country, value=product_value_usd)
    llm = _get_llm()

    prompt = f"""You are a customs duty expert with knowledge of global tariff schedules.
Calculate the import duty and taxes for importing the following product.

Product: {product}
Destination Country: {destination_country}
FOB Value (USD): {product_value_usd}
HS Code (if known): {hs_code or "To be determined"}

Consider:
- Basic Customs Duty / MFN tariff rate for the destination country
- Any applicable GST/VAT/sales tax on import
- Any other levies (anti-dumping, countervailing, social welfare surcharge)
- Any applicable Free Trade Agreement preferential rate (e.g., India-UAE CEPA, ASEAN FTA)

Respond ONLY with a valid JSON object (no markdown):
{{
  "product": "{product}",
  "country": "{destination_country}",
  "product_value_usd": {product_value_usd},
  "hs_code": "<HS code used for calculation>",
  "basic_customs_duty_pct": <percentage as number e.g. 10.0>,
  "igst_pct": <percentage or equivalent VAT/GST e.g. 18.0>,
  "social_welfare_surcharge_pct": <percentage e.g. 1.0>,
  "other_levies_pct": <percentage of any additional duties>,
  "total_duty_pct": <total effective duty rate>,
  "estimated_duty_usd": <calculated duty in USD>,
  "landed_cost_usd": <product value + total duty>,
  "notes": "<FTA applicability, important caveats, data source>"
}}"""

    response = await llm.ainvoke(prompt)
    raw = response.content.strip()
    raw = re.sub(r"```(?:json)?|```", "", raw).strip()

    result = json.loads(raw)
    log.info("Duty calculated", total_duty_pct=result.get("total_duty_pct"))
    return result


# ── Tool 3: Country Rules ────────────────────────────────────────────────────

@tool
async def country_rules(country: str, product_category: str = "") -> dict:
    """
    Retrieve trade rules, requirements, and market access information for a country.

    Args:
        country: Name of the country (export destination or import source).
        product_category: Optional product category for specific rules.

    Returns:
        Dictionary with trade agreements, requirements, certifications, and key notes.
    """
    log.info("Country rules lookup", country=country)
    llm = _get_llm()

    prompt = f"""You are an international trade expert with up-to-date knowledge of global trade rules.
Provide comprehensive trade rules and market access information for:

Country: {country}
Product Category (if applicable): {product_category or "General"}
Context: Indian exporter seeking to export to this country.

Respond ONLY with a valid JSON object (no markdown):
{{
  "country": "{country}",
  "trade_agreements": ["<list of relevant FTAs India has with this country or bloc>"],
  "import_duty_regime": "<description of the duty structure>",
  "key_requirements": [
    "<requirement 1 e.g. CE marking, FDA registration>",
    "<requirement 2>"
  ],
  "prohibited_items": ["<items prohibited for import>"],
  "required_certifications": ["<certifications required e.g. CE, ISO, HACCP>"],
  "currency": "<local currency>",
  "key_ports": ["<main ports of entry>"],
  "notes": "<any important trade relationship notes, sanctions, or recent changes>"
}}"""

    response = await llm.ainvoke(prompt)
    raw = response.content.strip()
    raw = re.sub(r"```(?:json)?|```", "", raw).strip()

    result = json.loads(raw)
    log.info("Country rules retrieved", country=country)
    return result


# ── Tool 4: Commercial Invoice Generator ────────────────────────────────────

@tool
async def invoice_generator(
    seller_name: str,
    seller_address: str,
    buyer_name: str,
    buyer_address: str,
    product_description: str,
    quantity: float,
    unit: str,
    unit_price_usd: float,
    incoterm: str = "FOB",
    payment_terms: str = "T/T 30 days",
    country_of_origin: str = "India",
    hs_code: str = "",
    freight_usd: float = 0.0,
    insurance_usd: float = 0.0,
) -> dict:
    """
    Generate a structured commercial invoice for an export shipment.

    Args:
        seller_name: Exporter's company name.
        seller_address: Exporter's full address.
        buyer_name: Importer's company name.
        buyer_address: Importer's full address.
        product_description: Description of the product.
        quantity: Quantity of goods.
        unit: Unit of measurement (e.g., KGS, PCS, MTR).
        unit_price_usd: Price per unit in USD.
        incoterm: Incoterm (default: FOB).
        payment_terms: Payment terms (default: T/T 30 days).
        country_of_origin: Country where goods are manufactured.
        hs_code: HS Code for the product.
        freight_usd: Freight cost in USD.
        insurance_usd: Insurance cost in USD.

    Returns:
        Structured commercial invoice as a dictionary.
    """
    log.info("Generating invoice", buyer=buyer_name, product=product_description)

    invoice_number = f"GX-INV-{date.today().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
    total_value = round(quantity * unit_price_usd, 2)
    grand_total = round(total_value + freight_usd + insurance_usd, 2)

    invoice: dict[str, Any] = {
        "invoice_number": invoice_number,
        "invoice_date": date.today().isoformat(),
        "seller": {
            "name": seller_name,
            "address": seller_address,
            "country": country_of_origin,
        },
        "buyer": {
            "name": buyer_name,
            "address": buyer_address,
        },
        "line_items": [
            {
                "sr_no": 1,
                "description": product_description,
                "hs_code": hs_code,
                "quantity": quantity,
                "unit": unit,
                "unit_price_usd": unit_price_usd,
                "total_usd": total_value,
            }
        ],
        "subtotal_usd": total_value,
        "freight_usd": freight_usd,
        "insurance_usd": insurance_usd,
        "total_usd": grand_total,
        "currency": "USD",
        "incoterm": incoterm,
        "payment_terms": payment_terms,
        "country_of_origin": country_of_origin,
        "hs_code": hs_code,
        "declaration": (
            "We hereby certify that the information on this invoice is true and correct "
            "and that the contents of this consignment are as stated above."
        ),
    }

    log.info("Invoice generated", invoice_number=invoice_number, total_usd=grand_total)
    return invoice


# ── Tool 5: Packing List Generator ──────────────────────────────────────────

@tool
async def packing_list_generator(
    shipper_name: str,
    consignee_name: str,
    product_description: str,
    number_of_packages: int,
    package_type: str,
    gross_weight_per_package_kg: float,
    net_weight_per_package_kg: float,
    dimensions_cm: str,
    marks_and_numbers: str = "As per Commercial Invoice",
) -> dict:
    """
    Generate a structured packing list for an export shipment.

    Args:
        shipper_name: Exporter's name.
        consignee_name: Importer's name.
        product_description: Product being shipped.
        number_of_packages: Total number of packages/cartons/pallets.
        package_type: Type of packaging (e.g., Cartons, Pallets, Drums).
        gross_weight_per_package_kg: Gross weight of each package in KG.
        net_weight_per_package_kg: Net weight of each package in KG.
        dimensions_cm: Dimensions of each package in cm (e.g., "60x40x50").
        marks_and_numbers: Shipping marks on packages.

    Returns:
        Structured packing list as a dictionary.
    """
    log.info("Generating packing list", consignee=consignee_name, packages=number_of_packages)

    pl_number = f"GX-PL-{date.today().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"

    dims = dimensions_cm.lower().replace(" ", "").split("x")
    try:
        l, w, h = float(dims[0]), float(dims[1]), float(dims[2])
        volume_cbm_per_pkg = round((l * w * h) / 1_000_000, 4)
    except (ValueError, IndexError):
        volume_cbm_per_pkg = 0.0

    packages = []
    for i in range(1, number_of_packages + 1):
        packages.append(
            {
                "package_no": i,
                "description": product_description,
                "type": package_type,
                "gross_weight_kg": gross_weight_per_package_kg,
                "net_weight_kg": net_weight_per_package_kg,
                "dimensions_cm": dimensions_cm,
                "volume_cbm": volume_cbm_per_pkg,
            }
        )

    packing_list: dict[str, Any] = {
        "packing_list_number": pl_number,
        "date": date.today().isoformat(),
        "shipper": shipper_name,
        "consignee": consignee_name,
        "packages": packages,
        "total_packages": number_of_packages,
        "total_gross_weight_kg": round(gross_weight_per_package_kg * number_of_packages, 2),
        "total_net_weight_kg": round(net_weight_per_package_kg * number_of_packages, 2),
        "total_volume_cbm": round(volume_cbm_per_pkg * number_of_packages, 4),
        "marks_and_numbers": marks_and_numbers,
    }

    log.info("Packing list generated", pl_number=pl_number)
    return packing_list


# ── Tool 6: Market Research (Dataset-Backed) ─────────────────────────────────

INTERNAL_API_URL = "http://localhost:3001/internal/tradedata"

@tool
async def market_research(product_category: str = "", limit: int = 10) -> dict:
    """
    Research top export market opportunities using the GlobeX AI internal trade dataset.
    Returns real countries, demand scores, CAGR growth rates, and tariff rates
    computed directly from the 1988-2021 bilateral trade CSV dataset.
    ALWAYS call this before answering any question about market opportunities,
    top export destinations, or country recommendations.

    Args:
        product_category: Optional product category to filter results.
        limit: Maximum number of markets to return (default 10).

    Returns:
        Dictionary with dataset-backed market opportunities and metadata.
    """
    import httpx
    log.info("Dataset market research", product_category=product_category, limit=limit)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            opp_resp = await client.get(f"{INTERNAL_API_URL}/opportunities", params={"limit": limit, "product": product_category})
            stats_resp = await client.get(f"{INTERNAL_API_URL}/stats")
            opp_resp.raise_for_status()
            stats_resp.raise_for_status()

        data = opp_resp.json()
        opportunities = data.get("data", data) if isinstance(data, dict) else data
        stats = stats_resp.json().get("data", {})

        result = {
            "source": "GlobeX Internal Trade Dataset (CSV)",
            "dataset_records": stats.get("tradeFlowRecords", "unknown"),
            "years_covered": stats.get("yearsRange", "unknown"),
            "countries_covered": stats.get("countriesCovered", "unknown"),
            "opportunities": opportunities,
            "top_country": opportunities[0]["country"] if opportunities else "No data",
            "instruction": "Use ONLY the data above. Do not add countries not in this list.",
        }
        log.info("Market research complete", markets_found=len(opportunities))
        return result

    except Exception as exc:
        log.error("Market research dataset call failed", error=str(exc))
        return {
            "source": "DATASET_UNAVAILABLE",
            "error": str(exc),
            "instruction": "Dataset is currently unavailable. State: 'Market data not found in the current GlobeX knowledge base.'",
        }


@tool
async def buyer_discovery(country: str = "", industry: str = "", limit: int = 10) -> dict:
    """
    Discover potential buyers from GlobeX AI's internal trade partner dataset.
    Returns actual trade partner countries and their import volumes from India
    sourced directly from the bilateral trade CSV dataset.
    ALWAYS call this before answering any question about buyers, importers,
    or trading companies. NEVER invent buyer names.

    Args:
        country: Optional country to filter buyers.
        industry: Optional industry/product category to filter.
        limit: Maximum number of buyers to return (default 10).

    Returns:
        Dictionary with dataset-backed buyer/partner information.
    """
    import httpx
    log.info("Dataset buyer discovery", country=country, industry=industry, limit=limit)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"{INTERNAL_API_URL}/partners", params={"limit": limit, "country": country, "product": industry})
            resp.raise_for_status()
            data = resp.json()
            partners = data.get("data", data) if isinstance(data, dict) else data

        # Filter by country if specified
        if country:
            filtered = [p for p in partners if country.lower() in p.get("country", "").lower()]
            partners = filtered if filtered else partners  # fall back to all if no match

        if not partners:
            return {
                "source": "GlobeX Internal Trade Dataset",
                "buyers": [],
                "message": "No matching buyers found in the current GlobeX knowledge base.",
                "instruction": "State exactly: 'No matching buyers found in the current GlobeX knowledge base.'",
            }

        result = {
            "source": "GlobeX Internal Trade Dataset (CSV)",
            "total_found": len(partners),
            "buyers": partners,
            "top_buyer": partners[0]["companyName"] if partners else None,
            "instruction": "Use ONLY the buyers listed above. Do not add or invent any company names.",
        }
        log.info("Buyer discovery complete", buyers_found=len(partners))
        return result

    except Exception as exc:
        log.error("Buyer discovery dataset call failed", error=str(exc))
        return {
            "source": "DATASET_UNAVAILABLE",
            "buyers": [],
            "error": str(exc),
            "instruction": "Dataset is currently unavailable. State: 'Buyer data not found in the current GlobeX knowledge base.'",
        }


@tool
async def trade_analytics(metric: str = "overview") -> dict:
    """
    Retrieve trade analytics and statistics from the GlobeX internal trade dataset.
    Returns dataset summary, top destinations with CAGR and tariff data,
    all computed from the actual CSV files. ALWAYS call this before answering
    questions about trade statistics, export volumes, or rankings.

    Args:
        metric: One of 'overview', 'destinations', 'stats'. Default 'overview'.

    Returns:
        Dictionary with dataset analytics and metadata.
    """
    import httpx
    log.info("Dataset trade analytics", metric=metric)

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            stats_resp = await client.get(f"{INTERNAL_API_URL}/stats")
            dest_resp = await client.get(f"{INTERNAL_API_URL}/destinations", params={"limit": 10})
            stats_resp.raise_for_status()
            dest_resp.raise_for_status()

        stats = stats_resp.json().get("data", {})
        destinations = dest_resp.json().get("data", dest_resp.json())
        if isinstance(destinations, dict):
            destinations = destinations.get("data", [])

        result = {
            "source": "GlobeX Internal Trade Dataset (CSV)",
            "dataset_stats": stats,
            "top_destinations": destinations,
            "instruction": "Use ONLY the numbers above. Do not fabricate export values or rankings.",
        }
        log.info("Trade analytics complete", destinations=len(destinations))
        return result

    except Exception as exc:
        log.error("Trade analytics dataset call failed", error=str(exc))
        return {
            "source": "DATASET_UNAVAILABLE",
            "error": str(exc),
            "instruction": "Dataset unavailable. State: 'Trade analytics not found in the current GlobeX knowledge base.'",
        }


@tool
async def expansion_analysis(product: str, limit: int = 5) -> dict:
    """
    Perform a full market expansion analysis for a product by combining market
    research, buyer discovery, and trade analytics from the GlobeX internal datasets.
    Use this when a user asks: 'I manufacture X, where should I export?' or
    'Help me expand my business' or any expansion/market-entry query.
    NEVER answer expansion questions without calling this tool first.

    Args:
        product: The product the user manufactures or wants to export.
        limit: Number of markets/buyers to return per category (default 5).

    Returns:
        Combined market research, buyer list, and trade analytics for the product.
    """
    import httpx
    log.info("Expansion analysis", product=product, limit=limit)

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            opp_resp, partner_resp, stats_resp = await asyncio.gather(
                client.get(f"{INTERNAL_API_URL}/opportunities", params={"limit": limit, "product": product}),
                client.get(f"{INTERNAL_API_URL}/partners", params={"limit": limit, "product": product}),
                client.get(f"{INTERNAL_API_URL}/stats"),
            )

        opportunities = opp_resp.json().get("data", [])
        partners = partner_resp.json().get("data", [])
        stats = stats_resp.json().get("data", {})

        return {
            "source": "GlobeX Internal Trade Dataset (CSV)",
            "product_queried": product,
            "dataset_size": f"{stats.get('tradeFlowRecords', '?')} records, {stats.get('yearsRange', '?')}",
            "top_markets": opportunities,
            "matched_buyers": partners,
            "recommendation_basis": "All recommendations below are derived exclusively from the trade dataset.",
            "instruction": (
                "Use ONLY the markets and buyers listed above. "
                "Do not add countries or companies not in this data. "
                "If the dataset is empty, state: 'Expansion data not found in the current GlobeX knowledge base.'"
            ),
        }

    except Exception as exc:
        log.error("Expansion analysis failed", error=str(exc))
        return {
            "source": "DATASET_UNAVAILABLE",
            "error": str(exc),
            "instruction": "Dataset unavailable. State: 'Expansion data not found in the current GlobeX knowledge base.'",
        }


import asyncio  # needed for expansion_analysis asyncio.gather

# ── Tool Registry ────────────────────────────────────────────────────────────

ALL_TOOLS = [
    hs_code_lookup,
    duty_calculator,
    country_rules,
    invoice_generator,
    packing_list_generator,
    market_research,
    buyer_discovery,
    trade_analytics,
    expansion_analysis,
]

TOOL_MAP = {t.name: t for t in ALL_TOOLS}
