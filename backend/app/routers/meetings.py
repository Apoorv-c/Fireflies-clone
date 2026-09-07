from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models import Meeting, Participant, Tag
from app.schemas.meeting import MeetingResponse, MeetingDetailResponse, MeetingCreate, MeetingUpdate

router = APIRouter(tags=["Meetings"])

@router.get("/meetings", response_model=List[MeetingResponse])
def get_meetings(
    search: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    participant: Optional[str] = None,
    sort_by: Optional[str] = Query("newest", regex="^(newest|oldest|longest|shortest)$"),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Meeting)
    
    if search:
        query = query.filter(Meeting.title.ilike(f"%{search}%"))
    if date_from:
        query = query.filter(Meeting.date >= date_from)
    if date_to:
        query = query.filter(Meeting.date <= date_to)
    if participant:
        query = query.join(Participant).filter(Participant.name.ilike(f"%{participant}%"))
        
    if sort_by == "newest":
        query = query.order_by(desc(Meeting.date))
    elif sort_by == "oldest":
        query = query.order_by(asc(Meeting.date))
    elif sort_by == "longest":
        query = query.order_by(desc(Meeting.duration_seconds))
    elif sort_by == "shortest":
        query = query.order_by(asc(Meeting.duration_seconds))
        
    meetings = query.offset(skip).limit(limit).all()
    
    # Enrich with counts and snippets for the response
    for m in meetings:
        m.speaker_count = len(m.speakers)
        m.segment_count = len(m.transcript_segments)
        m.summary_snippet = m.summary.overview[:100] + "..." if m.summary else None

    return meetings

@router.post("/meetings", response_model=MeetingDetailResponse)
def create_meeting(meeting: MeetingCreate, db: Session = Depends(get_db)):
    new_meeting = Meeting(
        title=meeting.title,
        date=meeting.date or datetime.utcnow(),
        duration_seconds=meeting.duration_seconds,
        status=meeting.status,
        audio_url=meeting.audio_url
    )
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)
    
    for p in meeting.participants:
        db.add(Participant(meeting_id=new_meeting.id, name=p.name, email=p.email))
        
    for t in meeting.tags:
        db.add(Tag(meeting_id=new_meeting.id, name=t))
        
    db.commit()
    db.refresh(new_meeting)

    new_meeting.speaker_count = len(new_meeting.speakers)
    new_meeting.segment_count = len(new_meeting.transcript_segments)
    new_meeting.summary_snippet = None
    return new_meeting

@router.get("/meetings/{id}", response_model=MeetingDetailResponse)
def get_meeting(id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    meeting.speaker_count = len(meeting.speakers)
    meeting.segment_count = len(meeting.transcript_segments)
    meeting.summary_snippet = meeting.summary.overview[:100] + "..." if meeting.summary else None
    
    return meeting

@router.patch("/meetings/{id}", response_model=MeetingResponse)
def update_meeting(id: int, meeting_update: MeetingUpdate, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    update_data = meeting_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(meeting, key, value)
        
    db.commit()
    db.refresh(meeting)
    
    meeting.speaker_count = len(meeting.speakers)
    meeting.segment_count = len(meeting.transcript_segments)
    meeting.summary_snippet = meeting.summary.overview[:100] + "..." if meeting.summary else None
    
    return meeting

@router.delete("/meetings/{id}")
def delete_meeting(id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    db.delete(meeting)
    db.commit()
    return {"message": "Meeting deleted"}
