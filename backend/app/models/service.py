from sqlalchemy import Column, Integer, String, Text, JSON
from app.core.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False, index=True)
    title_hi = Column(String(255), nullable=True)
    title_mr = Column(String(255), nullable=True)
    category = Column(String(100), index=True, nullable=False)
    department = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    purpose = Column(Text, nullable=True)
    prerequisites = Column(JSON, default=list)
    required_documents = Column(JSON, default=list)  # list of {name, mandatory: bool, alternatives: list}
    alternative_documents = Column(JSON, default=dict)
    step_by_step = Column(JSON, default=list)
    verified_fees = Column(String(100), default="Free")
    timeline = Column(String(100), default="7-15 working days")
    official_portal_url = Column(String(500), nullable=False)
    source_citation = Column(String(255), default="services.india.gov.in")
    last_verified_date = Column(String(50), default="2026-10-01")
