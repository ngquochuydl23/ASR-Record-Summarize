from redis.asyncio import Redis
import uvicorn
import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from middlewares.exception_handling_middleware import ExceptionHandlingMiddleware
from src.app.connection_manager import manager
from src.app.core.config import settings
from src.app.utils.gpu_utils import check_gpu
from src.app.api import router
from src.app.core.logger import logging

app = FastAPI(title="ASR Meeting Api")
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)
app.add_middleware(ExceptionHandlingMiddleware)
app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def index():
    return RedirectResponse(url="/docs")


@app.get("/api/v1/ping", tags=["HealthChecks"])
async def ping():
    return "Pong"


@app.websocket("/ws/{record_id}")
async def websocket_task_endpoint(websocket: WebSocket, record_id: str):
    # await websocket.accept()
    # redis = await Redis(
    #     host=settings.REDIS_CACHE_HOST,
    #     port=settings.REDIS_CACHE_PORT,
    #     password=settings.REDIS_CACHE_PASSWORD,
    #     db=0)
    # #channel_name = f"record-{record_id}"
    # channel_name = "task_updates"
    # pubsub = redis.pubsub()
    #
    # await pubsub.subscribe(channel_name)
    # try:
    #     async for message in pubsub.listen():
    #         if message["type"] == "message":
    #             data = json.loads(message["data"])
    #             print(data)
    #             await websocket.send_json(data)
    # except asyncio.CancelledError:
    #     pass
    # finally:
    #     await pubsub.unsubscribe(channel_name)
    #     await pubsub.close()
    #     await redis.close()
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Client says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(record_id, websocket)
        await manager.broadcast(record_id, f"Client left {record_id}")


if __name__ == "__main__":
    logging.info(json.dumps(check_gpu(), indent=4))
    uvicorn.run(app, host="0.0.0.0", port=2025)
