class UploadFileResponseDto:
    url: str
    file_name:str
    content_type: str

    def __init__(self, url: str, filename: str, mime: str, size: int) -> None:
        self.url = url
        self.filename = filename
        self.mime = mime
        self.size = size

    def dict(self):
        return {
            "url": self.url,
            "filename": self.filename,
            "mime": self.mime,
            "size": self.size
        }

