from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Tutorial(Base):
    __tablename__ = "tutorials"

    id = Column(Integer, primary_key=True, index=True)
    service_code = Column(String(50), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    publisher = Column(String(255), nullable=False)
    video_url = Column(String(500), nullable=False)
    language = Column(String(50), default="Hindi")
    duration = Column(String(50), default="5:30")
    verified_status = Column(String(50), default="Verified Official")
    last_checked_date = Column(String(50), default="2026-10-01")
