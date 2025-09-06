FROM pytorch/pytorch:2.7.1-cuda12.6-cudnn9-runtime AS build
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HF_HOME=./cache/ \
    TORCH_HOME=/tmp/torch \
    PYTHONPATH=/

WORKDIR /
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install psycopg2

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["python", "./src/app/app.py"]

