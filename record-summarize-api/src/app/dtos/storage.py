class UploadFileResponseDto:
    url: str
    file_name:str
    content_type: str

    def __init__(self, url: str, file_name: str, content_type: str = str) -> None:
        self.url = url
        self.file_name = file_name
        self.content_type = content_type

    def dict(self):
        return {
            "url": self.url,
            "file_name": self.file_name,
            "content_type": self.content_type
        }

