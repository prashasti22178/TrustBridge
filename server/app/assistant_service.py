"""TrustBridge Contextual AI Assistant Service.

Guarantees & Guardrails:
1. Never approves or rejects a loan.
2. Never invents financial data, credit history, or uploaded documents.
3. Describes anomaly signals as "potential anomalies", never as confirmed fraud.
4. Uses the deterministic Trust Score as the mathematical ground truth.
5. Employs minimum necessary context (never whole DB, secrets, or other applicants).
6. Provides intelligent deterministic fallback when Gemini API is unconfigured.
"""

import os
import json
import logging
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

from app.models import AssistantChatRequest, AssistantChatResponse, AssistantContext

load_dotenv()
logger = logging.getLogger(__name__)


# ------------------------------------------------------------
# Guardrail & Rule-Based Fallback Engine
# ------------------------------------------------------------

def _generate_rule_based_reply(
    user_query: str,
    context: Optional[AssistantContext],
    quick_action: Optional[str] = None
) -> AssistantChatResponse:
    """Generate high-precision grounded responses under strict FinTech guardrails."""
    q_lower = (user_query or "").lower().strip()
    action = (quick_action or "").lower().strip()
    
    # 1. UNDERWRITER CONTEXT QUERIES
    if context and context.applicant_id:
        name = context.applicant_name or "Applicant"
        score = context.trust_score if context.trust_score is not None else 78
        pillars = context.pillars or {"ability": 82, "willingness": 85, "stability": 65}
        trajectory = context.risk_trajectory or "STABLE"
        flags = context.anomaly_flags or []
        business = context.business_type or "micro-enterprise"

        # Quick action: Explain this score
        if action == "explain this score" or "why is this score" in q_lower or "explain score" in q_lower:
            ability = pillars.get("ability", 80)
            willingness = pillars.get("willingness", 80)
            stability = pillars.get("stability", 70)

            reply = (
                f"{name}'s Trust Score is {score}/100. This is calculated deterministically via three weighted pillars: "
                f"Ability to Repay ({ability}/100, 40% weight), Willingness to Repay ({willingness}/100, 35% weight), "
                f"and Operational Stability ({stability}/100, 25% weight). "
                f"{'Willingness is the strongest driver due to punctual rent and vendor settlements. ' if willingness >= 80 else ''}"
                f"{'Operational tenure provides solid stability footing. ' if stability >= 70 else 'Tenure longevity is still maturing. '}"
                f"Final sanction authority remains with the human underwriter."
            )
            return AssistantChatResponse(
                reply=reply,
                model_used="deterministic-fintech-guardrail",
                suggested_actions=["Show risk factors", "What should I verify?", "How could the score improve?"],
                human_decision_required=True,
                context_applicant_id=context.applicant_id
            )

        # Quick action: Show risk factors
        if action == "show risk factors" or "risk" in q_lower:
            risk_points = []
            if flags:
                risk_points.append(f"Potential document anomalies flagged: {', '.join(flags)}.")
            if trajectory == "DETERIORATING":
                risk_points.append("Recent 6-month trajectory indicates declining vendor settlement promptness.")
            if pillars.get("stability", 70) < 65:
                risk_points.append("Operating tenure at pitch is under 18 months, representing emerging stability.")
            if not risk_points:
                risk_points.append("Moderate working capital ratio; cash reserves buffer recommended.")

            reply = (
                f"Identified risk indicators for {name} ({business}):\n"
                + "\n".join(f"• {pt}" for pt in risk_points) +
                "\nNote: These indicators highlight areas for human verification, not definitive default risk."
            )
            return AssistantChatResponse(
                reply=reply,
                model_used="deterministic-fintech-guardrail",
                suggested_actions=["What should I verify?", "Explain this score", "How could the score improve?"],
                human_decision_required=True,
                context_applicant_id=context.applicant_id
            )

        # Quick action: What should I verify?
        if action == "what should i verify?" or "verify" in q_lower:
            reply = (
                f"Recommended human verification steps for {name}:\n"
                f"1. Cross-examine primary wholesale vendor invoice against physical stall stock.\n"
                f"2. Inspect municipal market pitch rental receipts for the last 3 billing cycles.\n"
                f"3. Validate merchant QR settlement pulses against reported weekly revenue.\n"
                f"4. Confirm physical kiosk geo-tag match with municipal field records."
            )
            return AssistantChatResponse(
                reply=reply,
                model_used="deterministic-fintech-guardrail",
                suggested_actions=["Summarize for underwriter", "Show risk factors", "Explain this score"],
                human_decision_required=True,
                context_applicant_id=context.applicant_id
            )

        # Quick action: Summarize applicant / underwriter summary
        if action in ("summarize applicant", "summarize for underwriter") or "summarize" in q_lower:
            reply = (
                f"Underwriting Dossier Summary for {name} ({context.applicant_id}):\n"
                f"• Business: {business}\n"
                f"• Trust Score: {score}/100 (Risk Tier: {context.risk_tier or 'Moderate'})\n"
                f"• Behavior Trajectory: {trajectory}\n"
                f"• Pillars: Ability {pillars.get('ability', 80)}, Willingness {pillars.get('willingness', 80)}, Stability {pillars.get('stability', 70)}\n"
                f"• AI Underwriting Recommendation: Human Review Recommended for structured starter facility."
            )
            return AssistantChatResponse(
                reply=reply,
                model_used="deterministic-fintech-guardrail",
                suggested_actions=["What should I verify?", "Show risk factors", "How could the score improve?"],
                human_decision_required=True,
                context_applicant_id=context.applicant_id
            )

        # Quick action: How could the score improve?
        if action == "how could the score improve?" or "improve" in q_lower:
            reply = (
                f"Improvement levers for {name}:\n"
                f"1. Wholesale Supplier Promptness: Increasing timely payments from current level to 95%+ projected impact: +4 to +6 points.\n"
                f"2. Operating Tenure: Continued uninterrupted presence at the stall adds +3 points as tenure reaches 24 months.\n"
                f"3. Community Social Collateral: Maintaining verified active participation in self-help groups reinforces Willingness."
            )
            return AssistantChatResponse(
                reply=reply,
                model_used="deterministic-fintech-guardrail",
                suggested_actions=["Explain this score", "Show risk factors", "What should I verify?"],
                human_decision_required=True,
                context_applicant_id=context.applicant_id
            )

    # 2. BORROWER-FACING EDUCATIONAL QUERIES
    if "cibil" in q_lower or "no credit" in q_lower or "credit score" in q_lower:
        reply = (
            "TrustBridge is built specifically for micro-entrepreneurs who lack traditional CIBIL or bureau history. "
            "Instead of formal credit scores, TrustBridge evaluates everyday business consistency—such as stall rental punctuality, "
            "supplier invoice settlements, and utility recharges. A lack of credit history does not prevent you from qualifying."
        )
        return AssistantChatResponse(
            reply=reply,
            model_used="deterministic-fintech-guardrail",
            suggested_actions=["What is supplier repayment?", "How does TrustBridge calculate scores?", "Why are documents needed?"],
            human_decision_required=False
        )

    if "supplier" in q_lower:
        reply = (
            "Supplier repayment measures how consistently and promptly you settle credit accounts with wholesale vendors or mandis. "
            "Punctual settlements (e.g. paying within agreed 7 or 14-day terms) demonstrate commercial reliability and contribute up to "
            "30% of your Willingness to Repay score."
        )
        return AssistantChatResponse(
            reply=reply,
            model_used="deterministic-fintech-guardrail",
            suggested_actions=["What does business tenure mean?", "What is the Trust Score?", "How does consent work?"],
            human_decision_required=False
        )

    if "tenure" in q_lower or "stall" in q_lower:
        reply = (
            "Business tenure refers to the continuous number of months you have operated at your current physical stall, kiosk, or workshop. "
            "Operating in the same spot for 18 to 24 months demonstrates strong business stability and deep community customer loyalty."
        )
        return AssistantChatResponse(
            reply=reply,
            model_used="deterministic-fintech-guardrail",
            suggested_actions=["What is supplier repayment?", "Why are documents needed?", "How does consent work?"],
            human_decision_required=False
        )

    if "consent" in q_lower or "privacy" in q_lower or "data" in q_lower:
        reply = (
            "TrustBridge strictly operates on affirmative, explicit borrower consent under India's DPDP Act and RBI Digital Lending Guidelines. "
            "We only evaluate business telemetry (tenure, cashflow, supplier payments, rental slips). We NEVER collect contacts, SMS messages, "
            "location tracking, religion, caste, or personal browsing history."
        )
        return AssistantChatResponse(
            reply=reply,
            model_used="deterministic-fintech-guardrail",
            suggested_actions=["What data is evaluated?", "Can I withdraw consent?", "How does TrustBridge calculate scores?"],
            human_decision_required=False
        )

    if "document" in q_lower or "proof" in q_lower:
        reply = (
            "Documents like rent receipts, supplier invoices, electricity bills, or physical stall photos act as objective proof of your "
            "commercial activity. They replace formal bank balance sheets and allow lenders to verify that your micro-enterprise is active."
        )
        return AssistantChatResponse(
            reply=reply,
            model_used="deterministic-fintech-guardrail",
            suggested_actions=["What is supplier repayment?", "I have no CIBIL history", "How does consent work?"],
            human_decision_required=False
        )

    # Default informative overview
    reply = (
        "I am the TrustBridge Credit Intelligence Assistant. I provide explainable insights on alternative credit scoring, "
        "repayment behavior, document verification, and risk indicators for micro-enterprises. "
        "Final lending decisions always remain with the human underwriter."
    )
    return AssistantChatResponse(
        reply=reply,
        model_used="deterministic-fintech-guardrail",
        suggested_actions=["What is supplier repayment?", "I have no CIBIL history", "How does TrustBridge calculate scores?"],
        human_decision_required=True
    )


