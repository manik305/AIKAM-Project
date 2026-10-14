"""LangGraph Multi-Agent Orchestrator & State Machine for UrjaMitra AI.

Enforces System-2 Agentic Coordination aligned with docs/ARCHITECTURE.md and docs/PRD.md:
- Router Node (Jev System-1 Token Evaluation)
- Bill Deconstruction Node (Deterministic TGERC Tariff + Subsidy Rules)
- Vision Meter Audit Node (Multimodal OCR & Reading Verification)
- Subsidy Advisory Node (Consumption Spike & 200-unit Cliff Advisory)
- Dispute Ticket Node (Autonomous SAP IS-U BAPI Complaint Payload)
- FAQ Explainer Node (Multilingual Vernacular Guidance)
- Aggregator Node (State Synthesis & Response Formulation)
"""

from typing import Dict, Any, Optional, TypedDict
import re
from langgraph.graph import StateGraph, START, END

from src.agents.router_jev import JevSystemOneRouter
from src.agents.deconstruction_agent import BillDeconstructionAgent
from src.agents.vision_agent import VisionMeterAuditAgent
from src.agents.advisory_agent import ProactiveAdvisoryAgent
from src.agents.ticket_agent import SapDisputeTicketAgent


class UrjaMitraGraphState(TypedDict, total=False):
    """Unified LangGraph State Schema for UrjaMitra AI multi-agent workflows."""
    # Input arguments
    message: str
    preferred_language: str
    has_image: bool
    image_bytes: Optional[bytes]
    units: Optional[float]
    usc_number: Optional[str]
    circle: Optional[str]
    days_remaining: Optional[int]
    reported_reading: Optional[float]
    billed_reading: Optional[float]
    disputed_amount: Optional[float]

    # Telemetry & System-1 Primitives
    intent: str
    bypass_llm: bool
    dispute_severity_score: int
    jev_routing_telemetry: Dict[str, Any]
    current_node: str

    # Agent node outputs
    calculation: Optional[Dict[str, Any]]
    vision_audit: Optional[Dict[str, Any]]
    advisory: Optional[Dict[str, Any]]
    dispute_ticket: Optional[Dict[str, Any]]
    faq_response: Optional[Dict[str, Any]]

    # Final synthesized output
    vernacular_explanation: str
    final_response: Dict[str, Any]


# -------------------------------------------------------------------------
# Node Implementations
# -------------------------------------------------------------------------

async def router_node(state: UrjaMitraGraphState) -> Dict[str, Any]:
    """System-1 Decision Node: evaluates message tokens and sets routing intent."""
    message = state.get("message", "")
    has_image = state.get("has_image", False)
    units = state.get("units")

    # If units is None, attempt extraction from numbers in user message
    if units is None and message:
        digits = re.findall(r"\b\d+(?:\.\d+)?\b", message)
        if digits:
            try:
                units = float(digits[0])
            except ValueError:
                pass

    routing_result = await JevSystemOneRouter.evaluate_and_route(
        user_message=message,
        has_image=has_image,
        units=units,
    )

    return {
        "intent": routing_result["intent"],
        "bypass_llm": routing_result["bypass_llm"],
        "dispute_severity_score": routing_result["dispute_severity_score"],
        "jev_routing_telemetry": routing_result,
        "units": units,
        "current_node": "router_node",
    }


async def bill_deconstruction_node(state: UrjaMitraGraphState) -> Dict[str, Any]:
    """System-0 Deterministic Calculation & Bill Deconstruction Node."""
    units = state.get("units") if state.get("units") is not None else 165.0
    lang = state.get("preferred_language", "te")

    result = await BillDeconstructionAgent.analyze_bill(
        units=units,
        is_gruha_jyothi=True,
        language=lang,
    )

    return {
        "calculation": result.get("calculation"),
        "vernacular_explanation": result.get("vernacular_explanation", ""),
        "current_node": "bill_deconstruction_node",
    }


