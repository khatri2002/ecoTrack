from fastapi_mail import MessageSchema, MessageType, FastMail, ConnectionConfig
import os
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_FROM_NAME="ecoTrack",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True,
    TEMPLATE_FOLDER="./app/mail/templates"
)

async def send_mail(email, first_name, otp):
    message = MessageSchema(
        subject="Fastapi-Mail module",
        recipients=[email],
        template_body={
            "first_name": first_name,
            "otp": otp
        },
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message, template_name="mail_template.html")
    except Exception as e:
        print(e)
        return False
    return True