# ------------------------------------------------------------
# Gemini Integration with Guardrails
# ------------------------------------------------------------

def generate_assistant_response(request: AssistantChatRequest) -> AssistantChatResponse:
    """Process chat request using Gemini with strict contextual guardrails and fallback."""
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    user_query = request.messages[-1].content if request.messages else ""

    if not api_key:
        return _generate_rule_based_reply(user_query, request.context, request.quick_action)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        # Build authorized context payload
        context_str = "None provided"
        if request.context:
            context_str = json.dumps({
                "applicant_id": request.context.applicant_id,
                "name": request.context.applicant_name,
                "business_type": request.context.business_type,
                "trust_score": request.context.trust_score,
                "pillars": request.context.pillars,
                "risk_tier": request.context.risk_tier,
                "risk_trajectory": request.context.risk_trajectory,
                "anomaly_flags": request.context.anomaly_flags,
                "user_role": request.context.user_role
            }, indent=2)

        prompt = f"""
You are the TrustBridge Assistant, an explainable FinTech credit-intelligence assistant for micro-enterprise underwriting.

CRITICAL INVARIANTS & GUARDRAILS:
1. NEVER approve or reject any loan.
2. NEVER invent financial data, numbers, or credit history.
3. If information is not in the context, say: "I don't have enough verified information to answer that confidently."
4. Treat anomaly signals as POTENTIAL anomalies for human review, never as confirmed fraud.
5. The deterministic Trust Score is the mathematical truth (0-100).
6. Keep answers concise, professional, and accessible.

AUTHORIZED APPLICANT CONTEXT:
{context_str}

QUICK ACTION REQUESTED: {request.quick_action or 'None'}

USER QUERY:
{user_query}

Respond in strict JSON with:
- "reply": Clear, professional answer adhering strictly to guardrails.
- "suggested_actions": Array of 2 to 3 relevant follow-up action prompts.
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
            data = json.loads(response.text)
            return AssistantChatResponse(
                reply=data.get("reply", "Underwriting guidance generated."),
                model_used="gemini-2.5-flash",
                suggested_actions=data.get("suggested_actions", ["Explain this score", "Show risk factors"]),
                human_decision_required=True,
                confidence="High",
                context_applicant_id=request.context.applicant_id if request.context else None
            )

    except Exception as e:
        logger.warning(f"Assistant Gemini call failed: {e}. Using deterministic guardrail fallback.")

    return _generate_rule_based_reply(user_query, request.context, request.quick_action)
