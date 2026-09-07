from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import TranscriptSegment, Meeting, Speaker
from app.schemas.search import SearchResponse

router = APIRouter(tags=["Search"])

@router.get("/search", response_model=SearchResponse)
def search_transcripts(
    q: str = Query(..., min_length=2),
    meeting_id: int = None,
    db: Session = Depends(get_db)
):
    query = db.query(TranscriptSegment, Meeting, Speaker)\
        .join(Meeting, TranscriptSegment.meeting_id == Meeting.id)\
        .outerjoin(Speaker, TranscriptSegment.speaker_id == Speaker.id)\
        .filter(TranscriptSegment.content.ilike(f"%{q}%"))
        
    if meeting_id:
        query = query.filter(TranscriptSegment.meeting_id == meeting_id)
        
    results = query.limit(50).all()
    
    response_results = []
    for segment, meeting, speaker in results:
        response_results.append({
            "segment_id": segment.id,
            "meeting_id": meeting.id,
            "meeting_title": meeting.title,
            "speaker_label": speaker.label if speaker else None,
            "content": segment.content,
            "start_time": segment.start_time
        })
        
    return {"results": response_results, "total_count": len(response_results)}
