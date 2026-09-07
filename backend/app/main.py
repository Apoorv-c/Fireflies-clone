from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import engine, Base, get_db
from app.models import Meeting, TranscriptSegment, Summary, ActionItem
from app.routers import meetings, transcripts, summaries, action_items, search, highlights

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fireflies Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(meetings.router, prefix="/api")
app.include_router(transcripts.router, prefix="/api")
app.include_router(summaries.router, prefix="/api")
app.include_router(action_items.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(highlights.router, prefix="/api")

class AskRequest(BaseModel):
    meeting_id: int
    question: str

@app.post("/api/ask")
def ask_meeting(req: AskRequest, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == req.meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    segments = db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == req.meeting_id).order_by(TranscriptSegment.sequence).all()
    q_lower = req.question.lower()

    # Search for matching content
    matches = [s for s in segments if any(word in s.content.lower() for word in q_lower.split() if len(word) > 3)]
    
    # Generate contextual answers based on meeting content
    if "action" in q_lower or "task" in q_lower or "todo" in q_lower:
        items = db.query(ActionItem).filter(ActionItem.meeting_id == req.meeting_id).all()
        if items:
            item_list = "\n".join([f"- {item.description} (Assigned to: {item.assignee or 'Unassigned'})" for item in items])
            return {
                "answer": f"Here are the action items identified from the meeting:\n\n{item_list}"
            }
        return {"answer": "No specific action items were found for this meeting."}
        
    if "summary" in q_lower or "overview" in q_lower or "about" in q_lower:
        summary = db.query(Summary).filter(Summary.meeting_id == req.meeting_id).first()
        if summary:
            return {"answer": f"**Executive Summary:**\n\n{summary.overview}"}

    if "topic" in q_lower or "discuss" in q_lower:
        summary = db.query(Summary).filter(Summary.meeting_id == req.meeting_id).first()
        if summary and summary.key_topics:
            topics_str = "\n".join([f"- **{t.get('title')}**: {t.get('description')}" for t in summary.key_topics])
            return {"answer": f"The primary topics discussed during the meeting include:\n\n{topics_str}"}

    if matches:
        first_few = matches[:3]
        citations = "\n\n".join([f'> "{s.content}" — *{s.speaker.label if s.speaker else "Speaker"}*' for s in first_few])
        return {
            "answer": f"Based on the transcript, here are the key moments discussing this:\n\n{citations}\n\nOverall, the participants aligned on these points during the discussion."
        }

    return {
        "answer": f"Based on the meeting transcript for **{meeting.title}**, the team focused on key deliverables and sprint goals. If you'd like more specific details, feel free to ask about action items, key topics, or specific speakers like {', '.join([s.label for s in meeting.speakers]) if meeting.speakers else 'the team'}."
    }

@app.get("/api/meetings/{id}/export")
def export_meeting(id: int, format: str = "markdown", db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    segments = db.query(TranscriptSegment).filter(TranscriptSegment.meeting_id == id).order_by(TranscriptSegment.sequence).all()
    summary = db.query(Summary).filter(Summary.meeting_id == id).first()
    action_items = db.query(ActionItem).filter(ActionItem.meeting_id == id).all()

    md = f"# {meeting.title}\n\n"
    md += f"**Date:** {meeting.date.strftime('%Y-%m-%d %H:%M') if meeting.date else 'N/A'}  \n"
    md += f"**Duration:** {meeting.duration_seconds // 60} minutes  \n"
    md += f"**Participants:** {', '.join([p.name for p in meeting.participants])}  \n\n"

    if summary:
        md += "## Executive Summary\n\n"
        md += f"{summary.overview}\n\n"
        if summary.key_topics:
            md += "### Key Topics\n\n"
            for t in summary.key_topics:
                md += f"- **{t.get('title')}**: {t.get('description')}\n"
            md += "\n"

    if action_items:
        md += "## Action Items\n\n"
        for item in action_items:
            status = "x" if item.status == "completed" else " "
            assignee = f" (@{item.assignee})" if item.assignee else ""
            md += f"- [{status}] {item.description}{assignee}\n"
        md += "\n"

    md += "## Full Transcript\n\n"
    for s in segments:
        m, sec = divmod(int(s.start_time), 60)
        speaker = s.speaker.label if s.speaker else "Speaker"
        md += f"**[{m:02d}:{sec:02d}] {speaker}:** {s.content}\n\n"

    return PlainTextResponse(content=md, media_type="text/markdown", headers={
        "Content-Disposition": f'attachment; filename="{meeting.title.replace(" ", "_")}.md"'
    })
