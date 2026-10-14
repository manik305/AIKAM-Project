"""Integration Tests for FastAPI Endpoints & LangGraph Multi-Agent Flow."""
import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_health_check_endpoint():
    """Verify health endpoint returns 200 with active status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["jev_router_status"] == "active"


def test_chat_query_routing_bill_breakdown():
    """Verify chat query routing through Jev System-1 evaluator and LangGraph bill deconstruction."""
    payload = {
        "message": "Explain my bill for 150 units in Telugu",
        "preferred_language": "te",
        "units": 150.0
    }
    response = client.post("/api/v1/chat/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "jev_routing_telemetry" in data
    assert data["jev_routing_telemetry"]["bypass_llm"] is True
    assert "calculation" in data["response"]
    assert data["response"]["calculation"]["billed_units"] == 150.0
    assert data["response"]["calculation"]["net_payable_amount"] == 0.0


def test_chat_query_routing_vision_meter_audit():
    """Verify LangGraph coordinates meter audit and auto-escalation via API."""
    payload = {
        "message": "Please audit my meter photo",
        "preferred_language": "en",
        "has_image": True,
        "units": 240.0
    }
    response = client.post("/api/v1/chat/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["jev_routing_telemetry"]["intent"] == "METER_READING_AUDIT"
    assert "vision_audit" in data["response"]
    assert "ticket" in data["response"]


def test_chat_query_routing_subsidy_advisory():
    """Verify LangGraph executes subsidy advisory path via API."""
    payload = {
        "message": "Will I cross 200 units for gruha jyothi subsidy?",
        "preferred_language": "te",
        "units": 180.0
    }
    response = client.post("/api/v1/chat/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["jev_routing_telemetry"]["intent"] == "SUBSIDY_ADVISORY"
    assert "advisory" in data["response"]


def test_disputes_create_endpoint():
    """Verify official SAP IS-U dispute creation endpoint."""
    payload = {
        "usc_number": "100234891",
        "circle": "Hyderabad South",
        "reported_reading": 14210.0,
        "billed_reading": 14890.0,
        "disputed_amount": 4820.0
    }
    response = client.post("/api/v1/disputes/create", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["ticket"]["usc_number"] == "100234891"
    assert data["ticket"]["status"] == "SUBMITTED_TO_SAP_ISU"
