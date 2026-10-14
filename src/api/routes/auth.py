"""Authentication & Citizen Session Endpoints."""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class LoginRequest(BaseModel):
    phone_number: str
    password: str


@router.post("/login")
async def login(payload: LoginRequest):
    """Authenticate citizen or utility officer."""
    return {
        "status": "success",
        "access_token": "mock_jwt_token_for_prototype",
        "token_type": "bearer",
        "phone_number": payload.phone_number,
        "role": "CITIZEN"
    }
