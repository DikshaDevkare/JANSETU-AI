from pydantic import BaseModel, ConfigDict
from typing import Optional, Any

class ServiceBase(BaseModel):
    code: str
    title: str
    title_hi: Optional[str] = None
    title_mr: Optional[str] = None
    category: str
    department: Optional[str] = None
    description: str
    purpose: Optional[str] = None
    prerequisites: list[str] = []
    required_documents: list[dict[str, Any]] = []
    alternative_documents: dict[str, list[str]] = {}
    step_by_step: list[str] = []
    verified_fees: str = "Free"
    timeline: str = "7-15 working days"
    official_portal_url: str
    source_citation: str = "services.india.gov.in"
    last_verified_date: str = "2026-10-01"

class ServiceOut(ServiceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class DocumentReadinessCheck(BaseModel):
    service_id: int
    user_held_documents: list[str] = []
