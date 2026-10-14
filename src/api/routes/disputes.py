"""Dispute Resolution & SAP IS-U Gateway Routes."""
from fastapi import APIRouter
from pydantic import BaseModel
from src.agents.ticket_agent import SapDisputeTicketAgent

router = APIRouter()


class CreateDisputeRequest(BaseModel):
    usc_number: str
    circle: str = "Hyderabad South"
    reported_reading: float
    billed_reading: float
    disputed_amount: float


@router.post("/create")
async def create_dispute_ticket(payload: CreateDisputeRequest):
    """Generate structured dispute ticket and push to DISCOM SAP IS-U."""
    ticket = await SapDisputeTicketAgent.generate_ticket(
        usc_number=payload.usc_number,
        circle=payload.circle,
        reported_reading=payload.reported_reading,
        billed_reading=payload.billed_reading,
        disputed_amount=payload.disputed_amount
    )
    return {
        "status": "success",
        "ticket": ticket
    }
