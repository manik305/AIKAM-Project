# UrjaMitra AI: API Specification (OpenAPI / REST)

### Base URL:
- Local Development: `http://localhost:8000/api/v1`
- Cloud Production: `https://urjamitra.tgspdcl.gov.in/api/v1`

---

## 1. Authentication Endpoints

### `POST /auth/login`
- **Purpose**: Authenticate citizen or utility section officer.
- **Request Payload**:
```json
{
  "phone_number": "9876543210",
  "password": "SecurePassword123"
}
```
- **Response (200 OK)**:
```json
{
  "status": "success",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "phone_number": "9876543210",
  "role": "CITIZEN"
}
```

---

## 2. Agentic Chat & Jev Token Redirection

### `POST /chat/query`
- **Purpose**: Submits citizen inquiry. Evaluated by Jev System-1 Token Router in <100ms.
- **Request Payload**:
```json
{
  "message": "Why is my bill calculated for 165 units?",
  "preferred_language": "te",
  "units": 165.0,
  "has_image": false
}
```
- **Response (200 OK)**:
```json
{
  "status": "success",
  "jev_routing_telemetry": {
    "intent": "BILL_BREAKDOWN",
    "bypass_llm": true,
    "dispute_severity_score": 2,
    "routed_target": "DETERMINISTIC_ENGINE",
    "latency_ms": 68.4,
    "evaluation_model": "jev-system1-parallel"
  },
  "response": {
    "calculation": {
      "billed_units": 165.0,
      "energy_charges": 652.0,
      "customer_charges": 60.0,
      "fixed_charges": 10.0,
      "electricity_duty": 9.9,
      "gross_amount": 731.9,
      "subsidy_amount": 731.9,
      "net_payable_amount": 0.0,
      "subsidy_status_note": "Full 100% Zero-Bill Subsidy applied under Gruha Jyothi scheme (<= 200 units)."
    },
    "vernacular_explanation": "మీరు ఈ నెల 165 యూనిట్లు వాడారు. గృహజ్యోతి పథకం కింద మీ మొత్తం బిల్లు రూ. 0.00.",
    "language": "te"
  }
}
```

---

## 3. Dispute & SAP IS-U Gateway

### `POST /disputes/create`
- **Purpose**: Pushes structured dispute ticket to DISCOM SAP IS-U BAPI.
- **Request Payload**:
```json
{
  "usc_number": "100234891",
  "circle": "Hyderabad South",
  "reported_reading": 14210.0,
  "billed_reading": 14890.0,
  "disputed_amount": 4820.0
}
```
- **Response (200 OK)**:
```json
{
  "status": "success",
  "ticket": {
    "ticket_id": "URJA-DISP-89F1",
    "usc_number": "100234891",
    "circle": "Hyderabad South",
    "complaint_type": "BILLING_METER_READING_MISMATCH",
    "disputed_amount_inr": 4820.0,
    "provisional_revised_amount_inr": 2169.0,
    "status": "SUBMITTED_TO_SAP_ISU"
  }
}
```
