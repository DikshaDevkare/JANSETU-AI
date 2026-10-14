from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base

class Helpline(Base):
    __tablename__ = "helplines"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(50), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    name_hi = Column(String(255), nullable=True)
    name_mr = Column(String(255), nullable=True)
    category = Column(String(100), index=True, nullable=False)
    coverage = Column(String(100), default="Pan-India")
    operational_hours = Column(String(100), default="24x7")
    description = Column(Text, nullable=False)
    description_hi = Column(Text, nullable=True)
    description_mr = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    official_source = Column(String(255), default="112.gov.in / india.gov.in")
