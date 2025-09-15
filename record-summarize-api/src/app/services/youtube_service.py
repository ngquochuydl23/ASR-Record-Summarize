import os
from os.path import exists


class YoutubeService:
    def __init__(self):
        os.makedirs("youtube_downloads", exist_ok=True)
        pass

    def download_youtube_via_link(self, url: str) -> str:
        pass

