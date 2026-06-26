from pydantic import BaseModel, EmailStr


class CandidateCreate(BaseModel):
    job_id: int
    name: str
    email: EmailStr

class CandidateUpdate(BaseModel):
    name: str
    email: EmailStr


class CandidateResponse(BaseModel):
    id: int
    job_id: int
    name: str
    email: EmailStr
    resume_path: str
    score: float | None = None
    matching_skills: str | None = None
    missing_skills: str | None = None
    summary: str | None = None

    class Config:
        from_attributes = True