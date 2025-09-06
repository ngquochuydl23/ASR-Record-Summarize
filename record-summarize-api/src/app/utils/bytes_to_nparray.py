import numpy as np
import io
from PIL import Image

async def convert_file_to_nparray(file):
    _bytes = await file.read()
    return np.array(Image.open(io.BytesIO(_bytes)).convert("RGB"))