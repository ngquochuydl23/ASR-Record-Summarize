from fastapi import APIRouter, UploadFile, File
from ...services.s3_service import S3Service
from typing import List
router = APIRouter(tags=["Uploading"])
s3_service = S3Service()


@router.post("/upload", response_model=dict, status_code=200)
async def upload_file(file: UploadFile = File(...)):
    return (await s3_service.upload_file(file)).dict()


@router.post("/upload-multi-files", response_model=dict, status_code=200)
async def upload_multi_files(files: List[UploadFile] = File(...)):
    return await s3_service.upload_multi_files(files)