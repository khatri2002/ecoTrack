from app.dependencies import get_current_user
from app.db import user_collection, otp_collection, index_collection, reports_collection
from app.utils import generate_otp, get_text_hash, verify_text, create_access_token
from app.models import SignUpRequestOTP, SignUpVerifyOTP, SignInPassword, SignInRequestOTP, SignInVerifyOTP, User, ReportRequestData
from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form
from typing import Annotated
from starlette.responses import JSONResponse
from datetime import datetime
import os
from dotenv import load_dotenv
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
import json

load_dotenv()


router = APIRouter()


@router.post("/signUp/requestOTP")
async def request_otp(user: SignUpRequestOTP):
    # check if email or phone already exists
    try:
        existing_user = await user_collection.find_one({"$or": [{"email": user.email}, {"phone": user.phone}]})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if (existing_user):
        return JSONResponse(status_code=400, content={
            "status": False,
            "type": "user_exists",
            "title": "User already exists",
            "message": "User with this email or phone already exists"
        }
        )

    # check last OTP sent time
    otp_doc = await otp_collection.find_one({"email": user.email})
    if otp_doc:
        created_at = datetime.strptime(
            otp_doc["created_at"], "%Y-%m-%d %H:%M:%S")
        if (datetime.now() - created_at).seconds < 60:
            return JSONResponse(status_code=400, content={
                "status": False,
                "type": "otp_wait",
                "title": "Too many requests",
                "message": "Please wait for 1 minute before requesting another OTP"
            }
            )

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
        return JSONResponse(status_code=400, content={
            "status": False,
            "type": "invalid_credentials",
            "title": "Invalid OTP",
            "message": "Please enter a valid OTP"
        }
        )

    # check OTP expiry
    created_at = datetime.strptime(otp_doc["created_at"], "%Y-%m-%d %H:%M:%S")
    if (datetime.now() - created_at).seconds > 30:
        return JSONResponse(status_code=400, content={
            "status": False,
            "type": "invalid_credentials",
            "title": "OTP expired",
            "message": "Please request a new OTP"
        }
        )

    # verify OTP
    if not verify_text(user.otp, otp_doc["otp"]):
        return JSONResponse(status_code=400, content={
            "status": False,
            "type": "invalid_credentials",
            "title": "Invalid OTP",
            "message": "Please enter a valid OTP"
        }
        )

    # delete OTP
    try:
        await otp_collection.delete_one({"email": user.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    # get user index
    try:
        index_doc = await index_collection.find_one({"name": "user"})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if not index_doc:
        raise HTTPException(status_code=500, detail="Internal server error")
    user_index = index_doc["index"]

    # hash password and save user
    user.password = get_text_hash(user.password)
    user_doc = {
        "id": user_index,
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

    # update user index
    try:
        await index_collection.update_one({"name": "user"}, {"$inc": {"index": 1}})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    return JSONResponse(status_code=200, content={"status": True, "access_token": access_token})


@router.post("/signIn/password")
async def sign_in_password(user: SignInPassword):

    # check if email exists
    try:
        user_doc = await user_collection.find_one({"email": user.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if not user_doc:
        return JSONResponse(status_code=400, content={
            "status": False,
            "type": "invalid_credentials",
            "title": "Invalid credentials",
            "message": "Please enter a valid email or password"
        }
        )

    # verify password
    if not verify_text(user.password, user_doc["password"]):
        return JSONResponse(status_code=400, content={
            "status": False,
            "type": "invalid_credentials",
            "title": "Invalid credentials",
            "message": "Please enter a valid email or password"
        }
        )

    # create access token
    access_token = create_access_token({"email": user.email})

    return JSONResponse(status_code=200, content={"status": True, "access_token": access_token})


@router.post("/signIn/requestOTP")
async def request_otp(user: SignInRequestOTP):

    # check if email exists
    try:
        user_doc = await user_collection.find_one({"email": user.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if not user_doc:
        return JSONResponse(status_code=400, content={
            "status": False,
            "type": "invalid_credential",
            "title": "Invalid email",
            "message": "This email is not registered"
        }
        )

    # check last OTP sent time
    otp_doc = await otp_collection.find_one({"email": user.email})
    if otp_doc:
        created_at = datetime.strptime(
            otp_doc["created_at"], "%Y-%m-%d %H:%M:%S")
        if (datetime.now() - created_at).seconds < 60:
            return JSONResponse(status_code=400, content={
                "status": False,
                "type": "otp_wait",
                "title": "Too many requests",
                "message": "Please wait for 1 minute before requesting another OTP"
            }
            )

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
        await otp_collection.delete_one({"email": user.email})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    # create access token
    access_token = create_access_token({"email": user.email})

    return JSONResponse(status_code=200, content={"status": True, "access_token": access_token})


@router.get("/getUser")
async def get_user(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user


# @router.get("/test/getPresignedUrl")
# async def get_presigned_url():
#     session = boto3.Session(
#         
#     )
#     s3 = session.client('s3', config=boto3.session.Config(
#         signature_version='s3v4'), endpoint_url="https://s3.eu-north-1.amazonaws.com")
#     try:
#         response = s3.generate_presigned_url(
#             'get_object',
#             Params={
#                 'Bucket': 'eco-track',
#                 'Key': 'B7ADEB21-E942-4783-80EF-06F043584E2A.jpg'
#             },
#             ExpiresIn=10000
#         )
#     except Exception as e:
#         print(e)
#         raise HTTPException(status_code=500, detail="Internal server error")
#     print(response)
#     return {"status": True, "url": response}

@router.post("/report/submit")
async def submit_report(current_user: Annotated[User, Depends(get_current_user)], data: Annotated[str, Form()], photos: Annotated[list[UploadFile], Form()], video: Annotated[UploadFile, Form()]):
    # validate data
    data = json.loads(data)
    try:
        request_data = ReportRequestData(**data)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid request data")

    # get report index
    try:
        index_doc = await index_collection.find_one({"name": "report"})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    if not index_doc:
        raise HTTPException(status_code=500, detail="Internal server error")
    report_index = index_doc["index"]

    # upload photos
    photos_name = []
    session = boto3.Session(
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name="eu-north-1"
    )
    s3 = session.resource(
        's3', config=boto3.session.Config(signature_version='s3v4'))
    for photo in photos:
        if photo.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Invalid file type")
        try:
            s3.meta.client.upload_fileobj(
                photo.file, "eco-track", f"reports/{report_index}/{photo.filename}")
            photos_name.append(photo.filename)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail="Internal server error")

    # upload video
    if video.content_type not in ["video/mp4"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    try:
        s3.meta.client.upload_fileobj(
            video.file, "eco-track", f"reports/{report_index}/{video.filename}")
        video = video.filename
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    # save report
    report_doc = {
        "id": report_index,
        "user_id": current_user.get("id"),
        "title": request_data.title,
        "description": request_data.description,
        "location": request_data.location.model_dump(),
        "photos": photos_name,
        "video": video
    }
    try:
        await reports_collection.insert_one(report_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    # update report index
    try:
        await index_collection.update_one({"name": "report"}, {"$inc": {"index": 1}})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

    return JSONResponse(status_code=200, content={"status": True})
