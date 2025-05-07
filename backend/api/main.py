from fastapi import FastAPI
from api.routes import auth, modelCall
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("URL_DEV")],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
app.include_router(auth.router, prefix="/auth")
app.include_router(modelCall.router, prefix="/modelCall")