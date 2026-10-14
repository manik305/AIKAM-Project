-- UrjaMitra AI Database Initialization DDL
-- Database: PostgreSQL 16

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(120),
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'CITIZEN',
    preferred_language VARCHAR(10) DEFAULT 'te',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consumer_connections (
    usc_number VARCHAR(20) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    circle VARCHAR(50) NOT NULL,
    section VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL,
    contracted_load_kw INTEGER DEFAULT 1,
    is_gruha_jyothi_eligible BOOLEAN DEFAULT TRUE,
    meter_serial_no VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS electricity_bills (
    bill_id VARCHAR(36) PRIMARY KEY,
    usc_number VARCHAR(20) REFERENCES consumer_connections(usc_number) ON DELETE CASCADE,
    billing_month VARCHAR(7) NOT NULL,
    billed_units FLOAT NOT NULL,
    previous_reading FLOAT NOT NULL,
    present_reading FLOAT NOT NULL,
    meter_status VARCHAR(20) DEFAULT 'NORMAL',
    energy_charges FLOAT NOT NULL,
    customer_charges FLOAT NOT NULL,
    fixed_charges FLOAT NOT NULL,
    electricity_duty FLOAT NOT NULL,
    subsidy_amount FLOAT DEFAULT 0.0,
    net_payable_amount FLOAT NOT NULL,
    slab_breakdown JSONB,
    is_disputed VARCHAR(10) DEFAULT 'NO'
);

CREATE TABLE IF NOT EXISTS dispute_tickets (
    ticket_id VARCHAR(36) PRIMARY KEY,
    usc_number VARCHAR(20) REFERENCES consumer_connections(usc_number) ON DELETE CASCADE,
    bill_id VARCHAR(36) NOT NULL,
    complaint_type VARCHAR(50) NOT NULL,
    reported_reading FLOAT NOT NULL,
    billed_reading FLOAT NOT NULL,
    disputed_amount FLOAT NOT NULL,
    provisional_revised_amount FLOAT NOT NULL,
    evidence_photo_url VARCHAR(500),
    ocr_confidence_score FLOAT DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'SUBMITTED',
    sap_ticket_reference VARCHAR(50),
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Performance Indexes for 10,000+ Concurrent Queries
CREATE INDEX IF NOT EXISTS idx_connections_user ON consumer_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_usc_month ON electricity_bills(usc_number, billing_month);
CREATE INDEX IF NOT EXISTS idx_disputes_usc ON dispute_tickets(usc_number);
