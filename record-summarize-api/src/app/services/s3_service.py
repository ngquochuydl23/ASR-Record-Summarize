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


class S3Service:
    def __init__(self):
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.S3_REGION_NAME
        )
        os.makedirs("./uploads", exist_ok=True)

    async def upload_file(self, file: UploadFile, local_cache=True) -> UploadFileResponseDto:
        content = await file.read()
        content_type = file.content_type
        extension = file.filename.split('.')[1]
        name = file.filename
        key = f"uploads/{uuid.uuid4()}.{extension}"

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
        return UploadFileResponseDto(url=key, file_name=f"{name}", content_type=content_type)

    async def upload_multi_files(self, files: List[UploadFile], local_cache: bool = True) -> List[Union[UploadFileResponseDto, Exception]]:
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
