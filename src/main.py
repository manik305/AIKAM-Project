"""UrjaMitra AI - FastAPI Gateway Entry Point.

Combines Jev System-1 Token Routing, Deterministic TGERC Math,
and LangGraph Multi-Agent Workflows.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.routes import auth, chat, disputes

app = FastAPI(
    title="UrjaMitra AI API",
    description="Enterprise Agentic Billing & Consumer Copilot for TGSPDCL & TGNPDCL",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route Handlers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Agentic Chat & Vernacular"])
app.include_router(disputes.router, prefix="/api/v1/disputes", tags=["Disputes & SAP IS-U"])


@app.get("/health", tags=["Health"])
async def health_check():
    """Healthcheck endpoint for Kubernetes liveness/readiness probes."""
    return {
        "status": "healthy",
        "service": "urjamitra-api",
        "environment": settings.ENVIRONMENT,
        "jev_router_status": "active",
        "deterministic_engine": "active"
    }
