from sqlalchemy import Column, Integer, String, Text, JSON, DateTime
from datetime import datetime, timezone
from app.core.database import Base

def get_utc_now():
    return datetime.now(timezone.utc)

class SavedTask(Base):
    __tablename__ = "saved_tasks"

    id = Column(Integer, primary_key=True, index=True)
    task_type = Column(String(50), index=True, nullable=False)
    reference_id = Column(String(100), nullable=False)
    reference_title = Column(String(255), nullable=False)
    checklist_state = Column(JSON, default=dict)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)
