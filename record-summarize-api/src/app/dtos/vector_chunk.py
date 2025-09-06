from pydantic import BaseModel
import uuid

class VectorChunkDto(BaseModel):
    id: uuid.UUID
    content: str
    embedding: list[float]
    additional_data: dict
    score: int