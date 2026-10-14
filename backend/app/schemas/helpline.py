from pydantic import BaseModel, ConfigDict
from typing import Optional

class HelplineBase(BaseModel):
    number: str
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    category: str
    coverage: str = "Pan-India"
    operational_hours: str = "24x7"
    description: str
    description_hi: Optional[str] = None
    description_mr: Optional[str] = None
    instructions: Optional[str] = None
    official_source: str = "112.gov.in"

class HelplineOut(HelplineBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
