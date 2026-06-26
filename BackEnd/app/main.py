from fastapi import FastAPI

from app.database.db import engine
from app.models.base import Base
from app.models.recruiter import Recruiter
from app.models.job import Job
from app.models.candidate import Candidate

from app.auth.router import router as auth_router
from app.jobs.router import router as jobs_router
from app.candidates.router import router as candidates_router

from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Recruiter System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(candidates_router)


@app.get("/")
def health():
    return {"status": "running"}