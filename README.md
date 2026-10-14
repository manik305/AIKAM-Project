# UrjaMitra AI (ఉర్జామిత్ర)
### Enterprise Agentic Billing & Consumer Copilot for TGSPDCL & TGNPDCL
**AIKAM EnergyTech Innovation Challenge (Dept. of Energy, Govt. of Telangana)**  
*Problem Statement ID: 885fa752-1d7b-46f9-a229-a10a62b6f39d (Personalized Billing Assistance)*

---

## 1. Project Overview
**UrjaMitra AI** is a cloud-native, multi-agent AI copilot engineered for Telangana's 1.75 Crore electricity consumers. It addresses the 68% of inbound utility disputes on the state `1912` hotline through:
1. **System-1 Jev Token Redirection**: Sub-100ms intent evaluation and deterministic bypass to eliminate LLM latency.
2. **Zero-Hallucination Tariff Engine**: 100% deterministic Python calculation adhering strictly to official TGERC Gazette formulas.
3. **Multimodal Vision Audit**: OCR extraction of LCD meter readings to detect "Door Lock / Average Billing" mistakes.
4. **Vernacular Telugu-First Experience**: High-naturalness voice notes and chat in Telugu, Hindi, and English.
5. **Elastic AKS Scaling**: Horizontal Pod Autoscaling (HPA) and Cluster Autoscaler provisioned via Terraform to handle 100 → 1,000 → 10,000+ concurrent traffic spikes.

---

## 2. Architecture Overview
```
[ Citizen / WhatsApp / 1912 Voice ]  --->  [ FastAPI Gateway ]
                                                    │
                                     [ Jev System-1 Token Router ] (50-100ms)
                                       ├── (Deterministic) ──> [ Python TGERC Gazette Engine ]
                                       ├── (Chat/Telugu)   ──> [ Tier-2 Conversational LLM ]
                                       └── (Audit/Dispute) ──> [ LangGraph Multi-Agent Core ]
                                                                      │
                                                [ SAP IS-U BAPI Escalation & Heatmaps ]
```

---

## 3. Technology Stack
- **Backend / API**: Python 3.11, FastAPI, Pydantic v2
- **Agent Orchestrator**: Jev Model (System-1 Router) + LangGraph StateGraph (System-2 Reasoning)
- **Calculation Core**: Pure Python Deterministic TGERC Math (0 LLM Tokens)
- **Database & Cache**: PostgreSQL 16 + Redis Cluster (Semantic Cache & Session Store)
- **Object Storage**: MinIO / Azure Blob / S3 (Meter Photo Evidence Vault)
- **Infrastructure & IaC**: Docker Compose (Local), Terraform (Azure), Azure Kubernetes Service (AKS)
- **Autoscaling**: Kubernetes Horizontal Pod Autoscaler (HPA) + AKS Cluster Autoscaler + KEDA

---

## 4. Repository Structure
```
aikam-urjamitra/
├── docs/                 # PRD, BRD, ARCHITECTURE, DEPLOYMENT, DB_SCHEMA, API_SPEC, TEST_REPORT
├── terraform/            # IaC modules (VNet, AKS, Postgres, Redis)
├── k8s/                  # Kubernetes manifests (Ingress, Deployments, HPA, KEDA)
├── docker/               # Dockerfiles & docker-compose.yml
├── src/
│   ├── api/              # FastAPI controllers & routes
│   ├── agents/           # Jev Router & LangGraph multi-agent workflows
│   ├── engine/           # Pure deterministic TGERC tariff & subsidy rules
│   ├── core/             # Database connection pool & settings
│   ├── models/           # SQLAlchemy database schemas
│   └── services/         # SAP IS-U BAPI connector & MinIO storage
├── frontend/             # Citizen Portal & Officer Dashboard
├── tests/                # Unit, integration, and Locust load tests
└── scripts/              # Database initialization & synthetic 500-user seeds
```

---

## 5. Quickstart & Local Setup

### Step 1: Clone and Configure Environment
```bash
git clone <repo-url>
cd "Aikam Project"
cp .env.example .env
```

### Step 2: Launch via Docker Compose (Recommended for Evaluators)
```bash
docker-compose -f docker/docker-compose.yml up --build -d
```
The services will be active at:
- **API Documentation (Swagger UI)**: `http://localhost:8000/docs`
- **Citizen Portal**: `http://localhost:8000/`
- **Officer Command Center**: `http://localhost:8000/officer`
- **PostgreSQL Database**: `localhost:5432`
- **Redis Cache**: `localhost:6379`

### Step 3: Run Database Seed Script
```bash
docker-compose exec api python scripts/seed_data.py
```

---

## 6. Verification & Test Evidence
Run the automated test suite:
```bash
pytest tests/unit/ -v
pytest tests/integration/ -v
```
Review [docs/TEST_REPORT.md](file:///c:/Users/manik/Downloads/Aikam%20Project/docs/TEST_REPORT.md) for detailed test cases, expected vs. actual outputs, and load scaling benchmarks.
