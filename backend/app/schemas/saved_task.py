from pydantic import BaseModel, ConfigDict
from typing import Optional, Any
from datetime import datetime

class SavedTaskCreate(BaseModel):
    task_type: str  # scheme, service, civic_draft
    reference_id: str
    reference_title: str
    checklist_state: dict[str, Any] = {}
    notes: Optional[str] = None

class SavedTaskOut(SavedTaskCreate):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
