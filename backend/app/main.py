from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import meetings, transcripts, summaries, action_items, search, highlights

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fireflies Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
