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
from tqdm import tqdm
from PIL import Image, ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True


class DataPreprocessor:
    def __init__(self):
        self.model = InceptionV3(weights='imagenet', include_top=False, pooling='avg')

    def get_model(self):
        return self.model

    def extract_feature(self, path, target_size=(299, 299), verbose=1):
        img = Image.open(path).convert("RGB")
        img = img.resize(target_size)
        X = image.img_to_array(img)
        X = np.expand_dims(X, axis=0)
        X = preprocess_input(X)

        features = self.model.predict(X, verbose=verbose)
        return features.flatten()

    def extract_feature_with_dir(self, dir_path, target_size=(299, 299)):
        features_list = []
        image_paths = [os.path.join(dir_path, f) for f in os.listdir(dir_path)
                       if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

        for path in tqdm(image_paths, desc="Extracting features", colour="#41AB5D"):
            features = self.extract_feature(path, target_size, verbose=0)
            features_list.append(features)
        return features_list