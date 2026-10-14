"""FastAPI Dependency Injection helpers."""
from fastapi import Header, HTTPException, status


async def verify_auth_token(authorization: str = Header(None)) -> str:
    """Mock/Real JWT authorization bearer token validator."""
    if not authorization:
        # Allow default guest/citizen for sandbox prototype
        return "citizen_guest_user"
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication header format."
        )
    return authorization.split("Bearer ")[1]
