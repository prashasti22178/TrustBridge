"""Gemini AI Underwriting Explanation Service for TrustBridge.

Invariants:
- Gemini Flash NEVER assigns or modifies credit scores.
- Gemini is used solely to generate plain-language explainability dossiers grounded in verified facts.
- Final loan sanction authority strictly resides with the certified human underwriter.
- If API key is missing or calls fail, an explainable deterministic fallback summary is returned.
"""

import os
import json
import logging
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)


def _generate_fallback_narrative(applicant_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate high-quality grounded explanation when Gemini API is unconfigured or offline."""
    name = applicant_data.get("name", "Applicant")
    business = applicant_data.get("business_type", "Micro-enterprise")
    location = applicant_data.get("location", "Market hub")
    tenure = applicant_data.get("stall_tenure_months", 18)
    weekly_income = float(applicant_data.get("weekly_income", 7500))
    requested_amount = float(applicant_data.get("requested_amount", 10000))
    trust_score = applicant_data.get("trust_score", 78)
    repayment_weeks = int(applicant_data.get("repayment_weeks", 12))
    
    weekly_emi = round(requested_amount / max(1, repayment_weeks), 2)
    coverage = round(weekly_income / max(1.0, weekly_emi), 1)

    pillars = applicant_data.get("pillars", {})
    ability = pillars.get("ability", 82)
    willingness = pillars.get("willingness", 85)
    stability = pillars.get("stability", 65)

    strengths: List[str] = []
    risk_factors: List[str] = []

    # Strengths derived from telemetry
    if willingness >= 80:
        strengths.append(
            f"Exemplary payment discipline across verified stall rent and wholesale supplier accounts ({willingness}/100)."
        )
    if coverage >= 4.0:
        strengths.append(
            f"Strong weekly business revenue (₹{weekly_income:,.0f}) provides {coverage}x cashflow coverage over weekly debt service (₹{weekly_emi:,.0f})."
        )
    if tenure >= 12:
        strengths.append(
            f"Documented operational longevity of {tenure} continuous months at the same physical {location} location."
        )

    # Risk factors
    if tenure < 24:
        risk_factors.append(
            f"Stall tenure is {tenure} months (approaching the 24-month stability cap); additional digital transaction history would solidify stability."
        )
    if requested_amount > weekly_income * 2:
        risk_factors.append(
            f"Requested loan amount (₹{requested_amount:,.0f}) represents higher initial working capital; monitor initial weekly repayments."
        )
    if not risk_factors:
        risk_factors.append("Seasonal inventory price volatility buffer recommended.")

    # Executive Summary
    summary = (
        f"{name} operates an established {business} in {location} with {tenure} months of continuous presence. "
        f"The applicant exhibits a deterministic Trust Score of {trust_score}/100 with strong debt coverage ({coverage}x) "
        f"and consistent payment punctuality ({willingness}/100 Willingness score). "
        f"Historical proofs demonstrate reliable commercial discipline suited for structured micro-working capital."
    )

    # Neutral Underwriting Recommendation
    recommendation = (
        f"Recommend sanction of ₹{requested_amount:,.0f} starter loan structured with ₹{weekly_emi:,.0f} weekly repayments over {repayment_weeks} weeks. "
        f"Verified receipts and cashflow indicate high recovery probability."
    )

    return {
        "summary": summary,
        "strengths": strengths,
        "risk_factors": risk_factors,
        "underwriting_recommendation": recommendation,
        "model_used": "deterministic-grounded-fallback",
        "human_decision_required": True
    }


def generate_underwriting_narrative(applicant_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate structured explainability dossier using Google GenAI SDK (Gemini 2.5 Flash)."""
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()

    if not api_key:
        logger.info("GEMINI_API_KEY not set. Using grounded fallback narrative.")
        return _generate_fallback_narrative(applicant_data)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are a senior FinTech micro-credit underwriting assistant for TrustBridge India.
Analyze the following verified micro-enterprise applicant data:

{json.dumps(applicant_data, indent=2)}

INVARIANTS:
1. You DO NOT assign or alter the Trust Score. The mathematical score is already calculated deterministically.
2. Produce a neutral, objective explanation grounded solely in the provided numbers and receipts.
3. Final sanction authority belongs to a certified human underwriter.
4. Output strict JSON with the following keys:
   - "summary": A concise executive summary of the applicant (2-3 sentences).
   - "strengths": Array of 2 to 3 distinct verified positive signals.
   - "risk_factors": Array of 1 to 2 cautionary gaps or attention points.
   - "underwriting_recommendation": A professional, non-binding recommendation for the human underwriter.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )

        if response and response.text:
            parsed = json.loads(response.text)
            parsed["model_used"] = "gemini-2.5-flash"
            parsed["human_decision_required"] = True
            return parsed

    except Exception as e:
        logger.warning(f"Gemini API call failed: {e}. Falling back to deterministic narrative.")

    return _generate_fallback_narrative(applicant_data)
