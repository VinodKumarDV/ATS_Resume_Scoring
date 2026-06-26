from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.models.base import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True)

    recruiter_id = Column(
        Integer,
        ForeignKey("recruiters.id"),
        nullable=False
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    status = Column(
        String,
        default="OPEN",
        nullable=False
    )