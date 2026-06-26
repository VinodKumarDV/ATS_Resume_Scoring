from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Text,
    Float
)

from app.models.base import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True)

    job_id = Column(
        Integer,
        ForeignKey("jobs.id"),
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        nullable=False
    )

    resume_path = Column(
        String,
        nullable=False
    )

    resume_text = Column(
        Text,
        nullable=True
    )

    score = Column(
        Float,
        nullable=True
    )

    matching_skills = Column(
        Text,
        nullable=True
    )

    missing_skills = Column(
        Text,
        nullable=True
    )

    summary = Column(
        Text,
        nullable=True
    )