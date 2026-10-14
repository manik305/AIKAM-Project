# UrjaMitra AI: Database Schema & Entity-Relationship Design
**Database Engine**: PostgreSQL 16  

---

## 1. Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ CONSUMER_CONNECTIONS : owns
    CONSUMER_CONNECTIONS ||--o{ ELECTRICITY_BILLS : bills
    CONSUMER_CONNECTIONS ||--o{ DISPUTE_TICKETS : disputes

    USERS {
        varchar(36) id PK
        varchar(120) full_name
        varchar(15) phone_number UK
        varchar(255) hashed_password
        varchar(20) role
        varchar(10) preferred_language
        boolean is_active
        timestamp created_at
    }

    CONSUMER_CONNECTIONS {
        varchar(20) usc_number PK
        varchar(36) user_id FK
        varchar(50) circle
        varchar(50) section
        varchar(20) category
        integer contracted_load_kw
        boolean is_gruha_jyothi_eligible
        varchar(50) meter_serial_no
        timestamp created_at
    }

    ELECTRICITY_BILLS {
        varchar(36) bill_id PK
        varchar(20) usc_number FK
        varchar(7) billing_month
        float billed_units
        float previous_reading
        float present_reading
        varchar(20) meter_status
        float energy_charges
        float customer_charges
        float fixed_charges
        float electricity_duty
        float subsidy_amount
        float net_payable_amount
        jsonb slab_breakdown
        varchar(10) is_disputed
    }

    DISPUTE_TICKETS {
        varchar(36) ticket_id PK
        varchar(20) usc_number FK
        varchar(36) bill_id
        varchar(50) complaint_type
        float reported_reading
        float billed_reading
        float disputed_amount
        float provisional_revised_amount
        varchar(500) evidence_photo_url
        float ocr_confidence_score
        varchar(20) status
        varchar(50) sap_ticket_reference
        text resolution_notes
        timestamp created_at
        timestamp resolved_at
    }
```

---

## 2. Indexing Strategy for 10,000+ Concurrent Queries

- `idx_connections_user`: B-tree index on `consumer_connections(user_id)` for citizen profile lookups in <2ms.
- `idx_bills_usc_month`: Composite B-tree index on `electricity_bills(usc_number, billing_month)` for instant invoice deconstruction.
- `idx_disputes_usc`: B-tree index on `dispute_tickets(usc_number)` for fast ticket resolution tracking.
