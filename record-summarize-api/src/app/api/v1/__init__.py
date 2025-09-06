from fastapi import APIRouter
from .user_route import router as user_router
from .transcription_route import router as transcription_router
from .record_route import router as record_router
from .storage_route import router as storage_router
from .auth_route import router as auth_router
from .pipeline_route import router as pipeline_router
from .llm_route import router as llm_router

router = APIRouter(prefix="/v1")
routes = [
    auth_router,
    user_router,
    record_router,
    transcription_router,
    storage_router,
    pipeline_router,
    llm_router
]

for route in routes:
    router.include_router(route)
