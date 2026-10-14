from pydantic import BaseModel
from typing import Optional

class VoiceCapability(BaseModel):
    stt_supported_languages: list[dict[str, str]]
    tts_supported_languages: list[dict[str, str]]
    browser_speech_api_supported: bool = True
    backend_adapter_status: str = "Active"

class TranscribeRequest(BaseModel):
    audio_base64: Optional[str] = None
    language_hint: Optional[str] = "hi-IN"
    context: Optional[str] = None

class TranscribeResponse(BaseModel):
    transcript: str
    detected_language: str
    confidence: float
    is_editable: bool = True
