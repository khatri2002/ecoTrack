from fastapi import APIRouter, HTTPException
from starlette.responses import JSONResponse
from datetime import datetime

from app.models import SignUpRequestOTP, SignUpVerifyOTP, SignInPassword, SignInRequestOTP, SignInVerifyOTP
from app.utils import generate_otp, get_text_hash, verify_text, create_access_token
from app.db import user_collection, otp_collection

router = APIRouter()

@router.post("/signUp/requestOTP")
async def request_otp(user: SignUpRequestOTP):
    # check if email or phone already exists
    try:
        existing_user = await user_collection.find_one({"$or": [{"email": user.email}, {"phone": user.phone}]})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if(existing_user):
        raise HTTPException(status_code=400, detail="User already exists")
    
    # check last OTP sent time
    otp_doc = await otp_collection.find_one({"email": user.email})
    if otp_doc:
        created_at = datetime.strptime(otp_doc["created_at"], "%Y-%m-%d %H:%M:%S")
        if (datetime.now() - created_at).seconds < 60:
            raise HTTPException(status_code=400, detail="Please wait for 1 minute before requesting another OTP")

    # generate OTP
    otp = generate_otp()
    otp_hash = get_text_hash(otp)
    
    # save OTP
    otp_doc = {
        "email": user.email,
        "otp": otp_hash,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    try:
        await otp_collection.update_one({"email": user.email}, {"$set": otp_doc}, upsert=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
    # send OTP
    print(otp)
    # response = await send_mail(user.email, user.first_name, otp)
    # if not response:
    #     raise HTTPException(status_code=500, detail="Internal server error")

    return JSONResponse(status_code=200, content={"status": True})

@router.post("/signUp/verifyOTP")
async def verify_otp(user: SignUpVerifyOTP):

    # check if email exists
    try:
        otp_doc = await otp_collection.find_one({"email": user.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if not otp_doc:
        raise HTTPException(status_code=400, detail="invalid credentials")
    
    # check OTP expiry
    created_at = datetime.strptime(otp_doc["created_at"], "%Y-%m-%d %H:%M:%S")
    if (datetime.now() - created_at).seconds > 30:
        raise HTTPException(status_code=400, detail="invalid credentials")

    # verify OTP
    if not verify_text(user.otp, otp_doc["otp"]):
        raise HTTPException(status_code=400, detail="invalid credentials")
    
    # delete OTP
    try:
        await otp_collection.delete_one({"email":user.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
    # hash password and save user
    user.password = get_text_hash(user.password)
    user_doc = {
        "name": user.full_name(),
        "email": user.email,
        "phone": user.phone,
        "password": user.password
    }
    try:
        await user_collection.insert_one(user_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    # create access token
    access_token = create_access_token({"email": user.email})

    return JSONResponse(status_code=200, content={"access_token": access_token})

@router.post("/signIn/password")
async def sign_in_password(user: SignInPassword):
    
    # check if email exists
    try:
        user_doc = await user_collection.find_one({"email": user.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if not user_doc:
        raise HTTPException(status_code=400, detail="invalid credentials")
    
    # verify password
    if not verify_text(user.password, user_doc["password"]):
        raise HTTPException(status_code=400, detail="invalid credentials")
    
    # create access token
    access_token = create_access_token({"email": user.email})

    return JSONResponse(status_code=200, content={"access_token": access_token})

@router.post("/signIn/requestOTP")
async def request_otp(user: SignInRequestOTP):
    
    # check if email exists
    try:
        user_doc = await user_collection.find_one({"email": user.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if not user_doc:
        raise HTTPException(status_code=400, detail="invalid credentials")
    
    # check last OTP sent time
    otp_doc = await otp_collection.find_one({"email": user.email})
    if otp_doc:
        created_at = datetime.strptime(otp_doc["created_at"], "%Y-%m-%d %H:%M:%S")
        if (datetime.now() - created_at).seconds < 60:
            raise HTTPException(status_code=400, detail="Please wait for 1 minute before requesting another OTP")

    # generate OTP
    otp = generate_otp()
    otp_hash = get_text_hash(otp)
    
    # save OTP
    otp_doc = {
        "email": user.email,
        "otp": otp_hash,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    try:
        await otp_collection.update_one({"email": user.email}, {"$set": otp_doc}, upsert=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
    # send OTP
    print(otp)
    # response = await send_mail(user.email, user.first_name, otp)
    # if not response:
    #     raise HTTPException(status_code=500, detail="Internal server error")

    return JSONResponse(status_code=200, content={"status": True})

@router.post("/signIn/verifyOTP")
async def verify_otp(user: SignInVerifyOTP):

    # check if email exists
    try:
        otp_doc = await otp_collection.find_one({"email": user.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if not otp_doc:
        raise HTTPException(status_code=400, detail="invalid credentials")
    
    # check OTP expiry
    created_at = datetime.strptime(otp_doc["created_at"], "%Y-%m-%d %H:%M:%S")
    if (datetime.now() - created_at).seconds > 30:
        raise HTTPException(status_code=400, detail="invalid credentials")

    # verify OTP
    if not verify_text(user.otp, otp_doc["otp"]):
        raise HTTPException(status_code=400, detail="invalid credentials")
    
    # delete OTP
    try:
        await otp_collection.delete_one({"email":user.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
    # create access token
    access_token = create_access_token({"email": user.email})

    return JSONResponse(status_code=200, content={"access_token": access_token})