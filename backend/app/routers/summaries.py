from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import Summary, Meeting, TranscriptSegment
from app.schemas.summary import SummaryResponse, SummaryGenerateRequest
from app.services.llm_service import generate_summary

router = APIRouter(tags=["Summaries"])

@router.get("/meetings/{meeting_id}/summary", response_model=SummaryResponse)
def get_summary(meeting_id: int, db: Session = Depends(get_db)):
    summary = db.query(Summary).filter(Summary.meeting_id == meeting_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    return summary

@router.post("/meetings/{meeting_id}/summary/generate", response_model=SummaryResponse)
def create_or_update_summary(meeting_id: int, request: SummaryGenerateRequest, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    segments = db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == meeting_id).order_by(TranscriptSegment.sequence).all()
    if not segments:
        raise HTTPException(status_code=400, detail="Cannot generate summary without transcript segments")
        
    segments_data = [{"content": s.content, "start_time": s.start_time, "end_time": s.end_time} for s in segments]
    summary_data = generate_summary(segments_data)
    
    summary = db.query(Summary).filter(Summary.meeting_id == meeting_id).first()
    if summary:
        summary.overview = summary_data["overview"]
        summary.key_topics = summary_data["key_topics"]
        summary.chapters = summary_data["chapters"]
    else:
        summary = Summary(
            meeting_id=meeting_id,
            overview=summary_data["overview"],
            key_topics=summary_data["key_topics"],
            chapters=summary_data["chapters"]
        )
        db.add(summary)
        
    db.commit()
    db.refresh(summary)
    return summary
