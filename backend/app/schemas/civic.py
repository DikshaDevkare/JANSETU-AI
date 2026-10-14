from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class CivicClassifyRequest(BaseModel):
    description: str
    location: Optional[str] = None
    language: Optional[str] = "en"

class CivicClassifyResponse(BaseModel):
    category: str
    urgency_level: str
    identified_keywords: list[str] = []
    recommended_ward: Optional[str] = None
    confidence_score: float = 0.95

class CivicDraftRequest(BaseModel):
    category: str
    description: str
    ward_id: Optional[str] = None
    location_address: Optional[str] = None
    landmark: Optional[str] = None
    citizen_name: Optional[str] = "Concerned Citizen"
    contact_phone: Optional[str] = None
    language: Optional[str] = "en"

class CivicDraftResponse(BaseModel):
    tracking_code: str
    category: str
    urgency_level: str
    subject: str
    letter_body: str
    routed_authority: str
    official_portal_link: str
    contact_helpline: str
    instructions: list[str]
    disclaimer: str = "This document is a formal grievance draft prepared for the citizen. JanSetu AI does not directly file complaints without authorized government integration. Please copy and paste this draft into the official portal link above."

class CivicComplaintSave(BaseModel):
    tracking_code: str
    category: str
    description: str
    ward_id: Optional[str] = None
    location_address: Optional[str] = None
    landmark: Optional[str] = None
    urgency_level: str
    ai_draft_subject: str
    ai_draft_body: str
    routed_authority: str
    official_portal_link: str
    contact_helpline: str

class CivicComplaintOut(CivicComplaintSave):
    id: int
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
