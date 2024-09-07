from fastapi import FastAPI, UploadFile
from services import Services
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
services = Services()

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return services.predict_number(services.random_image())


@app.post("/file-upload")
async def upload_file(file: UploadFile):
    response = await services.predict_user_number(file)
    # print(response)
    return response
