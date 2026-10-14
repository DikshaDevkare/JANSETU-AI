from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.tutorial import Tutorial
from app.schemas.tutorial import TutorialOut

router = APIRouter(prefix="/tutorials", tags=["Watch & Learn Tutorials"])

@router.get("", response_model=list[TutorialOut])
def get_tutorials(
    service_code: Optional[str] = Query(None, description="Filter by service code"),
    db: Session = Depends(get_db)
):
    query = db.query(Tutorial)
    if service_code:
        query = query.filter(Tutorial.service_code == service_code)
    return query.all()
