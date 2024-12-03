from fastapi import FastAPI, UploadFile
from services import Services
from fastapi.middleware.cors import CORSMiddleware
import fastapi
import os

app = FastAPI()
services = Services()

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("FRONTEND_URL"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"frontend_url": os.environ.get("FRONTEND_URL")}


@app.post("/file-upload")
async def upload_file(file: UploadFile):
    response = await services.predict_user_number(file)
    # print(response)
    return response
