from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import ActionItem, Meeting
from app.schemas.action_item import ActionItemCreate, ActionItemUpdate, ActionItemResponse

router = APIRouter(tags=["Action Items"])

@router.get("/action-items", response_model=List[ActionItemResponse])
def get_all_action_items(db: Session = Depends(get_db)):
    items = db.query(ActionItem).order_by(ActionItem.created_at.desc()).all()
    return items

@router.post("/action-items", response_model=ActionItemResponse)
def create_standalone_action_item(item: ActionItemCreate, db: Session = Depends(get_db)):
    m = db.query(Meeting).first()
    meeting_id = m.id if m else 1
    new_item = ActionItem(
        meeting_id=meeting_id,
        description=item.description,
        assignee=item.assignee,
        due_date=item.due_date
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/meetings/{meeting_id}/action-items", response_model=List[ActionItemResponse])
def get_action_items(meeting_id: int, db: Session = Depends(get_db)):
    items = db.query(ActionItem).filter(ActionItem.meeting_id == meeting_id).all()
    return items

@router.post("/meetings/{meeting_id}/action-items", response_model=ActionItemResponse)
def create_action_item(meeting_id: int, item: ActionItemCreate, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    new_item = ActionItem(
        meeting_id=meeting_id,
        description=item.description,
        assignee=item.assignee,
        due_date=item.due_date
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.patch("/action-items/{id}", response_model=ActionItemResponse)
def update_action_item(id: int, item: ActionItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(ActionItem).filter(ActionItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Action item not found")
        
    update_data = item.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/action-items/{id}")
def delete_action_item(id: int, db: Session = Depends(get_db)):
    db_item = db.query(ActionItem).filter(ActionItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Action item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Action item deleted"}
