"""Authentication & Role-Based Access Control (RBAC) Dependency for TrustBridge.

Supported Roles:
- borrower: Can submit applications, access own profile and uploaded documents.
- underwriter: Can view review queue, access applicant dossiers, simulate scenarios, verify documents, and record decisions.
- admin: Can manage platform governance, fairness parameters, user roles, and audit trail.
"""

import os
from typing import List, Optional
from fastapi import Header, HTTPException, status, Depends
from app.models import UserRole, UserProfile

# Demo token mappings for local evaluation and automated testing
DEMO_TOKENS = {
    "demo-borrower-token": UserProfile(
        user_id="usr-borrower-ravi",
        email="borrower@trustbridge.dev",
        full_name="Ravi Kumar (Borrower)",
        role=UserRole.BORROWER
    ),
    "demo-underwriter-token": UserProfile(
        user_id="usr-underwriter-09",
        email="underwriter@trustbridge.dev",
        full_name="Bangalore Credit Officer 09",
        role=UserRole.UNDERWRITER
    ),
    "demo-admin-token": UserProfile(
        user_id="usr-admin-system",
        email="admin@trustbridge.dev",
        full_name="Chief Risk Officer",
        role=UserRole.ADMIN
    )
}


def demo_auth_enabled() -> bool:
    """Demo identities are opt-in and must never be accepted in production."""
    return (os.getenv("ENABLE_DEMO_AUTH", "false").lower() == "true"
            and os.getenv("ENVIRONMENT", "production").lower() in {"development", "test"})


async def get_current_user(
    authorization: Optional[str] = Header(None)
) -> UserProfile:
    """Validate access tokens with Supabase Auth; never trust decoded JWT claims."""
    import httpx

    unauthorized = HTTPException(
        status_code=401, detail="A valid Bearer session is required.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not authorization:
        raise unauthorized
    scheme, _, token = authorization.partition(" ")
    token = token.strip()
    if scheme.lower() != "bearer" or not token:
        raise unauthorized
    if token in DEMO_TOKENS:
        if demo_auth_enabled():
            return DEMO_TOKENS[token]
        raise unauthorized
    if token.startswith("role:"):
        raise unauthorized

    url = os.getenv("SUPABASE_URL", "").rstrip("/")
    key = os.getenv("SUPABASE_ANON_KEY", "")
    if not url or not key:
        raise HTTPException(status_code=503, detail="Authentication service is not configured.")
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"{url}/auth/v1/user",
                headers={"Authorization": f"Bearer {token}", "apikey": key},
            )
        if response.status_code in {401, 403}:
            raise unauthorized
        response.raise_for_status()
        payload = response.json()
        if not payload.get("id"):
            raise unauthorized
        # app_metadata is assigned by trusted administrators. user_metadata is editable.
        role_name = payload.get("app_metadata", {}).get("role", "borrower")
        role = UserRole(role_name) if role_name in {r.value for r in UserRole} else UserRole.BORROWER
        return UserProfile(
            user_id=payload["id"], email=payload.get("email") or "",
            full_name=payload.get("user_metadata", {}).get("full_name") or "User",
            role=role,
        )
    except HTTPException:
        raise
    except (httpx.HTTPError, ValueError, TypeError, KeyError):
        raise HTTPException(status_code=503, detail="Authentication service is unavailable.")


def require_role(allowed_roles: List[UserRole]):
    """Role-based authorization guard factory."""
    async def role_checker(current_user: UserProfile = Depends(get_current_user)) -> UserProfile:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: Role '{current_user.role.value}' does not have permission for this resource. Required: {[r.value for r in allowed_roles]}"
            )
        return current_user
    return role_checker
