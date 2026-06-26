from sqlalchemy.orm import Session

from app.models.job import Job
from app.schemas.job import JobCreate, JobUpdate


def create_job(
    db: Session,
    recruiter_id: int,
    payload: JobCreate
):
    job = Job(
        recruiter_id=recruiter_id,
        title=payload.title,
        description=payload.description,
        status="open"
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job


def get_jobs(
    db: Session,
    recruiter_id: int,
    status: str | None = None
):
    query = db.query(Job).filter(
        Job.recruiter_id == recruiter_id
    )

    if status:
        query = query.filter(
            Job.status == status.upper()
        )

    return query.all()


def get_job_by_id(
    db: Session,
    job_id: int,
    recruiter_id: int
):
    return db.query(Job).filter(
        Job.id == job_id,
        Job.recruiter_id == recruiter_id
    ).first()


def update_job(
    db: Session,
    job: Job,
    payload: JobUpdate
):
    if payload.title is not None:
        job.title = payload.title

    if payload.description is not None:
        job.description = payload.description

    if payload.status is not None:
        job.status = payload.status

    db.commit()
    db.refresh(job)

    return job


def delete_job(
    db: Session,
    job: Job
):
    db.delete(job)
    db.commit()