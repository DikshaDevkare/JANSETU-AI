from pydantic import BaseModel, ConfigDict
from typing import Optional, Any

class SchemeBase(BaseModel):
    code: str
    title: str
    title_hi: Optional[str] = None
    title_mr: Optional[str] = None
    category: str
    level: str = "Central"
    state: str = "Pan-India"
    ministry: Optional[str] = None
    description: str
    description_hi: Optional[str] = None
    description_mr: Optional[str] = None
    key_benefits: list[str] = []
    eligibility_criteria: dict[str, Any] = {}
    required_documents: list[dict[str, Any]] = []
    application_steps: list[str] = []
    official_url: str
    source_citation: str = "myscheme.gov.in"
    last_verified_date: str = "2026-10-01"
    is_active: bool = True

class SchemeOut(SchemeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class EligibilityCheckRequest(BaseModel):
    scheme_id: Optional[int] = None
    scheme_code: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    annual_income: Optional[float] = None
    occupation: Optional[str] = None
    state: Optional[str] = "Maharashtra"
    landholding_acres: Optional[float] = None
    has_disability: Optional[bool] = False

class RequirementEvaluation(BaseModel):
    condition: str
    status: str
    details: str

class EligibilityCheckResponse(BaseModel):
    scheme_title: str
    scheme_code: str
    overall_status: str
    satisfied_requirements: list[RequirementEvaluation] = []
    needs_clarification: list[RequirementEvaluation] = []
    unverified_requirements: list[RequirementEvaluation] = []
    official_source: str
    last_verified_date: str
    official_portal_url: str
    disclaimer: str = "This assessment is an informational guide based on published criteria on myscheme.gov.in. Final eligibility and approval can only be granted by the designated government authorities upon formal application."
