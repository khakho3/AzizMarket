from fastapi import APIRouter

from app.api.v1.admin_sellers import router as admin_sellers_router
from app.api.v1.auth import router as auth_router
from app.api.v1.health import router as health_router
from app.api.v1.protected import router as protected_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(protected_router)
api_router.include_router(admin_sellers_router)
