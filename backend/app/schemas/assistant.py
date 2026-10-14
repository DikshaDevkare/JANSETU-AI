from pydantic import BaseModel
from typing import Optional, Any

class SourceCitation(BaseModel):
    title: str
    url: str
    publisher: str
    verified_date: str

class SuggestedAction(BaseModel):
    label: str
    action_type: str  # navigate, check_eligibility, draft_complaint, open_link, call_helpline
    payload: Any

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    conversation_history: list[dict[str, str]] = []
    context_module: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    language: str
    citations: list[SourceCitation] = []
    suggested_actions: list[SuggestedAction] = []
    confidence: float = 0.96
    disclaimer: str = "Responses are grounded in verified government data. JanSetu AI does not replace official government channels or guarantee scheme approvals."
