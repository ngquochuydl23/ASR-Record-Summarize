from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.app.core.logger import logging
from src.app.models import RecordModel, RagDocumentModel, RagChunkModel
from src.app.models.rag_document import RAGSourceTypeEnum
from src.app.services.llm_service import LLMService
from src.app.utils.chunk_text import chunk_text
from src.app.utils.extract_text_from_file import extract_text, extract_text_from_bytes
from .s3_service import S3Service
from ..core.db.database import async_get_db
from sqlalchemy import select
import uuid
import asyncio
import os

from ..models.records import RecordChatbotPreparationState


class RagIndexService:
    def __init__(self):
        self.llm_service = LLMService()
        self.s3_service = S3Service()

    async def execute_rag_index(self, db: Annotated[AsyncSession, Depends(async_get_db)], record: RecordModel):
        logging.info("RagIndexService - Downloading subtitle from S3")
        subtitle_vtt_key = record.pipeline_items[1].extra.get("subtitle_s3_key")
        content = await self.s3_service.read_s3_file(subtitle_vtt_key)
        embeddings = []
        chunks = chunk_text(content, chunk_size=500)
        for chunk in chunks:
            embedding = await asyncio.to_thread(self.llm_service.embedding_text, chunk)
            embeddings.append(embedding)

        record.rag_documents.append(RagDocumentModel(
            id=uuid.uuid4(),
            source_type=RAGSourceTypeEnum.TRANSCRIPT,
            record_id=record.id,
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
            bytes = await self.s3_service.read_s3_file_as_bytes(attachment.url)
            ext = os.path.splitext(attachment.url)[1].lower()
            content = extract_text_from_bytes(bytes, ext)
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
        record.chatbot_preparation_state = RecordChatbotPreparationState.DONE
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
