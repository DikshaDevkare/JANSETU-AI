from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.saved_task import SavedTask
from app.schemas.saved_task import SavedTaskCreate, SavedTaskOut

router = APIRouter(prefix="/saved-tasks", tags=["Saved Tasks & Checklists"])

@router.get("", response_model=list[SavedTaskOut])
def get_saved_tasks(db: Session = Depends(get_db)):
    return db.query(SavedTask).order_by(SavedTask.updated_at.desc()).all()

@router.post("", response_model=SavedTaskOut)
def save_or_update_task(task_in: SavedTaskCreate, db: Session = Depends(get_db)):
    # Check if this reference is already saved
    existing = db.query(SavedTask).filter(
        SavedTask.task_type == task_in.task_type,
        SavedTask.reference_id == task_in.reference_id
    ).first()

    if existing:
        existing.checklist_state = task_in.checklist_state
        existing.notes = task_in.notes
        existing.reference_title = task_in.reference_title
        db.commit()
        db.refresh(existing)
        return existing

    new_task = SavedTask(**task_in.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.delete("/{task_id}")
def delete_saved_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(SavedTask).filter(SavedTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Saved task not found")
    db.delete(task)
    db.commit()
    return {"message": "Saved task deleted successfully"}
