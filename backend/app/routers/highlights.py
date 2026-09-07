from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Highlight, TranscriptSegment
from app.schemas.highlight import HighlightCreate, HighlightResponse

router = APIRouter(tags=["Highlights"])

@router.post("/highlights", response_model=HighlightResponse)
def create_highlight(highlight: HighlightCreate, db: Session = Depends(get_db)):
    segment = db.query(TranscriptSegment).filter(TranscriptSegment.id == highlight.segment_id).first()
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
        
    new_highlight = Highlight(
        segment_id=highlight.segment_id,
        color=highlight.color,
        note=highlight.note
    )
    db.add(new_highlight)
    db.commit()
    db.refresh(new_highlight)
    return new_highlight

@router.delete("/highlights/{id}")
def delete_highlight(id: int, db: Session = Depends(get_db)):
    highlight = db.query(Highlight).filter(Highlight.id == id).first()
    if not highlight:
        raise HTTPException(status_code=404, detail="Highlight not found")
    db.delete(highlight)
    db.commit()
    return {"message": "Highlight deleted"}
