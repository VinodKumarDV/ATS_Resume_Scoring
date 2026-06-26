from sqlalchemy.orm import Session

from app.models.candidate import Candidate


def create_candidate(
    db: Session,
    job_id: int,
    name: str,
    email: str,
    resume_path: str
):
    candidate = Candidate(
        job_id=job_id,
        name=name,
        email=email,
        resume_path=resume_path
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return candidate


def get_candidate_by_id(
    db: Session,
    candidate_id: int
):
    return db.query(Candidate).filter(
        Candidate.id == candidate_id
    ).first()


def get_candidates_by_job(
    db: Session,
    job_id: int
):
    return db.query(Candidate).filter(
        Candidate.job_id == job_id
    ).all()


def delete_candidate(
    db: Session,
    candidate: Candidate
):
    db.delete(candidate)
    db.commit()

def update_candidate(
    db: Session,
    candidate: Candidate,
    name: str,
    email: str
):
    candidate.name = name
    candidate.email = email

    db.commit()
    db.refresh(candidate)

    return candidate

def update_resume_text(
    db: Session,
    candidate: Candidate,
    resume_text: str
):
    candidate.resume_text = resume_text

    db.commit()
    db.refresh(candidate)

    return candidate

def update_candidate_score(
    db,
    candidate,
    ai_result
):
    candidate.score = ai_result.get("score")

    candidate.matching_skills = ",".join(
        ai_result.get("matching_skills", [])
    )

    candidate.missing_skills = ",".join(
        ai_result.get("missing_skills", [])
    )

    candidate.summary = ai_result.get("summary")

    db.commit()
    db.refresh(candidate)

    return candidate