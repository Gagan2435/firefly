from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import database
import models
import schemas
import crud
import ai_engine
import seed

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Fireflies.ai Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok", "app": "Fireflies.ai Clone API"}

@app.get("/api/meetings", response_model=List[schemas.MeetingList])
def get_meetings(
    q: Optional[str] = None, 
    tag: Optional[str] = None, 
    date_filter: Optional[str] = None,
    sort_by: Optional[str] = Query("recency", pattern="^(recency|duration|title)$"),
    order: Optional[str] = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(database.get_db)
):
    return crud.get_meetings(db, query=q, tag=tag, date_filter=date_filter, sort_by=sort_by, order=order)

@app.get("/api/meetings/{id}", response_model=schemas.MeetingDetail)
def get_meeting(id: int, db: Session = Depends(database.get_db)):
    meeting = crud.get_meeting(db, id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

@app.post("/api/meetings", response_model=schemas.MeetingDetail)
def create_meeting(meeting: schemas.MeetingCreate, db: Session = Depends(database.get_db)):
    return crud.create_meeting(db, meeting)

@app.post("/api/meetings/from-text", response_model=schemas.MeetingDetail)
def create_meeting_from_text(payload: schemas.MeetingFromTextCreate, db: Session = Depends(database.get_db)):
    return crud.create_meeting_from_text(db, payload)

@app.post("/api/meetings/upload", response_model=schemas.MeetingDetail)
async def upload_transcript(
    file: UploadFile = File(...), 
    title: Optional[str] = Form(None),
    db: Session = Depends(database.get_db)
):
    contents = await file.read()
    try:
        decoded_text = contents.decode("utf-8")
    except UnicodeDecodeError:
        decoded_text = contents.decode("latin-1")
        
    meeting_title = title or file.filename.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()
    
    payload = schemas.MeetingFromTextCreate(
        title=meeting_title,
        transcript_text=decoded_text,
        tags=["uploaded", "transcript"]
    )
    return crud.create_meeting_from_text(db, payload)

@app.put("/api/meetings/{id}", response_model=schemas.MeetingDetail)
def update_meeting(id: int, updates: schemas.MeetingUpdate, db: Session = Depends(database.get_db)):
    meeting = crud.update_meeting(db, id, updates)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

@app.delete("/api/meetings/{id}")
def delete_meeting(id: int, db: Session = Depends(database.get_db)):
    meeting = crud.delete_meeting(db, id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return {"message": "Meeting deleted successfully"}

# Global Tasks
@app.get("/api/tasks", response_model=List[schemas.TaskItem])
def get_all_tasks(db: Session = Depends(database.get_db)):
    return crud.get_all_tasks(db)

# Action Items
@app.post("/api/meetings/{id}/action-items", response_model=schemas.ActionItem)
def add_action_item(id: int, item: schemas.ActionItemCreate, db: Session = Depends(database.get_db)):
    return crud.add_action_item(db, id, item)

@app.put("/api/action-items/{id}", response_model=schemas.ActionItem)
def update_action_item(id: int, updates: schemas.ActionItemCreate, db: Session = Depends(database.get_db)):
    item = crud.update_action_item(db, id, updates)
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    return item

@app.delete("/api/action-items/{id}")
def delete_action_item(id: int, db: Session = Depends(database.get_db)):
    item = crud.delete_action_item(db, id)
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
    return {"message": "Action item deleted successfully"}

# Transcript Segment Bookmarks / Soundbites
@app.post("/api/segments/{id}/bookmark")
def toggle_bookmark_segment(id: int, db: Session = Depends(database.get_db)):
    seg = crud.toggle_bookmark_segment(db, id)
    if not seg:
        raise HTTPException(status_code=404, detail="Segment not found")
    return {"id": seg.id, "is_bookmarked": seg.is_bookmarked}

# Comments
@app.post("/api/meetings/{id}/comments", response_model=schemas.Comment)
def add_comment(id: int, comment: schemas.CommentCreate, db: Session = Depends(database.get_db)):
    return crud.add_comment(db, id, comment)

@app.get("/api/meetings/{id}/comments", response_model=List[schemas.Comment])
def get_comments(id: int, db: Session = Depends(database.get_db)):
    return crud.get_comments(db, id)

@app.delete("/api/comments/{id}")
def delete_comment(id: int, db: Session = Depends(database.get_db)):
    comment = crud.delete_comment(db, id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return {"message": "Comment deleted successfully"}

# Tags
@app.get("/api/tags", response_model=List[schemas.Tag])
def get_tags(db: Session = Depends(database.get_db)):
    return crud.get_tags(db)

@app.post("/api/meetings/{id}/tags", response_model=schemas.Tag)
def add_tag_to_meeting(id: int, tag: schemas.TagCreate, db: Session = Depends(database.get_db)):
    return crud.add_tag_to_meeting(db, id, tag)

@app.delete("/api/meetings/{meeting_id}/tags/{tag_id}")
def remove_tag_from_meeting(meeting_id: int, tag_id: int, db: Session = Depends(database.get_db)):
    crud.remove_tag_from_meeting(db, meeting_id, tag_id)
    return {"message": "Tag removed successfully"}

# Global Search
@app.get("/api/search", response_model=List[schemas.MeetingList])
def search(q: str, db: Session = Depends(database.get_db)):
    return crud.search_global(db, q)

# AskFred AI Chat
@app.post("/api/meetings/{id}/chat", response_model=schemas.ChatResponse)
def chat(id: int, req: schemas.ChatRequest, db: Session = Depends(database.get_db)):
    meeting = crud.get_meeting(db, id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    result = ai_engine.ask_fred(meeting, req.question)
    return schemas.ChatResponse(answer=result["answer"], sources=result.get("sources", []))

# Export Meeting
@app.get("/api/meetings/{id}/export")
def export_meeting(id: int, format: str = 'txt', db: Session = Depends(database.get_db)):
    meeting = crud.get_meeting(db, id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    date_str = meeting.date.strftime('%B %d, %Y at %I:%M %p')
    participants_str = ", ".join([p.name for p in meeting.participants])
    
    if format == 'md':
        content = f"# {meeting.title}\n\n"
        content += f"**Date:** {date_str}  \n"
        content += f"**Duration:** {meeting.duration // 60} minutes  \n"
        content += f"**Attendees:** {participants_str}  \n\n"
        content += f"## Executive Summary\n{meeting.summary or 'N/A'}\n\n"
        content += f"## Key Topics & Chapters\n{meeting.key_topics or 'N/A'}\n\n"
        content += "## Action Items\n"
        for item in meeting.action_items:
            status = "[x]" if item.completed else "[ ]"
            assignee = f" (@{item.assignee})" if item.assignee else ""
            content += f"- {status} {item.text}{assignee}\n"
        content += "\n## Full Transcript\n\n"
        for seg in meeting.transcript_segments:
            speaker_name = seg.speaker.name if seg.speaker else "Unknown"
            mins = int(seg.start_time // 60)
            secs = int(seg.start_time % 60)
            content += f"**{speaker_name}** `[{mins:02d}:{secs:02d}]`\n>{seg.text}\n\n"
        return PlainTextResponse(content=content, media_type="text/markdown")
        
    else: # txt
        content = f"=========================================\n"
        content += f"{meeting.title.upper()}\n"
        content += f"=========================================\n"
        content += f"Date: {date_str}\n"
        content += f"Duration: {meeting.duration // 60} minutes\n"
        content += f"Attendees: {participants_str}\n\n"
        content += f"EXECUTIVE SUMMARY:\n{meeting.summary or 'N/A'}\n\n"
        content += f"KEY TOPICS:\n{meeting.key_topics or 'N/A'}\n\n"
        content += "ACTION ITEMS:\n"
        for item in meeting.action_items:
            status = "[COMPLETED]" if item.completed else "[PENDING]"
            assignee = f" (Assigned: {item.assignee})" if item.assignee else ""
            content += f"  {status} {item.text}{assignee}\n"
        content += "\nTRANSCRIPT:\n"
        for seg in meeting.transcript_segments:
            speaker_name = seg.speaker.name if seg.speaker else "Unknown"
            mins = int(seg.start_time // 60)
            secs = int(seg.start_time % 60)
            content += f"[{mins:02d}:{secs:02d}] {speaker_name}: {seg.text}\n"
        return PlainTextResponse(content=content, media_type="text/plain")

@app.post("/api/seed")
def reseed_database():
    seed.seed_db()
    return {"message": "Database successfully reseeded with rich meeting data"}
