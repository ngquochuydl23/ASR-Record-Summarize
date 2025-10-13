class AppException(Exception):
    def __init__(self, message):
        self.message = message
        self.status_code = 400
        super().__init__(self.message)


    def __str__(self):
        return f"[Status_code {self.status_code}]: {self.message}"
