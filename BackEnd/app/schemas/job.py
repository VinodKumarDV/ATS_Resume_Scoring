from pydantic import BaseModel
from typing import Optional


class JobCreate(BaseModel):
    title: str
    description: str


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class JobResponse(BaseModel):
    id: int
    recruiter_id: int
    title: str
    description: str
    status: str

    class Config:
        from_attributes = True