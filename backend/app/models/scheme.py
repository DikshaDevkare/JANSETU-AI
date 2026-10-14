from sqlalchemy import Column, Integer, String, Text, Boolean, JSON
from app.core.database import Base

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False, index=True)
    title_hi = Column(String(255), nullable=True)
    title_mr = Column(String(255), nullable=True)
    category = Column(String(100), index=True, nullable=False)
    level = Column(String(50), default="Central")  # Central, State
    state = Column(String(100), default="Pan-India")  # Pan-India, Maharashtra, etc.
    ministry = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    description_hi = Column(Text, nullable=True)
    description_mr = Column(Text, nullable=True)
    key_benefits = Column(JSON, default=list)  # list of strings
    eligibility_criteria = Column(JSON, default=dict)  # rules: min_age, max_age, max_income, etc.
    required_documents = Column(JSON, default=list)  # list of {name, description, mandatory: bool}
    application_steps = Column(JSON, default=list)  # list of step instructions
    official_url = Column(String(500), nullable=False)
    source_citation = Column(String(255), default="myscheme.gov.in")
    last_verified_date = Column(String(50), default="2026-10-01")
    is_active = Column(Boolean, default=True)
