"""Omnichannel Chat & LangGraph Multi-Agent Orchestration API."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from src.agents.supervisor import MasterSupervisorAgent

router = APIRouter()


class ChatQueryRequest(BaseModel):
    message: str
    preferred_language: str = "te"  # 'te' for Telugu, 'en' for English
    has_image: bool = False
    units: Optional[float] = None
    usc_number: Optional[str] = None
    reported_reading: Optional[float] = None
    billed_reading: Optional[float] = None
    disputed_amount: Optional[float] = None


@router.post("/query")
async def process_chat_query(payload: ChatQueryRequest):
    """Entry point for citizen queries.

    Orchestrates execution strictly through the LangGraph StateGraph multi-agent pipeline,
    coordinating System-1 token routing, deterministic gazette math, multimodal vision audit,
    proactive subsidy advisory, and SAP IS-U dispute handling.
    """
    initial_state = {
        "message": payload.message,
        "preferred_language": payload.preferred_language,
        "has_image": payload.has_image,
        "units": payload.units,
        "usc_number": payload.usc_number,
        "reported_reading": payload.reported_reading,
        "billed_reading": payload.billed_reading,
        "disputed_amount": payload.disputed_amount,
    }

    # Execute end-to-end multi-agent LangGraph workflow
    graph_state = await MasterSupervisorAgent.run_workflow(initial_state)

    return {
        "status": "success",
        "jev_routing_telemetry": graph_state.get("jev_routing_telemetry", {}),
        "response": graph_state.get("final_response", {})
    }
