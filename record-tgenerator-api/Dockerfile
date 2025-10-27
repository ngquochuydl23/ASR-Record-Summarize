#FROM tensorflow/build:2.13-python3.11
#FROM python:3.11-slim-buster
#FROM nvcr.io/nvidia/cuda:12.3.1-cudnn8-runtime-ubuntu22.04
FROM nvidia/cuda:12.8.0-runtime-ubuntu22.04
FROM tensorflow/tensorflow:latest-gpu

WORKDIR /
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/

RUN apt-get update && apt-get install -y \
    python3.11 \
    python3.11-dev \
    python3-pip \
    build-essential \
    libpq-dev \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

#RUN apt install nvidia-cuda-toolkit
#RUN apt install libcudnn9-cuda-12

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD "nvidia-smi"
CMD ["python3", "./src/app/app.py"]
