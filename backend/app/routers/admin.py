from fastapi import APIRouter
from starlette.responses import JSONResponse
from app.utils import verify_text, create_access_token
from fastapi import HTTPException, Depends
from app.db import admin_user_collection, user_collection, reports_collection
from models.admin import adminLogin, adminUser
from dependencies.admin import get_current_admin_user
from typing import Annotated
from datetime import datetime, timedelta


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
        token = create_access_token(
            {"username": admin.username, "role": "admin"})

        return JSONResponse(status_code=200, content={"status": True, "access_token": token})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")



@router.get("/getUser")
async def get_admin_user(current_user: Annotated[adminUser, Depends(get_current_admin_user)]):
    return current_user


@router.get("/dashboard/getNumericData")
async def get_numeric_data(current_user: Annotated[adminUser, Depends(get_current_admin_user)]):
    try:
        total_users = await user_collection.count_documents({})
        total_reports = await reports_collection.count_documents({})
        # status 3 denotes cleanup has been completed
        completed_reports = await reports_collection.count_documents({"status": 3})
        pending_reports = total_reports - completed_reports
        return JSONResponse(
            status_code=200,
            content={
                "status": True,
                "data": {
                    "total_users": total_users,
                    "total_reports": total_reports,
                    "completed_reports": completed_reports,
                    "pending_reports": pending_reports
                }
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/dashboard/getPieChartData")
async def get_pieChart_data(currenta_user: Annotated[adminUser, Depends(get_current_admin_user)]):
    try:
        data = []
        pipeline = [
            {
                '$group': {
                    '_id': '$location.state',
                    'count': {'$sum': 1}
                }
            }
        ]
        result = reports_collection.aggregate(pipeline)
        async for doc in result:
            data.append({
                'name': doc['_id'],
                'y': doc['count']
            })
        return JSONResponse(status_code=200, content={"status": True, "data": data})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/dashboard/getStockChartData")
async def get_stockChart_data(currenta_user: Annotated[adminUser, Depends(get_current_admin_user)]):
    try:
        pipeline = [
            {"$group": {
                "_id": None,
                "minDate": {"$min": "$created_at"},
                "maxDate": {"$max": "$created_at"}
            }}
        ]
        min_date = None
        max_date = None
        data = []

        result = reports_collection.aggregate(pipeline)
        async for doc in result:
            min_date = datetime.strptime(doc['minDate'], "%Y-%m-%d %H:%M:%S")
            max_date = datetime.strptime(doc['maxDate'], "%Y-%m-%d %H:%M:%S")
        if (min_date is None or max_date is None):
            # return empty array
            return JSONResponse(status_code=200, content={"status": True, "data": data})

        current_date = min_date
        while (current_date <= max_date):
            start_of_day = current_date.replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            end_of_day = start_of_day + timedelta(days=1)
            count = await reports_collection.count_documents({
                "created_at": {
                    "$gte": start_of_day.strftime("%Y-%m-%d %H:%M:%S"),
                    "$lt": end_of_day.strftime("%Y-%m-%d %H:%M:%S")
                }
            })
            millisec = start_of_day.timestamp() * 1000
            data.append([millisec, count])

            current_date += timedelta(days=1)
        return JSONResponse(status_code=200, content={"status": True, "data": data})

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
