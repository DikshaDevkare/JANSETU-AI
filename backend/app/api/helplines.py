from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.helpline import Helpline
from app.schemas.helpline import HelplineOut

router = APIRouter(prefix="/helplines", tags=["Emergency Helplines"])

@router.get("", response_model=list[HelplineOut])
def get_helplines(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search keyword"),
    db: Session = Depends(get_db)
):
    query = db.query(Helpline)

    if category and category.lower() != "all":
        query = query.filter(Helpline.category.ilike(f"%{category}%"))

    helplines = query.all()

    if search:
        search_lower = search.lower()
        helplines = [
            h for h in helplines
            if search_lower in h.name.lower()
            or search_lower in h.number.lower()
            or (h.name_hi and search_lower in h.name_hi.lower())
            or (h.name_mr and search_lower in h.name_mr.lower())
            or search_lower in h.description.lower()
            or search_lower in h.category.lower()
        ]

    return helplines
