from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.config import settings
from ...core.db.database import async_get_db
from ...core.security import create_access_token
from ...dtos.user import UserCreateDto
from ...services.user_service import user_service
import requests
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth

oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    refresh_token_url=None,
    authorize_state=settings.SECRET_KEY,
    redirect_uri=settings.GOOGLE_REDIRECT_URI,
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
    client_kwargs={"scope": "openid profile email"},
)

router = APIRouter(tags=["Auth"])


@router.get("/auth/google/login-redirect")
async def login_redirect(request: Request):
    return await oauth.google.authorize_redirect(request, settings.GOOGLE_REDIRECT_URI)


@router.get("/auth/google/callback")
async def auth_google_callback(request: Request, db: AsyncSession = Depends(async_get_db)):
    token = await oauth.google.authorize_access_token(request)

    user_info_endpoint = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {"Authorization": f'Bearer {token["access_token"]}'}
    google_response = requests.get(user_info_endpoint, headers=headers)
    user_info = google_response.json()

    user = await user_service.upsert_by_email(db=db, data=UserCreateDto(
        email=user_info.get("email"),
        avatar=user_info.get("picture"),
        full_name=user_info.get("name"),
        first_name=user_info.get("given_name"),
        last_name=user_info.get("family_name")
    ))

    jwt_token = await create_access_token({
        "sub": user["email"],
        "id": str(user["id"]),
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "full_name": user["full_name"],
        "email": user["email"],
        "avatar": user["avatar"]
    })
    response = RedirectResponse(settings.FRONTEND_URL)
    response.set_cookie(
        key="access_token",
        value=jwt_token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=3600
    )
    return response
