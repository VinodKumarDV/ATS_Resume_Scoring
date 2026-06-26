from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.auth.dependencies import get_current_recruiter

from app.schemas.job import JobCreate, JobUpdate
from app.services.job_service import (
    create_job,
    get_jobs,
    get_job_by_id,
    update_job,
    delete_job
)

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.post("/")
def create_new_job(
    payload: JobCreate,
    db: Session = Depends(get_db),
    recruiter_id: int = Depends(get_current_recruiter)
):
    return create_job(
        db=db,
        recruiter_id=recruiter_id,
        payload=payload
    )


@router.get("/")
def list_jobs(
    status: str | None = None,
    db: Session = Depends(get_db),
    recruiter_id: int = Depends(get_current_recruiter)
):
    return get_jobs(
        db=db,
        recruiter_id=recruiter_id,
        status=status
    )


@router.get("/{job_id}")
def get_job(
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

    return job


@router.put("/{job_id}")
def update_existing_job(
    job_id: int,
    payload: JobUpdate,
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

    return update_job(
        db=db,
        job=job,
        payload=payload
    )


@router.delete("/{job_id}")
def remove_job(
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

    delete_job(
        db=db,
        job=job
    )

    return {
        "message": "Job deleted successfully"
    }

@router.put("/{job_id}/close")
def close_job(
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

    job.status = "closed"

    db.commit()
    db.refresh(job)

    return {
        "message": "Job closed successfully",
        "job_id": job.id,
        "status": job.status
    }