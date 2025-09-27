from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import traceback
import google
from src.app.core.exceptions.app_exception import AppException


class ExceptionHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        try:
            response = await call_next(request)
            return response
        except google.genai.errors.ServerError as exc:
            logging.error(f"Unhandled error: {str(exc)}")
            return JSONResponse(
                status_code=503,
                content={"status_code": 503, "message": "Gemini-AI Error"})
        except AppException as exc:
            return JSONResponse(
                status_code=exc.status_code,
                content={"status_code": exc.status_code, "message": exc.message})
        except Exception as exc:
            logging.error(f"Unhandled error: {str(exc)}")
            traceback.print_exc()
            return JSONResponse(
                status_code=500,
                content={
                    "status_code": 500,
                    "detail": "Internal Server Error",
                    "message": str(exc)
                }
            )
