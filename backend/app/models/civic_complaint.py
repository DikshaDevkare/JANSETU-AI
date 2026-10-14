from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone
from app.core.database import Base

def get_utc_now():
    return datetime.now(timezone.utc)

class CivicComplaint(Base):
    __tablename__ = "civic_complaints"

    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String(50), unique=True, index=True, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    description = Column(Text, nullable=False)
    ward_id = Column(String(50), nullable=True)
    location_address = Column(String(255), nullable=True)
    landmark = Column(String(255), nullable=True)
    photo_url = Column(String(500), nullable=True)
    urgency_level = Column(String(50), default="Medium")
    ai_draft_subject = Column(String(255), nullable=True)
    ai_draft_body = Column(Text, nullable=True)
    routed_authority = Column(String(255), nullable=True)
    official_portal_link = Column(String(500), nullable=True)
    contact_helpline = Column(String(100), nullable=True)
    status = Column(String(50), default="Draft")
    created_at = Column(DateTime, default=get_utc_now)
