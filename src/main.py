"""UrjaMitra AI - FastAPI Gateway Entry Point.

Combines Jev System-1 Token Routing, Deterministic TGERC Math,
and LangGraph Multi-Agent Workflows.
"""

import sys
from pathlib import Path

# Ensure project root is in sys.path so 'src.*' imports resolve cleanly
# whether running from project root or from inside src/
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

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

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = ROOT_DIR / "frontend" / "dist"
if frontend_dist.exists() and (frontend_dist / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/", tags=["Frontend"])
    async def serve_frontend():
        return FileResponse(str(frontend_dist / "index.html"))


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

if __name__ == "__main__":
    import uvicorn
    app_target = "main:app" if Path.cwd() == Path(__file__).resolve().parent else "src.main:app"
    uvicorn.run(app_target, host=settings.APP_HOST, port=settings.APP_PORT, reload=True)
