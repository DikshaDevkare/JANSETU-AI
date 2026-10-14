from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.service import Service
from app.schemas.service import ServiceOut

router = APIRouter(prefix="/services", tags=["Documents & Services"])

@router.get("", response_model=list[ServiceOut])
def get_services(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search keyword"),
    db: Session = Depends(get_db)
):
    query = db.query(Service)

    if category and category.lower() != "all":
        query = query.filter(Service.category.ilike(f"%{category}%"))

    services = query.all()

    if search:
        search_lower = search.lower()
        services = [
            s for s in services
            if search_lower in s.title.lower()
            or (s.title_hi and search_lower in s.title_hi.lower())
            or (s.title_mr and search_lower in s.title_mr.lower())
            or search_lower in s.description.lower()
            or (s.purpose and search_lower in s.purpose.lower())
            or search_lower in s.category.lower()
        ]

    return services

@router.get("/{service_id}", response_model=ServiceOut)
def get_service_by_id(service_id: int, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service
