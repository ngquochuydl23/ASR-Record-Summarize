from pydantic import BaseModel, ConfigDict

class RequestLLMBody(BaseModel):
    prompt: str

class RequestGenereteEmbeddingText(BaseModel):
    text: str

class RequestRAGSearch(BaseModel):
    text: str
    threshold: float
    top_k: int


class SummarizeRecord(BaseModel):
    text: str