from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, record_id: str, websocket: WebSocket):
        await websocket.accept()
        if record_id not in self.active_connections:
            self.active_connections[record_id] = []
        self.active_connections[record_id].append(websocket)

    def disconnect(self, record_id: str, websocket: WebSocket):
        if record_id in self.active_connections:
            self.active_connections[record_id].remove(websocket)
            if not self.active_connections[record_id]:
                del self.active_connections[record_id]

    async def broadcast(self, record_id: str, message: dict):
        if record_id in self.active_connections:
            for connection in self.active_connections[record_id]:
                await connection.send_json(message)

manager = ConnectionManager()
