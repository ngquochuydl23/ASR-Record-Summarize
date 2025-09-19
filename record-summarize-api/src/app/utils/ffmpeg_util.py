import subprocess
from ..core.logger import logging
def check_ffmpeg():
    try:
        result = subprocess.run(
            ["ffmpeg", "-version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        if result.returncode == 0:
            logging.info(f"FFmpeg is installed - " + result.stdout.split("\n")[0])
        else:
            print("⚠️ FFmpeg not found")
            logging.warning("FFmpeg not found")
    except FileNotFoundError:
        logging.error("❌ FFmpeg is not installed on this system")
