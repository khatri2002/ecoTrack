import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client.get_database("ecoTrack")

user_collection = db.get_collection("users")
otp_collection = db.get_collection("otp")
index_collection = db.get_collection("index")
reports_collection = db.get_collection("reports")
statuses_collection = db.get_collection("statuses")