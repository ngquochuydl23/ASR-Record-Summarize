from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.app.models import RecordModel, RagDocumentModel, RagChunkModel
from src.app.models.rag_document import RAGSourceTypeEnum
from src.app.services.llm_service import LLMService
from src.app.utils.chunk_text import chunk_text
from src.app.utils.extract_text_from_file import extract_text
from ..core.db.database import async_get_db
from sqlalchemy import select
import uuid
import asyncio


class RagIndexService:
    def __init__(self):
        self.llm_service = LLMService()

    async def execute_rag_index(self, db: Annotated[AsyncSession, Depends(async_get_db)], record: RecordModel):
        previous_step_result = record.pipeline_items[1]
        if previous_step_result:
            transcribe_output = previous_step_result.extra.get("transcribe_result", {}).get("output_path")
            with open(transcribe_output, "r", encoding="utf-8") as f:
                content = f.read()
            content = content.replace(b"\x00", b"").decode("utf-8", errors="ignore")
            chunks = chunk_text(content, chunk_size=500)
            embeddings = []
            for chunk in chunks:
                embedding = await asyncio.to_thread(self.llm_service.embedding_text, chunk)
                embeddings.append(embedding)

            record.rag_documents.append(RagDocumentModel(
                id=uuid.uuid4(),
                source_type=RAGSourceTypeEnum.TRANSCRIPT,
                record_id=record.id,
                attachment_id=None,
                chunks=[
                    RagChunkModel(
                        id=uuid.uuid4(),
                        content=chunk,
                        embedding=embedding,
                        additional_data={},
                        chunk_index=idx
                    )
                    for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings))
                ]
            ))

        for attachment in record.attachments:
            if attachment.is_rag:
                continue
            attachment.is_rag = True
            content = extract_text(attachment.url)
            if not content:
                continue

            chunks = chunk_text(content, chunk_size=500)
            embeddings = []
            for chunk in chunks:
                embedding = await asyncio.to_thread(self.llm_service.embedding_text, chunk)
                embeddings.append(embedding)

            record.rag_documents.append(RagDocumentModel(
                id=uuid.uuid4(),
                source_type=RAGSourceTypeEnum.ATTACHMENT,
                record_id=record.id,
                attachment_id=attachment.id,
                chunks=[
                    RagChunkModel(
                        id=uuid.uuid4(),
                        content=chunk,
                        embedding=embedding,
                        additional_data={},
                        chunk_index=idx
                    )
                    for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings))
                ]
            ))
        db.add(record)
        await db.commit()
        await db.refresh(record)


    async def search_similar_chunks(
            self,
            db: Annotated[AsyncSession, Depends(async_get_db)],
            text: str,
            record_id: uuid.UUID,
            top_k: int = 5,
            threshold: float = 0.3):

        query_embedding = self.llm_service.embedding_text(text)
        distance = RagChunkModel.embedding.cosine_distance(query_embedding)
        similarity = (1 - distance).label("similarity")

        stmt = (
            select(RagChunkModel, similarity)
            .join(RagChunkModel.document)
            .where(RagDocumentModel.record_id == str(record_id))
            .where(similarity >= threshold)
            .order_by(similarity.desc())
            .limit(top_k)
        )

        result = await db.execute(stmt)
        rows = result.all()
        data = []
        for chunk, score in rows:
            data.append({
                "content": chunk.content,
                "additional_data": chunk.additional_data,
                "document_id": str(chunk.document_id),
                "score": float(score),
            })
        return data

    async def get_all_chunks(self, db: Annotated[AsyncSession, Depends(async_get_db)], record_id: uuid.UUID):
        stmt = (
            select(RagChunkModel)
            .join(RagChunkModel.document)
            .where(RagDocumentModel.record_id == str(record_id))
        )

        result = await db.execute(stmt)
        return result.scalars().all()
