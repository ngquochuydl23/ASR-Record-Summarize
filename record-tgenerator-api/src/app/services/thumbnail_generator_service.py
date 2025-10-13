import yaml
import asyncio
import logging
from src.app.services.data_preprocessor import DataPreprocessor
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Dropout
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras import optimizers
from tensorflow.keras.applications.inception_v3 import InceptionV3, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from sklearn.cluster import DBSCAN
from PIL import Image, ImageFile
import subprocess
import uuid
ImageFile.LOAD_TRUNCATED_IMAGES = True

logger = logging.getLogger(__name__)


class ThumbnailGeneratorService:
    def __init__(self, eps, fps, metric, checkpoint_path='src/models/cp-00030.keras'):
        self.data_preprocessor = DataPreprocessor()
        self.eps = eps
        self.fps = fps
        self.metric = metric
        self.aesthetic_model = load_model(checkpoint_path)

    def _extract_frames(self, video_path):
        unique_id = str(uuid.uuid4())
        frames_dir = os.path.join('.', f'temp-frames-{unique_id}')
        os.makedirs(frames_dir, exist_ok=True)

        output_pattern = f"{frames_dir}/frame_%04d.jpg"
        command = [
            "ffmpeg",
            "-ss", "0",
            "-t", "20",
            "-i", video_path,
            "-loglevel", "error",
            "-vf", "fps=1,scale=640:360",
            output_pattern
        ]
        subprocess.run(command)
        return frames_dir

    def _get_cluster(self, frame_dir, eps, min_samples, metric):
        features = self.data_preprocessor.extract_feature_with_dir(frame_dir)
        clustering = DBSCAN(eps=eps, min_samples=min_samples, metric=metric)
        labels = clustering.fit_predict(features)

        num_clusters = len(set(labels)) - (1 if -1 in labels else 0)
        frame_files = sorted([os.path.join(frame_dir, f) for f in os.listdir(frame_dir) if f.endswith(".jpg")])
        clustered_frames = {}
        for f, label in zip(frame_files, labels):
            clustered_frames.setdefault(label, []).append(f)

        return clustered_frames.items()

    def _select_representative_from_clusters(self, clusters, output_dir="thumbnails"):
        os.makedirs(output_dir, exist_ok=True)
        thumbnails = []

        for label, frames in clusters:
            if label == -1 or len(frames) == 0:
                continue
            features_cluster = np.array(
                [self.data_preprocessor.extract_feature(f, verbose=0) for f in frames],
                dtype=np.float32
            )
            centroid = np.mean(features_cluster, axis=0)
            dists = np.linalg.norm(features_cluster - centroid, axis=1)
            rep_idx = np.argmin(dists)
            rep_frame = frames[rep_idx]
            thumbnails.append(rep_frame)
        return thumbnails

    def _select_thumbnails_by_model(self, thumbnails, output_dir="thumbnails"):
        os.makedirs(output_dir, exist_ok=True)
        scores = []
        for thumbnail in thumbnails:
            feature = self.data_preprocessor.extract_feature(thumbnail, verbose=0)
            score = self.aesthetic_model.predict(np.expand_dims(feature, axis=0), verbose=0)
            scores.append(score)

        best_idx_in_cluster = int(np.argmax(scores))
        best_thumbnail_path = thumbnails[best_idx_in_cluster]
        return {
            "best_thumbnail": best_thumbnail_path,
            "score": float(scores[best_idx_in_cluster]),
            "all_scores": scores,
            "all_thumbnails": thumbnails,
        }

    def generate_thumbnail(self, video_path):
        frames_dir = self._extract_frames(video_path)
        clusters = self._get_cluster(frames_dir, self.eps, self.fps, self.metric)
        thumbnails = self._select_representative_from_clusters(clusters)
        result = self._select_thumbnails_by_model(thumbnails)
        return result
