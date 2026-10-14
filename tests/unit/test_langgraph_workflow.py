"""Unit Tests for LangGraph Multi-Agent Orchestration & State Machine."""
import pytest
from src.agents.supervisor import MasterSupervisorAgent, urjamitra_graph


@pytest.mark.asyncio
async def test_langgraph_bill_deconstruction_workflow():
    """Verify LangGraph executes Bill Deconstruction node with deterministic calculations."""
    state_input = {
        "message": "Please calculate my electricity bill for 165 units",
        "preferred_language": "te",
        "units": 165.0,
        "has_image": False,
    }
    result = await MasterSupervisorAgent.run_workflow(state_input)
    assert result["intent"] == "BILL_BREAKDOWN"
    assert result["current_node"] == "aggregator_node"
    assert "calculation" in result["final_response"]
    calc = result["final_response"]["calculation"]
    assert calc["billed_units"] == 165.0
    assert calc["net_payable_amount"] == 0.0  # Gruha Jyothi subsidy <= 200 units


@pytest.mark.asyncio
async def test_langgraph_vision_meter_audit_with_discrepancy():
    """Verify LangGraph coordinates vision audit node to dispute ticket node when discrepancy detected."""
    state_input = {
        "message": "Check my meter photo",
        "preferred_language": "en",
        "has_image": True,
        "units": 350.0,  # > 200 triggers discrepancy detection in VisionMeterAuditAgent
    }
    result = await MasterSupervisorAgent.run_workflow(state_input)
    assert result["intent"] == "METER_READING_AUDIT"
    assert "vision_audit" in result["final_response"]
    assert result["final_response"]["vision_audit"]["discrepancy_detected"] is True
    # Discrepancy detected automatically triggers dispute ticket node in LangGraph
    assert "ticket" in result["final_response"]
    assert "URJA-DISP-" in result["final_response"]["ticket"]["ticket_id"]


@pytest.mark.asyncio
async def test_langgraph_subsidy_advisory_workflow():
    """Verify LangGraph executes Proactive Subsidy Advisory node."""
    state_input = {
        "message": "Am I going to lose my Gruha Jyothi subsidy 200 units?",
        "preferred_language": "en",
        "units": 185.0,
        "days_remaining": 5,
        "has_image": False,
    }
    result = await MasterSupervisorAgent.run_workflow(state_input)
    assert result["intent"] == "SUBSIDY_ADVISORY"
    assert "advisory" in result["final_response"]
    advisory = result["final_response"]["advisory"]
    assert advisory["subsidy_cliff_risk"] == "HIGH"
    assert advisory["projected_units"] > 200


@pytest.mark.asyncio
async def test_langgraph_official_dispute_workflow():
    """Verify LangGraph executes SAP Dispute Ticket node for official disputes."""
    state_input = {
        "message": "I want to file a dispute complaint for wrong bill reading",
        "preferred_language": "te",
        "usc_number": "100234891",
        "reported_reading": 14210.0,
        "billed_reading": 14890.0,
        "disputed_amount": 4820.0,
        "has_image": False,
    }
    result = await MasterSupervisorAgent.run_workflow(state_input)
    assert result["intent"] == "OFFICIAL_DISPUTE"
    assert "ticket" in result["final_response"]
    assert result["final_response"]["ticket"]["usc_number"] == "100234891"
    assert result["final_response"]["ticket"]["status"] == "SUBMITTED_TO_SAP_ISU"


@pytest.mark.asyncio
async def test_langgraph_general_faq_workflow():
    """Verify LangGraph executes General FAQ node for general inquiries."""
    state_input = {
        "message": "Hello, how do I register for free power scheme?",
        "preferred_language": "te",
        "has_image": False,
    }
    result = await MasterSupervisorAgent.run_workflow(state_input)
    assert result["intent"] == "GENERAL_FAQ"
    assert "faq" in result["final_response"]
    assert "నమస్కారం" in result["final_response"]["vernacular_explanation"]
