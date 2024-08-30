from fastapi import FastAPI
from services import Services

app = FastAPI()
services = Services()


@app.get("/testing")
def root():
    return services.predict_number(services.random_image())
