# 🔥 Fireflies.ai Clone

A full-stack meeting notes and transcription platform — a functional clone of [Fireflies.ai](https://fireflies.ai) with interactive transcript viewer, AI-generated summaries, and complete CRUD operations.

**Stack:** Next.js 16 (TypeScript) · FastAPI (Python) · SQLite

![Meetings Library](https://img.shields.io/badge/Meetings-Library-6C5CE7?style=flat-square)
![Transcript Sync](https://img.shields.io/badge/Transcript-Player_Sync-E74C3C?style=flat-square)
![AI Summary](https://img.shields.io/badge/AI-Summary-2ECC71?style=flat-square)

---

## ✨ Features

- **📋 Meetings Library** — Grid of meeting cards with search, date filters, and sort (newest/oldest/longest/shortest)
- **🎙️ Interactive Transcript Viewer** — Synced to audio player with binary search for O(log n) active segment detection
- **🤖 AI-Generated Summaries** — Overview, key topics (collapsible), and chapter timeline with click-to-seek
- **✅ Action Items** — Checklist with optimistic toggle, inline add, assignee badges, and delete-on-hover
- **🔍 Global Search** — Full-text search across all transcript content with highlighted results
- **📝 Full CRUD** — Create, edit, and delete meetings with form validation (react-hook-form + Zod)
- **🎨 Fireflies UI** — Dark theme (#0f0f23), purple accents (#6C5CE7), speaker colors, custom scrollbar
- **🗃️ 5 Seeded Meetings** — Ready on first load with realistic transcript dialogue, summaries, and action items

---

## 🏗️ Architecture

```
┌─────────────────┐     HTTP/REST     ┌─────────────────┐     SQLAlchemy     ┌──────────┐
│   Next.js 16    │ ◄──────────────► │   FastAPI        │ ◄──────────────► │  SQLite   │
│   (Frontend)    │   JSON + CORS    │   (Backend)      │       ORM       │  (DB)     │
│                 │                  │                  │                 │           │
│  React Query    │                  │  Pydantic v2     │                 │  8 Tables │
│  Zustand        │                  │  Services Layer  │                 │  FTS5     │
│  Tailwind CSS   │                  │  File Parsers    │                 │           │
└─────────────────┘                  └─────────────────┘                 └──────────┘
   localhost:3000                       localhost:8000                    meetings.db
```

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Seed the database (creates tables + 5 meetings)
python -m app.seed

# Start the server
python -m uvicorn app.main:app --port 8000 --reload
```

The backend will be running at `http://localhost:8000`.
Verify: `curl http://localhost:8000/health` → `{"status": "ok"}`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set API URL (already configured in .env.local)
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

The frontend will be running at `http://localhost:3000`.

For production build:
```bash
npm run build -- --webpack
npm start
```

---

## 🗄️ Database Schema

8 normalized tables with the `meetings` table as the central hub:

| Table | Key Fields | Purpose |
|-------|-----------|---------|
| **meetings** | id, title, date, duration_seconds, status, audio_url | Core meeting record |
| **transcript_segments** | id, meeting_id, speaker_id, start_time, end_time, content, sequence | Individual transcript lines with timestamps |
| **speakers** | id, meeting_id, label, color | Named speakers with display colors |
| **participants** | id, meeting_id, name, email | Meeting attendees |
| **summaries** | id, meeting_id, overview, key_topics (JSON), chapters (JSON) | AI-generated summary data |
| **action_items** | id, meeting_id, description, assignee, status, due_date | Extracted tasks |
| **highlights** | id, segment_id, color, note | User highlights on transcript segments |
| **tags** | id, meeting_id, name | Topic tags for filtering |

### Relationships
- All tables reference `meetings` via foreign key with `CASCADE` delete
- `transcript_segments` → `speakers` (many-to-one)
- `highlights` → `transcript_segments` (many-to-one)
- `summaries` → `meetings` (one-to-one)

---

## 🔌 API Endpoints

All endpoints prefixed with `/api`. RESTful design throughout.

### Meetings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meetings` | List meetings (filters: search, date_from, date_to, sort_by) |
| POST | `/api/meetings` | Create a meeting with participants and tags |
| GET | `/api/meetings/{id}` | Get meeting with full detail |
| PATCH | `/api/meetings/{id}` | Update meeting metadata |
| DELETE | `/api/meetings/{id}` | Delete meeting (cascade) |

### Transcripts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meetings/{id}/transcript` | Get all segments ordered by sequence |
| POST | `/api/meetings/{id}/upload` | Upload .vtt/.txt/.json transcript file |

### Summaries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meetings/{id}/summary` | Get AI summary |
| POST | `/api/meetings/{id}/summary/generate` | Generate summary from transcript |

### Action Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meetings/{id}/action-items` | List action items |
| POST | `/api/meetings/{id}/action-items` | Create action item |
| PATCH | `/api/action-items/{id}` | Update/toggle action item |
| DELETE | `/api/action-items/{id}` | Delete action item |

### Search & Highlights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=&meeting_id=` | Full-text search across transcripts |
| POST | `/api/highlights` | Create highlight on segment |
| DELETE | `/api/highlights/{id}` | Remove highlight |

---

## 🛠️ Tech Stack

### Frontend
| Library | Purpose |
|---------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type safety across all components |
| **Tailwind CSS v4** | Utility-first styling, Fireflies dark theme |
| **React Query (TanStack)** | Data fetching, caching, optimistic mutations |
| **Zustand** | Lightweight state management (player + UI state) |
| **Axios** | HTTP client for API calls |
| **React Hook Form + Zod** | Form validation for modals |
| **Lucide React** | Icon set |

### Backend
| Library | Purpose |
|---------|---------|
| **FastAPI** | Python REST API framework |
| **SQLAlchemy** | ORM for database access |
| **Alembic** | Database migration management |
| **Pydantic v2** | Request/response validation |
| **SQLite** | Embedded database (zero-config) |
| **python-multipart** | File upload handling |

---

## 🎯 Key Technical Decisions

### Transcript–Player Sync (O(log n))
The HTML5 audio element fires `timeupdate` at ~4Hz. A **binary search** runs through pre-sorted segments to find where `start_time ≤ currentTime < end_time`. The active segment ID is stored in Zustand. The TranscriptViewer subscribes and calls `scrollIntoView({ behavior: "smooth" })`.

### Zustand over Redux
Player state (`currentTime`, `isPlaying`, `activeSegmentId`) is shared between AudioPlayer and TranscriptViewer. Zustand handles this with one store and zero boilerplate.

### React Query for All Data
Mutations auto-invalidate query keys so the UI always reflects server state. Action item checkboxes use optimistic updates for instant feedback.

### Simulated Playback
Since there are no real audio files, the player simulates playback with a `setInterval` at 4Hz, allowing the transcript sync to work fully for demo purposes.

---

## 📝 Assumptions

- **Authentication**: Default user is pre-authenticated (no login flow)
- **Audio**: Placeholder player with simulated playback (no real audio files)
- **Transcription**: Pre-seeded in database (no live recording/transcription)
- **AI Summary**: Mock LLM service generates summaries from transcript content
- **File Upload**: Supports .vtt, .txt, and .json transcript formats

---

## 📁 Project Structure

```
Fireflies-clone/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry, CORS, routers
│   │   ├── database.py          # SQLAlchemy engine + sessions
│   │   ├── seed.py              # Seeds 5 meetings with full data
│   │   ├── models/              # 8 ORM models
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/             # REST API routers
│   │   └── services/            # Business logic (parser, LLM)
│   ├── alembic/                 # Database migrations
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (sidebar + topbar)
│   │   ├── page.tsx             # Redirect to /meetings
│   │   ├── meetings/
│   │   │   ├── page.tsx         # Meetings library
│   │   │   └── [id]/page.tsx    # Meeting detail
│   │   ├── search/page.tsx      # Global search
│   │   └── settings/page.tsx    # Placeholder
│   ├── components/
│   │   ├── layout/              # Sidebar, TopBar
│   │   ├── meetings/            # Cards, Filters, Modals
│   │   ├── transcript/          # TranscriptViewer, SegmentRow
│   │   ├── summary/             # SummaryPanel, ActionItemsPanel
│   │   ├── player/              # AudioPlayer
│   │   └── ui/                  # Button, Modal, Toast, Badge, Input, Skeleton
│   ├── hooks/                   # useMeetings, useTranscript, usePlayer, etc.
│   ├── lib/                     # API client, Zustand store, providers
│   └── types/                   # TypeScript interfaces
└── README.md
```

---

## 🎨 Seeded Meetings

| # | Title | Duration | Participants | Segments |
|---|-------|----------|-------------|----------|
| 1 | Q3 Product Roadmap Review | 62 min | 4 | 45 |
| 2 | Engineering Sprint Planning | 48 min | 5 | 38 |
| 3 | Design Critique | 35 min | 3 | 28 |
| 4 | Customer Success Call | 27 min | 2 | 22 |
| 5 | Team All-Hands | 90 min | 8 | 60 |

---

## 📄 License

MIT