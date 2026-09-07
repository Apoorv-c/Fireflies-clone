from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import TranscriptSegment, Meeting
from app.schemas.transcript import TranscriptSegmentResponse, TranscriptUploadResponse
from app.services.parser_service import parse_transcript

router = APIRouter(tags=["Transcripts"])

@router.get("/meetings/{meeting_id}/transcript", response_model=List[TranscriptSegmentResponse])
def get_transcript(meeting_id: int, db: Session = Depends(get_db)):
    segments = db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == meeting_id).order_by(TranscriptSegment.sequence).all()
    
    result = []
    for s in segments:
        result.append({
            "id": s.id,
            "meeting_id": s.meeting_id,
            "speaker_id": s.speaker_id,
            "speaker_label": s.speaker.label if s.speaker else None,
            "speaker_color": s.speaker.color if s.speaker else None,
            "start_time": s.start_time,
            "end_time": s.end_time,
            "content": s.content,
            "sequence": s.sequence
        })
    return result

@router.post("/meetings/{meeting_id}/upload", response_model=TranscriptUploadResponse)
async def upload_transcript(meeting_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    content = await file.read()
    text_content = content.decode("utf-8")
    
    parsed_segments = parse_transcript(file.filename, text_content)
    
    # For a real implementation, you would also create Speaker models if they don't exist
    # Here we just create the segments for simplicity
    
    db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == meeting_id).delete()
    
    segments = []
    for i, seg in enumerate(parsed_segments):
        new_seg = TranscriptSegment(
            meeting_id=meeting_id,
            start_time=seg["start_time"],
            end_time=seg["end_time"],
            content=seg["content"],
            sequence=i
        )
        db.add(new_seg)
        segments.append(new_seg)
        
    db.commit()
    return {"message": "Transcript uploaded and parsed successfully", "segment_count": len(segments)}
