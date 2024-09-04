from fastapi import APIRouter
from starlette.responses import JSONResponse
from app.utils import verify_text, create_access_token
from fastapi import HTTPException, Depends
from app.db import admin_user_collection
from models.admin import adminLogin, adminUser
from dependencies.admin import get_current_admin_user
from typing import Annotated


router = APIRouter()

@router.post("/login")
async def admin_login(admin: adminLogin):
    invalid_credentials_response = JSONResponse(status_code=400, content={
        "status": False,
        "type": "invalid_entry",
        "message": "Invalid username or password"
    })

    try:

        # check if the admin exists
        admin_doc = await admin_user_collection.find_one({"username": admin.username})
        if not admin_doc:
            return invalid_credentials_response

        # check if the password is correct
        if not verify_text(admin.password, admin_doc["password"]):
            return invalid_credentials_response
        
        # create a jwt token
        token = create_access_token({"username": admin.username, "role": "admin"})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
    return JSONResponse(status_code=200, content={"status": True, "access_token": token})


@router.get("/getUser")
async def get_admin_user(current_user: Annotated[adminUser, Depends(get_current_admin_user)]):
    return current_user