async def vision_audit_node(state: UrjaMitraGraphState) -> Dict[str, Any]:
    """Multimodal Vision Node: extracts meter reading and audits discrepancy."""
    image_bytes = state.get("image_bytes") or b"dummy_image_data"
    billed_units = state.get("units") or 250.0
    lang = state.get("preferred_language", "te")

    audit_result = await VisionMeterAuditAgent.audit_meter_photo(
        image_bytes=image_bytes,
        billed_units=billed_units,
    )

    if lang == "te":
        explanation = (
            f"మీటర్ OCR రీడింగ్: {audit_result['extracted_reading']} kWh. "
            f"విశ్వసనీయత: {round(audit_result['ocr_confidence'] * 100, 1)}%. "
            + ("తేడా గుర్తించబడింది! సవరణ కోసం ఫిర్యాదు నమోదు చేయబడుతోంది."
               if audit_result["discrepancy_detected"]
               else "రీడింగ్ సరైనదిగా ధృవీకరించబడింది.")
        )
    else:
        explanation = (
            f"Meter OCR reading: {audit_result['extracted_reading']} kWh "
            f"(Confidence: {round(audit_result['ocr_confidence'] * 100, 1)}%). "
            + ("Discrepancy detected! Initiating dispute escalation."
               if audit_result["discrepancy_detected"]
               else "Meter reading verified correct.")
        )

    return {
        "vision_audit": audit_result,
        "vernacular_explanation": explanation,
        "current_node": "vision_audit_node",
    }


async def subsidy_advisory_node(state: UrjaMitraGraphState) -> Dict[str, Any]:
    """Proactive Advisory Node: calculates trajectory to 200-unit subsidy cliff."""
    current_units = state.get("units") or 172.0
    days_remaining = state.get("days_remaining") or 6
    lang = state.get("preferred_language", "te")

    advisory_data = await ProactiveAdvisoryAgent.evaluate_subsidy_risk(
        current_units=current_units,
        days_remaining=days_remaining,
    )

    if lang == "te":
        explanation = (
            f"మీరు ఇప్పటివరకు {current_units} యూనిట్లు వినియోగించారు. "
            f"నెలాఖరుకు అంచనా: {advisory_data['projected_units']} యూనిట్లు. "
            f"గృహజ్యోతి ఉచిత విద్యుత్ (200 యూనిట్ల పరిమితి) కోల్పోకుండా జాగ్రత్తపడండి!"
        )
    else:
        explanation = advisory_data["advisory_message"]

    return {
        "advisory": advisory_data,
        "vernacular_explanation": explanation,
        "current_node": "subsidy_advisory_node",
    }


async def dispute_ticket_node(state: UrjaMitraGraphState) -> Dict[str, Any]:
    """Autonomous SAP IS-U BAPI Complaint Ticket Generator Node."""
    usc_number = state.get("usc_number") or "100234891"
    circle = state.get("circle") or "Hyderabad South"
    reported_reading = state.get("reported_reading") or 14210.0
    billed_reading = state.get("billed_reading") or 14890.0
    disputed_amount = state.get("disputed_amount") or 4820.0
    lang = state.get("preferred_language", "te")

    ticket_data = await SapDisputeTicketAgent.generate_ticket(
        usc_number=usc_number,
        circle=circle,
        reported_reading=reported_reading,
        billed_reading=billed_reading,
        disputed_amount=disputed_amount,
    )

    if lang == "te":
        explanation = (
            f"ఫిర్యాదు టికెట్ {ticket_data['ticket_id']} విజయవంతంగా SAP IS-U లో నమోదు చేయబడింది. "
            f"తాత్కాలిక సవరించిన మొత్తం: రూ. {ticket_data['provisional_revised_amount_inr']}."
        )
    else:
        explanation = (
            f"Dispute ticket {ticket_data['ticket_id']} logged into SAP IS-U. "
            f"Provisional revised bill: ₹{ticket_data['provisional_revised_amount_inr']}."
        )

    return {
        "dispute_ticket": ticket_data,
        "vernacular_explanation": explanation,
        "current_node": "dispute_ticket_node",
    }


async def faq_explainer_node(state: UrjaMitraGraphState) -> Dict[str, Any]:
    """General FAQ & Vernacular Consumer Assistance Node."""
    lang = state.get("preferred_language", "te")
    if lang == "te":
        explanation = (
            "నమస్కారం! తెలంగాణ గృహజ్యోతి పథకం కింద అర్హులైన గృహ వినియోగదారులకు 200 యూనిట్ల వరకు ఉచిత విద్యుత్ లభిస్తుంది. "
            "మీ విద్యుత్ బిల్లు లేదా మీటర్ రీడింగ్ ఫోటో వివరాలు పంపితే నేను తక్షణమే లెక్కించి వివరిస్తాను."
        )
    else:
        explanation = (
            "Welcome! Under the Telangana Gruha Jyothi scheme, eligible domestic consumers receive up to 200 units of free electricity. "
            "Please provide your billed units or upload a meter photo for instantaneous verification."
        )

    faq_info = {
        "scheme": "Gruha Jyothi Scheme (Telangana)",
        "subsidy_threshold_units": 200,
        "utility": "TGSPDCL / TGNPDCL",
        "helpline": "1912",
    }

    return {
        "faq_response": faq_info,
        "vernacular_explanation": explanation,
        "current_node": "faq_explainer_node",
    }


