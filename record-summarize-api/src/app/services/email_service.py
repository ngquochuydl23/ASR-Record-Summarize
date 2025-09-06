from ..core.config import settings
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pathlib import Path

class EmailService:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_FROM=settings.MAIL_FROM,
            MAIL_USERNAME=settings.MAIL_USERNAME,
            MAIL_PASSWORD=settings.MAIL_PASSWORD,
            MAIL_PORT=settings.MAIL_PORT,
            MAIL_SERVER=settings.MAIL_SERVER,
            MAIL_SSL_TLS =settings.MAIL_SSL_TLS,
            MAIL_STARTTLS = settings.MAIL_STARTTLS,
            USE_CREDENTIALS=True,
            TEMPLATE_FOLDER=Path(__file__).resolve().parent.parent / "templates" / "emails",
        )
        self.fm = FastMail(self.conf)

    async def send_email(self, email: str):
        template_data = {"username": "Nguyễn Quốc Huy"}
        message = MessageSchema(
            subject="Meeting Invitation",
            recipients=[email],
            template_body=template_data,
            subtype=MessageType.html
        )
        await self.fm.send_message(message, template_name="invite.html")