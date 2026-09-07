import os
import sys
from datetime import datetime, timedelta
from app.database import engine, Base, SessionLocal
from app.models import Meeting, TranscriptSegment, Speaker, Participant, Summary, ActionItem, Tag, Highlight

def reset_db():
    print("Dropping and recreating tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

def seed():
    db = SessionLocal()
    try:
        # Meeting 1: Q3 Product Roadmap Review
        print("Seeding Meeting 1: Q3 Product Roadmap Review...")
        m1 = Meeting(
            title="Q3 Product Roadmap Review",
            date=datetime(2024, 1, 15, 10, 0, 0),
            duration_seconds=3720,
            status="completed"
        )
        db.add(m1)
        db.commit()
        
        # Add tags
        db.add_all([
            Tag(meeting_id=m1.id, name="roadmap"),
            Tag(meeting_id=m1.id, name="product"),
            Tag(meeting_id=m1.id, name="Q3")
        ])
        
        # Add participants
        db.add_all([
            Participant(meeting_id=m1.id, name="Sarah Chen", email="sarah@example.com"),
            Participant(meeting_id=m1.id, name="Mike Johnson", email="mike@example.com"),
            Participant(meeting_id=m1.id, name="Emily Park", email="emily@example.com"),
            Participant(meeting_id=m1.id, name="David Kim", email="david@example.com")
        ])
        
        # Add speakers
        s_sarah = Speaker(meeting_id=m1.id, label="Sarah Chen", color="#E74C3C")
        s_mike = Speaker(meeting_id=m1.id, label="Mike Johnson", color="#3498DB")
        s_emily = Speaker(meeting_id=m1.id, label="Emily Park", color="#2ECC71")
        s_david = Speaker(meeting_id=m1.id, label="David Kim", color="#F39C12")
        db.add_all([s_sarah, s_mike, s_emily, s_david])
        db.commit()

        # Transcript Segments (Mocking 45 segments for brevity)
        time = 0.0
        dialogue = [
            (s_sarah.id, "Alright everyone, let's get started. We have a lot to cover for the Q3 roadmap."),
            (s_mike.id, "Sounds good. Engineering is ready to go over the estimates."),
            (s_emily.id, "Design has finished the mockups for the new dashboard."),
            (s_david.id, "And the data models for the new analytics features are looking solid."),
            (s_sarah.id, "Great. Let's start with the dashboard revamp. Emily, can you walk us through it?"),
            (s_emily.id, "Sure. The main goal was to simplify the navigation and bring the most important metrics front and center."),
            (s_mike.id, "We reviewed the tech spec. It looks feasible, but the new charting library might take a week to integrate."),
            (s_sarah.id, "A week is fine. Let's make sure it's stable before rollout.")
        ] * 6 # repeating to get roughly 45 segments
        
        for i, (speaker_id, content) in enumerate(dialogue[:45]):
            duration = 15.0
            db.add(TranscriptSegment(
                meeting_id=m1.id, speaker_id=speaker_id, start_time=time, end_time=time+duration, content=content, sequence=i
            ))
            time += duration
            
        # Summary
        db.add(Summary(
            meeting_id=m1.id,
            overview="The team met to review the Q3 product roadmap. Key discussions included the dashboard revamp, analytics data models, and engineering estimates.",
            key_topics=[{"title": "Dashboard Revamp", "description": "Emily presented the new design."}],
            chapters=[{"title": "Introduction", "start_time": 0, "end_time": 60}]
        ))
        
        # Action Items
        db.add_all([
            ActionItem(meeting_id=m1.id, description="Integrate new charting library", assignee="Mike Johnson", status="pending"),
            ActionItem(meeting_id=m1.id, description="Finalize dashboard mockups", assignee="Emily Park", status="completed")
        ])

        # Meeting 2: Engineering Sprint Planning
        print("Seeding Meeting 2: Engineering Sprint Planning...")
        m2 = Meeting(
            title="Engineering Sprint Planning",
            date=datetime(2024, 1, 18, 14, 0, 0),
            duration_seconds=2880,
            status="completed"
        )
        db.add(m2)
        db.commit()
        
        db.add_all([Tag(meeting_id=m2.id, name="sprint"), Tag(meeting_id=m2.id, name="engineering")])
        db.add_all([
            Participant(meeting_id=m2.id, name="Alex Rivera"),
            Participant(meeting_id=m2.id, name="Mike Johnson"),
            Participant(meeting_id=m2.id, name="Priya Patel")
        ])
        
        s_alex = Speaker(meeting_id=m2.id, label="Alex Rivera", color="#9B59B6")
        s_mike2 = Speaker(meeting_id=m2.id, label="Mike Johnson", color="#3498DB")
        s_priya = Speaker(meeting_id=m2.id, label="Priya Patel", color="#E91E63")
        db.add_all([s_alex, s_mike2, s_priya])
        db.commit()

        time = 0.0
        dialogue2 = [
            (s_alex.id, "Welcome to sprint planning. Our main focus is closing out the auth bugs."),
            (s_mike2.id, "I've reviewed the backlog. The password reset flow is the highest priority."),
            (s_priya.id, "Frontend is waiting on the API update for the reset endpoint.")
        ] * 13 # ~39 segments
        
        for i, (speaker_id, content) in enumerate(dialogue2[:38]):
            duration = 10.0
            db.add(TranscriptSegment(
                meeting_id=m2.id, speaker_id=speaker_id, start_time=time, end_time=time+duration, content=content, sequence=i
            ))
            time += duration
            
        db.add(Summary(
            meeting_id=m2.id,
            overview="Sprint planning focused on auth bugs and API updates.",
            key_topics=[{"title": "Auth Bugs", "description": "Password reset flow priority."}],
            chapters=[{"title": "Planning", "start_time": 0, "end_time": 300}]
        ))
        
        db.add(ActionItem(meeting_id=m2.id, description="Update API for reset endpoint", assignee="Mike Johnson", status="pending"))

        # Add Meeting 3, 4, 5 similarly
        print("Seeding Meetings 3, 4, 5...")
        # Meeting 3
        m3 = Meeting(title="Design Critique", date=datetime(2024, 1, 22, 11, 0, 0), duration_seconds=2100)
        db.add(m3)
        db.commit()
        db.add(Tag(meeting_id=m3.id, name="design"))
        s_emily3 = Speaker(meeting_id=m3.id, label="Emily Park", color="#2ECC71")
        db.add(s_emily3)
        db.commit()
        db.add(TranscriptSegment(meeting_id=m3.id, speaker_id=s_emily3.id, start_time=0, end_time=15, content="Let's look at the new UI components.", sequence=0))

        # Meeting 4
        m4 = Meeting(title="Customer Success Call", date=datetime(2024, 1, 25, 15, 30, 0), duration_seconds=1620)
        db.add(m4)
        db.commit()
        db.add(Tag(meeting_id=m4.id, name="customer"))
        s_olivia = Speaker(meeting_id=m4.id, label="Olivia Martinez", color="#8E44AD")
        db.add(s_olivia)
        db.commit()
        db.add(TranscriptSegment(meeting_id=m4.id, speaker_id=s_olivia.id, start_time=0, end_time=20, content="Thank you for joining today's call.", sequence=0))

        # Meeting 5
        m5 = Meeting(title="Team All-Hands", date=datetime(2024, 2, 1, 9, 0, 0), duration_seconds=5400)
        db.add(m5)
        db.commit()
        db.add(Tag(meeting_id=m5.id, name="all-hands"))
        s_sarah5 = Speaker(meeting_id=m5.id, label="Sarah Chen", color="#E74C3C")
        db.add(s_sarah5)
        db.commit()
        db.add(TranscriptSegment(meeting_id=m5.id, speaker_id=s_sarah5.id, start_time=0, end_time=60, content="Welcome to the all-hands. Great job this month everyone.", sequence=0))

        db.commit()
        print("Seed completed successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    reset_db()
    seed()
