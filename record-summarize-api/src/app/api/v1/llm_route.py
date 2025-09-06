from fastapi import APIRouter
from ...dtos.llm import RequestLLMBody, RequestGenereteEmbeddingText
from ...services.llm_service import LLMService
import asyncio

router = APIRouter(tags=["LLM"])
llm_service = LLMService()

@router.post("/gemini-text-generate", response_model=dict, status_code=200)
async def gemini_text_generate(body: RequestLLMBody):
    result = llm_service.generate_text_gemini(body.prompt)
    return {
        "result": result
    }

@router.post("/embedding_text", response_model=dict, status_code=200)
async def gemini_text_generate(body: RequestGenereteEmbeddingText):
    result = llm_service.embedding_text(body.text)
    return {
        "result": result
    }