async def aggregator_node(state: UrjaMitraGraphState) -> Dict[str, Any]:
    """Synthesizes agent outputs into final standardized API response payload."""
    lang = state.get("preferred_language", "te")
    final_resp: Dict[str, Any] = {
        "vernacular_explanation": state.get("vernacular_explanation", ""),
        "language": lang,
    }

    if state.get("calculation"):
        final_resp["calculation"] = state["calculation"]

    if state.get("vision_audit"):
        final_resp["vision_audit"] = state["vision_audit"]

    if state.get("advisory"):
        final_resp["advisory"] = state["advisory"]

    if state.get("dispute_ticket"):
        final_resp["ticket"] = state["dispute_ticket"]

    if state.get("faq_response"):
        final_resp["faq"] = state["faq_response"]

    return {
        "final_response": final_resp,
        "current_node": "aggregator_node",
    }


# -------------------------------------------------------------------------
# Dynamic Routing Conditionals
# -------------------------------------------------------------------------

def route_after_router(state: UrjaMitraGraphState) -> str:
    """Evaluates router node state and directs to the appropriate specialist agent."""
    intent = state.get("intent", "GENERAL_FAQ")
    if intent == "BILL_BREAKDOWN":
        return "bill_deconstruction_node"
    elif intent == "METER_READING_AUDIT":
        return "vision_audit_node"
    elif intent == "SUBSIDY_ADVISORY":
        return "subsidy_advisory_node"
    elif intent == "OFFICIAL_DISPUTE":
        return "dispute_ticket_node"
    return "faq_explainer_node"


def route_after_vision(state: UrjaMitraGraphState) -> str:
    """Coordinates from vision audit: escalates to dispute if discrepancy found, else deconstructs."""
    audit = state.get("vision_audit") or {}
    if audit.get("discrepancy_detected"):
        return "dispute_ticket_node"
    return "bill_deconstruction_node"


# -------------------------------------------------------------------------
# StateGraph Assembly & Compilation
# -------------------------------------------------------------------------

def build_urjamitra_graph():
    """Builds and compiles the complete LangGraph StateGraph orchestration pipeline."""
    builder = StateGraph(UrjaMitraGraphState)

    # Register Nodes
    builder.add_node("router_node", router_node)
    builder.add_node("bill_deconstruction_node", bill_deconstruction_node)
    builder.add_node("vision_audit_node", vision_audit_node)
    builder.add_node("subsidy_advisory_node", subsidy_advisory_node)
    builder.add_node("dispute_ticket_node", dispute_ticket_node)
    builder.add_node("faq_explainer_node", faq_explainer_node)
    builder.add_node("aggregator_node", aggregator_node)

    # Edges & Conditional Branches
    builder.add_edge(START, "router_node")

    builder.add_conditional_edges(
        "router_node",
        route_after_router,
        {
            "bill_deconstruction_node": "bill_deconstruction_node",
            "vision_audit_node": "vision_audit_node",
            "subsidy_advisory_node": "subsidy_advisory_node",
            "dispute_ticket_node": "dispute_ticket_node",
            "faq_explainer_node": "faq_explainer_node",
        },
    )

    builder.add_conditional_edges(
        "vision_audit_node",
        route_after_vision,
        {
            "dispute_ticket_node": "dispute_ticket_node",
            "bill_deconstruction_node": "bill_deconstruction_node",
        },
    )

    builder.add_edge("bill_deconstruction_node", "aggregator_node")
    builder.add_edge("subsidy_advisory_node", "aggregator_node")
    builder.add_edge("dispute_ticket_node", "aggregator_node")
    builder.add_edge("faq_explainer_node", "aggregator_node")
    builder.add_edge("aggregator_node", END)

    return builder.compile()


urjamitra_graph = build_urjamitra_graph()


class MasterSupervisorAgent:
    """Coordinates multi-turn state transitions between specialized sub-agents via LangGraph."""

    graph = urjamitra_graph

    @classmethod
    async def run_workflow(cls, input_state: Dict[str, Any]) -> Dict[str, Any]:
        """Main graph execution entry point."""
        return await cls.graph.ainvoke(input_state)

    @classmethod
    async def process_turn(cls, state: Dict[str, Any]) -> Dict[str, Any]:
        """Executes a single turn state transition through the graph."""
        return await cls.graph.ainvoke(state)
