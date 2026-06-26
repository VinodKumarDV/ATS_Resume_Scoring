import os
import shutil
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.auth.dependencies import get_current_recruiter

from app.services.job_service import get_job_by_id

from app.services.resume_parser import extract_resume_text

from app.services.ai_service import score_candidate

from app.models.candidate import Candidate

from app.schemas.candidate import CandidateUpdate

from app.services.candidate_service import (
    create_candidate,
    update_resume_text,
    update_candidate_score,
    get_candidate_by_id,
    get_candidates_by_job,
    update_candidate,
    delete_candidate
)


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)


UPLOAD_DIR = "uploads/resumes"

@router.get("/{candidate_id}")
def get_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    recruiter_id: int = Depends(get_current_recruiter)
):
    candidate = get_candidate_by_id(
        db=db,
        candidate_id=candidate_id
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    return candidate

@router.put("/{candidate_id}")
def update_candidate_details(
    candidate_id: int,
    payload: CandidateUpdate,
    db: Session = Depends(get_db),
    recruiter_id: int = Depends(get_current_recruiter)
):
    candidate = get_candidate_by_id(
        db=db,
        candidate_id=candidate_id
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    return update_candidate(
        db=db,
        candidate=candidate,
        name=payload.name,
        email=payload.email
    )

@router.delete("/{candidate_id}")
def remove_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    recruiter_id: int = Depends(get_current_recruiter)
):
    candidate = get_candidate_by_id(
        db=db,
        candidate_id=candidate_id
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    delete_candidate(
        db=db,
        candidate=candidate
    )

    return {
        "message": "Candidate deleted successfully"
    }


@router.get("/job/{job_id}")
def get_job_candidates(
    job_id: int,
    db: Session = Depends(get_db),
    recruiter_id: int = Depends(get_current_recruiter)
):
    job = get_job_by_id(
        db=db,
        job_id=job_id,
        recruiter_id=recruiter_id
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return get_candidates_by_job(
        db=db,
        job_id=job_id
    )


@router.post("/upload")
async def upload_candidate(
    job_id: int = Form(...),
    name: str = Form(...),
    email: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    recruiter_id: int = Depends(get_current_recruiter)
):
    job = get_job_by_id(
        db=db,
        job_id=job_id,
        recruiter_id=recruiter_id
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}

    ALLOWED_CONTENT_TYPES = {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    file_extension = resume.filename.split(".")[-1].lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC and DOCX files are allowed"
        )

    if resume.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type"
        )
    
    unique_filename = (
        f"{uuid4()}.{file_extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            resume.file,
            buffer
        )

    candidate = create_candidate(
        db=db,
        job_id=job_id,
        name=name,
        email=email,
        resume_path=file_path
    )

    resume_text = extract_resume_text(file_path)

    update_resume_text(
        db=db,
        candidate=candidate,
        resume_text=resume_text
    )

    ai_result = score_candidate(
        job_description=job.description,
        resume_text=resume_text
    )

    update_candidate_score(
        db=db,
        candidate=candidate,
        ai_result=ai_result
    )

    return {
        "message": "Candidate uploaded and processed successfully",
        "candidate_id": candidate.id,
        "score": ai_result.get("score"),
        "matching_skills": ai_result.get("matching_skills"),
        "missing_skills": ai_result.get("missing_skills"),
        "summary": ai_result.get("summary")
    }