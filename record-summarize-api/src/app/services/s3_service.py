from ..core.config import settings
import boto3
import uuid
from botocore.exceptions import BotoCoreError, NoCredentialsError
from fastcrud.exceptions.http_exceptions import BadRequestException
from fastapi import UploadFile
from typing import List, Union
from ..dtos.storage import UploadFileResponseDto
import asyncio
import os
import mimetypes


class S3Service:
    def __init__(self):
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.S3_REGION_NAME
        )
        os.makedirs("./uploads", exist_ok=True)

    async def upload_file(self, file: UploadFile, folder='uploads', local_cache=True) -> UploadFileResponseDto:
        content = await file.read()
        content_type = file.content_type if file.content_type != "text/vtt" else "text/vtt; charset=utf-8"
        size = file.size
        extension = file.filename.split('.')[1]
        name = file.filename
        key = f"{folder}/{uuid.uuid4()}.{extension}"

        if len(content) > settings.MAX_FILE_SIZE_BYTES:
            raise BadRequestException(f"File size exceeds {settings.MAX_FILE_SIZE_MB}MB limit.")
        try:
            if local_cache:
                with open(key, "wb") as file:
                    file.write(content)
            self.s3.put_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=key,
                Body=content,
                ContentType=content_type,
                ACL="public-read"
            )
        except (BotoCoreError, NoCredentialsError) as e:
            raise BadRequestException(f"S3 upload failed: {str(e)}")
        return UploadFileResponseDto(url=key, filename=f"{name}", mime=content_type, size=size)

    async def upload_file_from_path(self, file_path: str, folder='uploads') -> UploadFileResponseDto:
        if not os.path.exists(file_path):
            raise BadRequestException(f"File {file_path} does not exist")

        size = os.path.getsize(file_path)
        name = os.path.basename(file_path)
        extension = name.split(".")[-1]
        key = f"{folder}/{uuid.uuid4()}.{extension}"

        if size > settings.MAX_FILE_SIZE_BYTES:
            raise BadRequestException(f"File size exceeds {settings.MAX_FILE_SIZE_MB}MB limit.")

        content_type, _ = mimetypes.guess_type(file_path)
        if content_type == "text/vtt":
            content_type = "text/vtt; charset=utf-8"
        if content_type is None:
            content_type = "application/octet-stream"

        try:
            with open(file_path, "rb") as f:
                self.s3.put_object(
                    Bucket=settings.S3_BUCKET_NAME,
                    Key=key,
                    Body=f,
                    ContentType=content_type,
                    ACL="public-read"
                )
        except (BotoCoreError, NoCredentialsError) as e:
            raise BadRequestException(f"S3 upload failed: {str(e)}")

        return UploadFileResponseDto(
            url=key,
            filename=name,
            mime=content_type,
            size=size,
        )

    async def upload_multi_files(self, files: List[UploadFile], local_cache: bool = True) -> List[
        Union[UploadFileResponseDto, Exception]]:
        if not files:
            return []

        tasks = [self.upload_file(file, local_cache) for file in files]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        response = []
        for result in results:
            if isinstance(result, Exception):
                response.append(result)
            else:
                response.append(result)
        return response
