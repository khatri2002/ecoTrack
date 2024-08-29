import pyotp
import bcrypt
import jwt
from dotenv import load_dotenv
import os
from datetime import datetime
from .db import statuses_collection
from fastapi import HTTPException

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

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
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload

def format_date(date: str):
    date_time_obj = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
    formatted_date = date_time_obj.strftime("%b %d, %Y")
    return formatted_date

async def get_status(status: int):
    try:
        status_doc = await statuses_collection.find_one({"index": status})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    if not status_doc:
        raise HTTPException(status_code=404, detail="Status not found")
    return {
        "index": status_doc["index"],
        "status": status_doc["status"],
        "description": status_doc["description"]
    }


async def get_cleanup_completed_index():
        try:
            status_doc = await statuses_collection.find_one(sort=[("index", -1)])
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal Server Error")
        if not status_doc:
            raise HTTPException(status_code=404, detail="Status not found")
        return status_doc["index"]