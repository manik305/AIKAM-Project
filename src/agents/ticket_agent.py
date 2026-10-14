"""Autonomous SAP Dispute Ticket Generation Agent."""
import uuid
from typing import Dict, Any


class SapDisputeTicketAgent:
    """Pre-populates provisional bills and formats SAP IS-U BAPI complaint payloads."""

    @classmethod
    async def generate_ticket(
        cls,
        usc_number: str,
        circle: str,
        reported_reading: float,
        billed_reading: float,
        disputed_amount: float
    ) -> Dict[str, Any]:
        """Constructs an audited dispute ticket payload with provisional adjustments."""
        ticket_id = f"URJA-DISP-{uuid.uuid4().hex[:8].upper()}"
        provisional_amount = round(disputed_amount * 0.45, 2)

        return {
            "ticket_id": ticket_id,
            "usc_number": usc_number,
            "circle": circle,
            "complaint_type": "BILLING_METER_READING_MISMATCH",
            "reported_reading": reported_reading,
            "billed_reading": billed_reading,
            "disputed_amount_inr": disputed_amount,
            "provisional_revised_amount_inr": provisional_amount,
            "status": "SUBMITTED_TO_SAP_ISU",
            "recommended_action": "REVISE_BILL_CREDIT_ADJUSTMENT"
        }
