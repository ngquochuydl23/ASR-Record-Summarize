import asyncio
import os

from src.app.core.config import settings
from src.app.services.s3_service import S3Service


async def get_object(key):
    s3_service = S3Service()
    print('Downloading')
    bytes = await s3_service.read_s3_file_as_bytes(key)
    print('Downloaded')
if __name__ == "__main__":
    asyncio.run(get_object("uploads/8a668f6f-c551-4058-b578-0a46788b108f.pdf"))