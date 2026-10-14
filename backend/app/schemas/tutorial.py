from pydantic import BaseModel, ConfigDict

class TutorialBase(BaseModel):
    service_code: str
    title: str
    publisher: str
    video_url: str
    language: str = "Hindi"
    duration: str = "5:30"
    verified_status: str = "Verified Official"
    last_checked_date: str = "2026-10-01"

class TutorialOut(TutorialBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
