from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.auth import RegisterRequest
from app.models.recruiter import Recruiter
from app.services.security import hash_password
from app.database.dependencies import get_db

from app.auth.auth import LoginRequest
from app.services.security import verify_password
from app.services.jwt_service import create_access_token

from app.auth.dependencies import get_current_recruiter

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register")
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db)
):
    recruiter = Recruiter(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(
            payload.password
        )
    )

    db.add(recruiter)
    db.commit()
    db.refresh(recruiter)

    return {
        "message": "Recruiter created",
        "id": recruiter.id
    }

@router.post("/login")
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):

    recruiter = (
        db.query(Recruiter)
        .filter(
            Recruiter.email == payload.email
        )
        .first()
    )

    if not recruiter:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        payload.password,
        recruiter.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": str(recruiter.id)
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
def me(
    recruiter_id: int = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    recruiter = db.query(Recruiter).filter(
        Recruiter.id == recruiter_id
    ).first()

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail="Recruiter not found"
        )

    return {
        "id": recruiter.id,
        "name": recruiter.name,
        "email": recruiter.email
    }