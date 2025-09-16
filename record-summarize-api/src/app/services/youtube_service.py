import os
import shutil
import asyncio
from urllib.parse import urlparse, parse_qs

YOUTUBE_DOWNLOADS = "youtube_downloads"

class YoutubeService:
    def __init__(self):
        os.makedirs(YOUTUBE_DOWNLOADS, exist_ok=True)

    async def download_youtube_via_link(self, youtube_url: str) -> str | None:
        youtube_id = self._get_youtube_id(youtube_url)
        output_path = os.path.join(YOUTUBE_DOWNLOADS, f"youtube-{youtube_id}.%(ext)s")
        cmd = [
            "yt-dlp",
            "-f", "worst[ext=mp4]",
            "--quiet",
            "--ffmpeg-location", shutil.which("ffmpeg"),
            "--no-warnings",
            "-o", output_path,
            youtube_url,
        ]
        try:
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await process.communicate()

            if process.returncode == 0:
                return f"{YOUTUBE_DOWNLOADS}/youtube-{youtube_id}.mp4"
            else:
                print(f"[ERROR] Failed to download {youtube_url}: {stderr.decode()}")
                return None
        except Exception as e:
            print(f"[EXCEPTION] {e}")
            return None

    def _get_youtube_id(self, url: str) -> str | None:
        parsed = urlparse(url)
        if parsed.hostname == "youtu.be":
            return parsed.path.lstrip("/")
        if parsed.hostname in ["www.youtube.com", "youtube.com", "m.youtube.com"]:
            qs = parse_qs(parsed.query)
            return qs.get("v", [None])[0]
        return None
