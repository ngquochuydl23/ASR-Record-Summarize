import tensorflow as tf
import logging

def check_gpu():
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        for gpu in gpus:
            logging.info(gpu)
    else:
        logging.warning("No GPU found")