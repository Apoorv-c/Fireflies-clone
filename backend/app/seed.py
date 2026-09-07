import os
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import Meeting, Participant, TranscriptSegment, ActionItem, Summary, Speaker, Tag

def init_db():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        print("Seeding meetings...")

        # ----------------------------------------------------
        # Meeting 1: Q3 Product Roadmap Review
        # ----------------------------------------------------
        print("Seeding Meeting 1: Q3 Product Roadmap Review...")
        m1 = Meeting(
            title="Q3 Product Roadmap Review",
            date=datetime(2024, 1, 15, 10, 0, 0),
            duration_seconds=3720,
            status="completed"
        )
        db.add(m1)
        db.commit()
        db.refresh(m1)

        db.add_all([
            Tag(meeting_id=m1.id, name="roadmap"),
            Tag(meeting_id=m1.id, name="product"),
            Tag(meeting_id=m1.id, name="Q3")
        ])

        db.add_all([
            Participant(meeting_id=m1.id, name="Sarah Chen", email="sarah@company.com"),
            Participant(meeting_id=m1.id, name="Mike Johnson", email="mike@company.com"),
            Participant(meeting_id=m1.id, name="Emily Park", email="emily@company.com"),
            Participant(meeting_id=m1.id, name="David Kim", email="david@company.com")
        ])

        s_sarah = Speaker(meeting_id=m1.id, label="Sarah Chen", color="#E74C3C")
        s_mike = Speaker(meeting_id=m1.id, label="Mike Johnson", color="#3498DB")
        s_emily = Speaker(meeting_id=m1.id, label="Emily Park", color="#2ECC71")
        s_david = Speaker(meeting_id=m1.id, label="David Kim", color="#F39C12")
        db.add_all([s_sarah, s_mike, s_emily, s_david])
        db.commit()
        m1_spk = [s_sarah, s_mike, s_emily, s_david]

        m1_dialogue = [
            "Alright everyone, let's get started with our Q3 product roadmap review. Thanks for joining.",
            "I've shared the initial draft in Figma. Let's start with the dashboard revamp.",
            "The main goal here is to make the widgets more customizable for enterprise clients.",
            "I agree, Sarah. Our current dashboard is too rigid. I've been looking at the analytics pipeline to support this.",
            "The data team has already started indexing the new metrics we need. It should take about two weeks.",
            "That's great. Emily, how does the mobile app v2 timeline align with this?",
            "We are on track for a late August beta release for the mobile app v2.",
            "However, we need to ensure the new APIs are ready before the beta.",
            "Speaking of APIs, we need to talk about API rate limiting.",
            "We've had some abuse from free-tier users hitting our endpoints too hard.",
            "I'll review the rate limiting configuration and propose a tiered structure.",
            "Perfect. Let's make sure we document those changes clearly for the developer portal.",
            "Going back to the dashboard, can we integrate the customer feedback widget directly into it?",
            "That's a good idea. Users want to see their Net Promoter Score right on the main screen.",
            "I can design a module for that. We just need the backend to serve the aggregated scores.",
            "We can build an endpoint for that. Mike, do we have the historical data normalized?",
            "Most of it. There's some cleanup needed from Q1, but it's manageable.",
            "Okay, let's prioritize the cleanup this week so Emily's team isn't blocked.",
            "I'll add that to our Jira board right now.",
            "Let's look at the timeline. If we finish the API by August 1st, mobile can consume it.",
            "That gives us a two-week buffer before the beta launch.",
            "We also need to consider the marketing push. Have we synced with them?",
            "Not yet, I'll set up a sync with Marketing on Thursday.",
            "Make sure they emphasize the customizable dashboard in the messaging.",
            "Will do. Now, regarding the analytics pipeline, are we sticking with Snowflake?",
            "Yes, the migration is complete and we are seeing a 30% query speed improvement.",
            "That's a relief. It was a massive effort last quarter.",
            "I want to make sure the customer feedback integration doesn't slow down the main load time.",
            "We'll use asynchronous loading for the widgets to prevent blocking.",
            "Good thinking. Let's do a load test on staging once it's implemented.",
            "I can run the load tests next Friday.",
            "Great. Are there any other bottlenecks we're anticipating for Q3?",
            "The only other thing is the auth flow migration we discussed earlier.",
            "Right, the SSO integration for enterprise customers.",
            "We should probably tackle that in Q4. It's too much for this quarter.",
            "I agree. Let's push SSO to Q4 and focus on delivering the dashboard and mobile app.",
            "I'll update the roadmap document to reflect that change.",
            "Let's quickly review the action items to make sure we're aligned.",
            "Mike is on the API rate limiting and data cleanup.",
            "Emily is handling the dashboard design and mobile integration.",
            "David is running the load tests and analytics backend.",
            "And I will sync with marketing and update the roadmap.",
            "Sounds like a solid plan. Thanks everyone.",
            "I'll send out the meeting notes shortly.",
            "Have a great week, team!"
        ]

        m1_time = 0.0
        dur_step = 3720.0 / len(m1_dialogue)
        for i, text in enumerate(m1_dialogue):
            spk = m1_spk[i % len(m1_spk)]
            db.add(TranscriptSegment(
                meeting_id=m1.id,
                speaker_id=spk.id,
                start_time=round(m1_time, 1),
                end_time=round(m1_time + dur_step - 2.0, 1),
                content=text,
                sequence=i
            ))
            m1_time += dur_step

        db.add(Summary(
            meeting_id=m1.id,
            overview="The team reviewed the Q3 product roadmap, focusing heavily on the dashboard revamp and mobile app v2. Key technical dependencies, such as the analytics pipeline and API rate limiting, were discussed to ensure a smooth late August beta launch.",
            key_topics=[
                {"title": "Dashboard Revamp", "description": "Discussed making dashboard widgets customizable for enterprise clients."},
                {"title": "Analytics Pipeline", "description": "Confirmed Snowflake migration is complete with 30% performance boost."},
                {"title": "Mobile App V2", "description": "Targeting a late August beta release."},
                {"title": "API Rate Limiting", "description": "Addressed free-tier abuse by proposing a new tiered structure."},
                {"title": "Customer Feedback", "description": "Agreed to integrate NPS scores directly into the new dashboard."}
            ],
            chapters=[
                {"title": "Intro", "start_time": 0, "end_time": 300},
                {"title": "Dashboard Discussion", "start_time": 300, "end_time": 1200},
                {"title": "Analytics & Data", "start_time": 1200, "end_time": 2400},
                {"title": "Priorities & Timeline", "start_time": 2400, "end_time": 3720}
            ]
        ))

        db.add_all([
            ActionItem(meeting_id=m1.id, description="Propose tiered API rate limiting structure", assignee="Mike Johnson", status="pending"),
            ActionItem(meeting_id=m1.id, description="Design NPS feedback widget for dashboard", assignee="Emily Park", status="completed"),
            ActionItem(meeting_id=m1.id, description="Cleanup historical data from Q1", assignee="David Kim", status="pending"),
            ActionItem(meeting_id=m1.id, description="Sync with Marketing regarding dashboard messaging", assignee="Sarah Chen", status="pending")
        ])
        db.commit()

        # ----------------------------------------------------
        # Meeting 2: Engineering Sprint Planning
        # ----------------------------------------------------
        print("Seeding Meeting 2: Engineering Sprint Planning...")
        m2 = Meeting(
            title="Engineering Sprint Planning",
            date=datetime(2024, 1, 18, 14, 0, 0),
            duration_seconds=2880,
            status="completed"
        )
        db.add(m2)
        db.commit()
        db.refresh(m2)

        db.add_all([
            Tag(meeting_id=m2.id, name="sprint"),
            Tag(meeting_id=m2.id, name="engineering"),
            Tag(meeting_id=m2.id, name="planning")
        ])

        db.add_all([
            Participant(meeting_id=m2.id, name="Alex Rivera", email="alex@company.com"),
            Participant(meeting_id=m2.id, name="Mike Johnson", email="mike@company.com"),
            Participant(meeting_id=m2.id, name="Priya Patel", email="priya@company.com"),
            Participant(meeting_id=m2.id, name="James Wilson", email="james@company.com"),
            Participant(meeting_id=m2.id, name="Lisa Zhang", email="lisa@company.com")
        ])

        s2_alex = Speaker(meeting_id=m2.id, label="Alex Rivera", color="#9B59B6")
        s2_mike = Speaker(meeting_id=m2.id, label="Mike Johnson", color="#3498DB")
        s2_priya = Speaker(meeting_id=m2.id, label="Priya Patel", color="#E91E63")
        db.add_all([s2_alex, s2_mike, s2_priya])
        db.commit()
        m2_spk = [s2_alex, s2_mike, s2_priya]

        m2_dialogue = [
            "Welcome to the Sprint 42 planning session. Let's review the backlog.",
            "I think we should prioritize the auth flow bugs first.",
            "Agreed, the intermittent logout issue is affecting enterprise users.",
            "I have investigated it. It seems to be a token expiration race condition.",
            "Can we assign a story point to that? I'm thinking a 5.",
            "A 5 sounds right. It touches multiple services.",
            "Let's put it in the current sprint. Next is the CI/CD pipeline fixes.",
            "The GitHub Actions runners are timing out on the integration tests.",
            "We need to parallelize the test suite to fix that.",
            "I can take that on. I'd estimate it as a 3.",
            "Okay, James, we'll assign the pipeline fixes to you.",
            "What about the tech debt regarding the legacy payment gateway?",
            "We really need to deprecate it. The new Stripe integration is fully live.",
            "It's going to be a large effort to clean up all the old references.",
            "Let's break it down into smaller tasks over the next three sprints.",
            "I'll create the sub-tasks for the tech debt cleanup this afternoon.",
            "Thanks Priya. Let's talk about the new user onboarding flow.",
            "Design handed off the new screens yesterday. They look great.",
            "But we need to build the new backend endpoints to support the multi-step form.",
            "Let's point the backend work. Is it an 8?",
            "I think an 8 is fair. There's a lot of validation logic required.",
            "I can pair with Lisa on that to speed it up.",
            "Great, so Alex and Lisa on the onboarding endpoints.",
            "Are we overcommitting? We only have 40 points velocity.",
            "Let's count: Auth bug is 5, CI/CD is 3, Onboarding is 8.",
            "That's 16 points. We still have room for some minor bug fixes.",
            "There's a layout glitch on the mobile view of the pricing page.",
            "I can fix that quickly. Give it a 1.",
            "Let's also pull in the Redis caching optimization.",
            "That's been sitting in the backlog for a month. It's a 3.",
            "Alright, we're at 20 points. Let's aim for 30 this sprint.",
            "I'll pull in some user-reported bugs to fill the rest of the capacity.",
            "Sounds good. Let's make sure we update Jira before the end of the day.",
            "I'll start the sprint in Jira as soon as this meeting ends.",
            "Any blockers anyone is facing right now?",
            "Just waiting on an AWS IAM role approval from Security.",
            "I'll ping them on Slack to expedite that.",
            "Awesome. Let's have a great sprint, team!"
        ]

        m2_time = 0.0
        dur_step2 = 2880.0 / len(m2_dialogue)
        for i, text in enumerate(m2_dialogue):
            spk = m2_spk[i % len(m2_spk)]
            db.add(TranscriptSegment(
                meeting_id=m2.id,
                speaker_id=spk.id,
                start_time=round(m2_time, 1),
                end_time=round(m2_time + dur_step2 - 2.0, 1),
                content=text,
                sequence=i
            ))
            m2_time += dur_step2

        db.add(Summary(
            meeting_id=m2.id,
            overview="The engineering team planned Sprint 42, prioritizing critical auth flow bugs and CI/CD pipeline improvements. They also estimated points for the new onboarding flow backend and planned a phased approach for legacy tech debt.",
            key_topics=[
                {"title": "Auth Flow Bugs", "description": "Addressed a token expiration race condition causing unexpected logouts."},
                {"title": "CI/CD Pipeline", "description": "Planned to parallelize test suites to resolve runner timeouts."},
                {"title": "Tech Debt", "description": "Strategized breaking down legacy payment gateway deprecation across 3 sprints."},
                {"title": "Onboarding Endpoints", "description": "Estimated the backend work for the multi-step form at 8 story points."}
            ],
            chapters=[
                {"title": "Sprint Review", "start_time": 0, "end_time": 600},
                {"title": "Backlog Grooming", "start_time": 600, "end_time": 2000},
                {"title": "Commitments", "start_time": 2000, "end_time": 2880}
            ]
        ))

        db.add_all([
            ActionItem(meeting_id=m2.id, description="Fix token expiration race condition", assignee="Mike Johnson", status="pending"),
            ActionItem(meeting_id=m2.id, description="Parallelize integration test suite", assignee="James Wilson", status="pending"),
            ActionItem(meeting_id=m2.id, description="Create sub-tasks for legacy payment gateway deprecation", assignee="Priya Patel", status="completed"),
            ActionItem(meeting_id=m2.id, description="Build new onboarding backend endpoints", assignee="Alex Rivera", status="pending"),
            ActionItem(meeting_id=m2.id, description="Follow up with Security on IAM role approval", assignee="Alex Rivera", status="pending")
        ])
        db.commit()

        # ----------------------------------------------------
        # Meeting 3: Design Critique
        # ----------------------------------------------------
        print("Seeding Meeting 3: Design Critique...")
        m3 = Meeting(
            title="Design Critique",
            date=datetime(2024, 1, 22, 11, 0, 0),
            duration_seconds=2100,
            status="completed"
        )
        db.add(m3)
        db.commit()
        db.refresh(m3)

        db.add_all([
            Tag(meeting_id=m3.id, name="design"),
            Tag(meeting_id=m3.id, name="UX"),
            Tag(meeting_id=m3.id, name="review")
        ])

        db.add_all([
            Participant(meeting_id=m3.id, name="Emily Park", email="emily@company.com"),
            Participant(meeting_id=m3.id, name="Tom Baker", email="tom@company.com"),
            Participant(meeting_id=m3.id, name="Rachel Green", email="rachel@company.com")
        ])

        s3_emily = Speaker(meeting_id=m3.id, label="Emily Park", color="#2ECC71")
        s3_tom = Speaker(meeting_id=m3.id, label="Tom Baker", color="#1ABC9C")
        s3_rachel = Speaker(meeting_id=m3.id, label="Rachel Green", color="#E67E22")
        db.add_all([s3_emily, s3_tom, s3_rachel])
        db.commit()
        m3_spk = [s3_emily, s3_tom, s3_rachel]

        m3_dialogue = [
            "Let's dive into the onboarding flow redesign. I have the mockups here.",
            "I really like the new hero illustration. It feels much more welcoming.",
            "Thanks Tom. I wanted to reduce the cognitive load on the first screen.",
            "We have stripped out three form fields that were causing drop-offs.",
            "That's great. But have we considered how this impacts the color palette update?",
            "Yes, I'm using the new primary blue and softer grays for the backgrounds.",
            "I noticed the contrast on the 'Submit' button seems a bit low.",
            "Good catch. The accessibility audit findings actually flagged that too.",
            "We need to ensure all our primary buttons meet WCAG AA standards.",
            "I will darken the button background by a few shades to fix the contrast ratio.",
            "Let's look at the mobile responsive issues on step two.",
            "The text inputs are getting squeezed on smaller screens like the iPhone SE.",
            "We should stack them vertically on mobile instead of the two-column grid.",
            "I agree. A single column will be much easier to tap.",
            "Also, the error states aren't very visible on mobile.",
            "We can add a subtle red border and a bold text alert below the field.",
            "That should resolve the accessibility flag for error identification.",
            "Have we tested these changes with any users yet?",
            "Not yet. I want to finalize these tweaks before we run a usability test.",
            "Let's aim to have the prototype ready by Thursday for testing.",
            "I'll need some help updating the design system components to match.",
            "I can help you with the Figma component library this afternoon, Emily.",
            "Thank you Rachel, that would save me a lot of time.",
            "Let's recap: update button contrast, stack inputs on mobile, and improve error states.",
            "Exactly. And then build the prototype for user testing.",
            "I'll schedule the usability sessions for Friday morning.",
            "Perfect. I'll share the updated Figma link once I make the edits.",
            "Great session today. See you both later!"
        ]

        m3_time = 0.0
        dur_step3 = 2100.0 / len(m3_dialogue)
        for i, text in enumerate(m3_dialogue):
            spk = m3_spk[i % len(m3_spk)]
            db.add(TranscriptSegment(
                meeting_id=m3.id,
                speaker_id=spk.id,
                start_time=round(m3_time, 1),
                end_time=round(m3_time + dur_step3 - 2.0, 1),
                content=text,
                sequence=i
            ))
            m3_time += dur_step3

        db.add(Summary(
            meeting_id=m3.id,
            overview="The design team reviewed the onboarding flow redesign, focusing on reducing friction and improving accessibility. They addressed mobile responsiveness and planned usability testing for the updated prototype.",
            key_topics=[
                {"title": "Onboarding Redesign", "description": "Removed unnecessary fields to reduce cognitive load."},
                {"title": "Color & Contrast", "description": "Adjusted button colors to meet WCAG AA accessibility standards."},
                {"title": "Accessibility Audit", "description": "Improved error state visibility and contrast ratios."},
                {"title": "Mobile Responsiveness", "description": "Switched to a single-column layout for smaller screens to improve usability."}
            ],
            chapters=[
                {"title": "Onboarding Redesign", "start_time": 0, "end_time": 700},
                {"title": "Accessibility & Color", "start_time": 700, "end_time": 1400},
                {"title": "Mobile Layouts & Next Steps", "start_time": 1400, "end_time": 2100}
            ]
        ))

        db.add_all([
            ActionItem(meeting_id=m3.id, description="Darken primary button background for contrast", assignee="Emily Park", status="completed"),
            ActionItem(meeting_id=m3.id, description="Update text inputs to stack vertically on mobile", assignee="Tom Baker", status="pending"),
            ActionItem(meeting_id=m3.id, description="Schedule usability testing sessions for Friday", assignee="Rachel Green", status="pending")
        ])
        db.commit()

        # ----------------------------------------------------
        # Meeting 4: Customer Success Call
        # ----------------------------------------------------
        print("Seeding Meeting 4: Customer Success Call...")
        m4 = Meeting(
            title="Customer Success Call",
            date=datetime(2024, 1, 25, 15, 30, 0),
            duration_seconds=1620,
            status="completed"
        )
        db.add(m4)
        db.commit()
        db.refresh(m4)

        db.add_all([
            Tag(meeting_id=m4.id, name="customer"),
            Tag(meeting_id=m4.id, name="feedback")
        ])

        db.add_all([
            Participant(meeting_id=m4.id, name="Olivia Martinez", email="olivia@company.com"),
            Participant(meeting_id=m4.id, name="John Smith", email="john@client.com")
        ])

        s4_olivia = Speaker(meeting_id=m4.id, label="Olivia Martinez", color="#8E44AD")
        s4_john = Speaker(meeting_id=m4.id, label="John Smith", color="#2980B9")
        db.add_all([s4_olivia, s4_john])
        db.commit()
        m4_spk = [s4_olivia, s4_john]

        m4_dialogue = [
            "Hi John, thanks for taking the time to chat today.",
            "Hi Olivia, happy to be here. I have some feedback from my team.",
            "Great, I'd love to hear about your onboarding experience so far.",
            "The initial setup was smooth, but getting our entire department invited was tedious.",
            "I understand. Are you looking for a bulk export or import feature?",
            "Exactly. Being able to upload a CSV of users would save us hours.",
            "That is actually a feature request we hear often. It's on our roadmap.",
            "That's good to hear. Also, we really need SSO integration soon.",
            "Yes, SSO is planned for Q4. I know it's crucial for your security policies.",
            "We can make it work until then, but it's definitely a priority for our renewal.",
            "Speaking of bugs, a few of our users reported an issue with the reporting dashboard.",
            "Oh? Could you provide more details on the bug reports?",
            "When they export the monthly summary to PDF, the graphs are sometimes cut off.",
            "I apologize for that. I will log a high-priority ticket with our engineering team right away.",
            "Thank you. Other than that, the platform has been very valuable to us.",
            "I'm glad to hear that! Regarding your upcoming renewal discussion...",
            "We are planning to upgrade to the Enterprise tier once SSO is live.",
            "That's wonderful news. I can draft a preliminary agreement for you to review.",
            "Sounds good. Let's aim to have that signed by the end of next month.",
            "I will send over the proposal and the bug ticket tracking link by tomorrow.",
            "Perfect. Thanks for your help, Olivia.",
            "Thank you, John. Have a great afternoon!"
        ]

        m4_time = 0.0
        dur_step4 = 1620.0 / len(m4_dialogue)
        for i, text in enumerate(m4_dialogue):
            spk = m4_spk[i % len(m4_spk)]
            db.add(TranscriptSegment(
                meeting_id=m4.id,
                speaker_id=spk.id,
                start_time=round(m4_time, 1),
                end_time=round(m4_time + dur_step4 - 2.0, 1),
                content=text,
                sequence=i
            ))
            m4_time += dur_step4

        db.add(Summary(
            meeting_id=m4.id,
            overview="Olivia spoke with John regarding their recent onboarding experience. They discussed critical feature requests like bulk import and SSO, and addressed a bug with PDF exports.",
            key_topics=[
                {"title": "Onboarding Experience", "description": "Discussed the friction in inviting large numbers of users manually."},
                {"title": "Feature Requests", "description": "Client strongly requested bulk CSV import and SSO integration."},
                {"title": "Bug Reports", "description": "Reported an issue where PDF exports of reports have clipped graphs."}
            ],
            chapters=[
                {"title": "Feedback & Requests", "start_time": 0, "end_time": 800},
                {"title": "Bugs & Renewal", "start_time": 800, "end_time": 1620}
            ]
        ))

        db.add_all([
            ActionItem(meeting_id=m4.id, description="Log bug ticket for PDF export graph clipping", assignee="Olivia Martinez", status="completed"),
            ActionItem(meeting_id=m4.id, description="Draft Enterprise tier renewal proposal", assignee="Olivia Martinez", status="pending"),
            ActionItem(meeting_id=m4.id, description="Provide John with bug ticket tracking link", assignee="Olivia Martinez", status="pending")
        ])
        db.commit()

        # ----------------------------------------------------
        # Meeting 5: Team All-Hands
        # ----------------------------------------------------
        print("Seeding Meeting 5: Team All-Hands...")
        m5 = Meeting(
            title="Team All-Hands",
            date=datetime(2024, 2, 1, 9, 0, 0),
            duration_seconds=5400,
            status="completed"
        )
        db.add(m5)
        db.commit()
        db.refresh(m5)

        db.add_all([
            Tag(meeting_id=m5.id, name="all-hands"),
            Tag(meeting_id=m5.id, name="team"),
            Tag(meeting_id=m5.id, name="updates")
        ])

        db.add_all([
            Participant(meeting_id=m5.id, name="Sarah Chen", email="sarah@company.com"),
            Participant(meeting_id=m5.id, name="Mike Johnson", email="mike@company.com"),
            Participant(meeting_id=m5.id, name="Emily Park", email="emily@company.com"),
            Participant(meeting_id=m5.id, name="Alex Rivera", email="alex@company.com"),
            Participant(meeting_id=m5.id, name="Priya Patel", email="priya@company.com"),
            Participant(meeting_id=m5.id, name="James Wilson", email="james@company.com"),
            Participant(meeting_id=m5.id, name="Lisa Zhang", email="lisa@company.com"),
            Participant(meeting_id=m5.id, name="David Kim", email="david@company.com")
        ])

        s5_sarah = Speaker(meeting_id=m5.id, label="Sarah Chen", color="#E74C3C")
        s5_mike = Speaker(meeting_id=m5.id, label="Mike Johnson", color="#3498DB")
        s5_alex = Speaker(meeting_id=m5.id, label="Alex Rivera", color="#9B59B6")
        db.add_all([s5_sarah, s5_mike, s5_alex])
        db.commit()
        m5_spk = [s5_sarah, s5_mike, s5_alex]

        m5_dialogue = [
            "Good morning everyone! Welcome to our February All-Hands meeting.",
            "We have a packed agenda today, starting with our Q4 results.",
            "I am thrilled to announce that we exceeded our revenue targets by 15%.",
            "That's fantastic news, Sarah. The sales team really pushed hard in December.",
            "Absolutely. Our enterprise tier adoption grew significantly.",
            "Let's talk about hiring updates. We are expanding the engineering team.",
            "We've opened up three new roles for senior backend developers.",
            "If you know anyone who would be a good fit, please refer them.",
            "We are also looking for a new product designer to join Emily's team.",
            "Moving on to product launches. Alex, can you give us an update?",
            "Sure. Last month we successfully rolled out the new analytics pipeline.",
            "The feedback has been overwhelmingly positive. Queries are much faster.",
            "We also launched the beta version of our new mobile app.",
            "User engagement on mobile has spiked by 20% since the launch.",
            "That's a massive team win. Huge shoutout to the mobile and backend squads.",
            "I also want to highlight Priya for her work on mitigating the database outage last week.",
            "She was online at 2 AM and had the system back up in under twenty minutes.",
            "Thank you, Priya! You really saved us there.",
            "Let's look ahead. We have some exciting upcoming events.",
            "Next month is our annual company retreat in Denver.",
            "Flights and accommodations are booked. The itinerary will go out next week.",
            "We will have some great team-building activities planned.",
            "I can't wait for the hiking trip.",
            "It's going to be a lot of fun. We also have a hackathon coming up in March.",
            "Start thinking about your hackathon projects and forming teams.",
            "Is there a specific theme for this year's hackathon?",
            "Yes, the theme is 'AI and Automation'. We want to see innovative internal tools.",
            "I'm going to open the floor now for Q&A.",
            "Does anyone have any questions about the Q4 numbers?",
            "I have a question. How did our churn rate look in Q4?",
            "Our churn rate actually dropped to 2.1%, which is our lowest ever.",
            "That's largely due to the new customer success initiatives Olivia rolled out.",
            "Are we planning to expand into the European market this year?",
            "Yes, international expansion is a major goal for Q3 and Q4.",
            "We are currently looking into GDPR compliance requirements.",
            "Will the new hiring focus on remote workers or local candidates?",
            "We are remaining a remote-first company, so we are hiring globally.",
            "That's great to hear. It opens up a lot of talent pools.",
            "Any other questions before we wrap up the main presentation?",
            "Could we get an update on the new office space lease?",
            "We are finalizing the lease for a smaller, co-working hub space downtown.",
            "It will be completely optional for those who want a place to collaborate.",
            "We expect it to be ready by early April.",
            "I'm really excited about having an optional office space.",
            "Alright, if there are no more questions, let's move to department breakouts.",
            "Engineering will stay in this zoom room. Marketing will join link B.",
            "Before we split, just a reminder to submit your performance reviews by Friday.",
            "Don't forget to include peer feedback in your self-assessments.",
            "Thanks for a great start to the year, everyone.",
            "Let's keep this momentum going into Q1.",
            "I will share the slide deck and the recording in the general channel.",
            "Have a wonderful rest of your week!",
            "Wait, one last thing. The new company swag store is now live.",
            "You all have a $50 credit to spend on whatever you like.",
            "Check your emails for the link and discount code.",
            "Awesome, I need a new hoodie.",
            "Thanks Sarah!",
            "Bye everyone!",
            "See you all in the breakouts.",
            "Closing the main room now."
        ]

        m5_time = 0.0
        dur_step5 = 5400.0 / len(m5_dialogue)
        for i, text in enumerate(m5_dialogue):
            spk = m5_spk[i % len(m5_spk)]
            db.add(TranscriptSegment(
                meeting_id=m5.id,
                speaker_id=spk.id,
                start_time=round(m5_time, 1),
                end_time=round(m5_time + dur_step5 - 2.0, 1),
                content=text,
                sequence=i
            ))
            m5_time += dur_step5

        db.add(Summary(
            meeting_id=m5.id,
            overview="The monthly All-Hands meeting celebrated a successful Q4 with a 15% revenue beat. Leadership discussed new hiring plans, recognized key team wins, and previewed upcoming events like the Denver retreat and AI Hackathon.",
            key_topics=[
                {"title": "Q4 Results", "description": "Reported exceeding revenue targets by 15% and lowering churn to 2.1%."},
                {"title": "Hiring Updates", "description": "Announced 3 open backend roles and a product designer position."},
                {"title": "Product Launches", "description": "Celebrated the successful launch of the new analytics pipeline and mobile beta."},
                {"title": "Team Wins", "description": "Recognized Priya for resolving a late-night database outage swiftly."},
                {"title": "Upcoming Events", "description": "Shared details for the Denver company retreat and the March AI Hackathon."},
                {"title": "Q&A", "description": "Addressed questions on European expansion, remote hiring, and office space."}
            ],
            chapters=[
                {"title": "Opening", "start_time": 0, "end_time": 300},
                {"title": "Q4 Review", "start_time": 300, "end_time": 1200},
                {"title": "Product Updates", "start_time": 1200, "end_time": 2400},
                {"title": "Team Wins", "start_time": 2400, "end_time": 3600},
                {"title": "Q&A", "start_time": 3600, "end_time": 5400}
            ]
        ))

        db.add_all([
            ActionItem(meeting_id=m5.id, description="Refer candidates for open engineering roles", assignee="All Team", status="pending"),
            ActionItem(meeting_id=m5.id, description="Send out itinerary for Denver company retreat", assignee="Sarah Chen", status="pending"),
            ActionItem(meeting_id=m5.id, description="Form teams for March AI Hackathon", assignee="All Team", status="pending"),
            ActionItem(meeting_id=m5.id, description="Submit Q1 performance reviews and peer feedback", assignee="All Team", status="completed"),
            ActionItem(meeting_id=m5.id, description="Share slide deck and recording in Slack", assignee="Sarah Chen", status="completed")
        ])
        db.commit()

        print("Seed completed successfully! All 5 meetings seeded with full dialogue, summaries, topics, chapters, and action items.")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    seed_data()
