import pyotp
import bcrypt
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

def generate_otp():
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret, digits=4)
    return totp.now()

def get_text_hash(text: str):
    text_bytes = text.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_text = bcrypt.hashpw(password=text_bytes, salt=salt)
    return hashed_text

def verify_text(plain_text: str, hashed_text: str):
    text_byte_enc = plain_text.encode('utf-8')
    return bcrypt.checkpw(password = text_byte_enc , hashed_password = hashed_text)

def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt