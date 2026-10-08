from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc, asc
import models
import schemas
from datetime import datetime, timezone
import re
import json
import ai_engine

def get_meetings(
    db: Session, 
    query: str = None, 
    tag: str = None, 
    sort_by: str = "recency", 
    order: str = "desc"
):
    q = db.query(models.Meeting)
    
    if query:
        search_pattern = f"%{query}%"
        q = q.filter(
            or_(
                models.Meeting.title.ilike(search_pattern),
                models.Meeting.summary.ilike(search_pattern),
                models.Meeting.participants.any(models.Participant.name.ilike(search_pattern)),
                models.Meeting.tags.any(models.Tag.name.ilike(search_pattern))
            )
        )
        
    if tag:
        q = q.filter(models.Meeting.tags.any(models.Tag.name == tag))
        
    if sort_by == "duration":
        q = q.order_by(desc(models.Meeting.duration) if order == "desc" else asc(models.Meeting.duration))
    elif sort_by == "title":
        q = q.order_by(asc(models.Meeting.title) if order == "asc" else desc(models.Meeting.title))
    else: # recency / date
        q = q.order_by(desc(models.Meeting.date) if order == "desc" else asc(models.Meeting.date))
        
    meetings = q.all()
    for m in meetings:
        m.action_items_count = len(m.action_items)
    return meetings

def get_meeting(db: Session, meeting_id: int):
    m = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if m:
        m.action_items_count = len(m.action_items)
    return m

def create_meeting(db: Session, meeting: schemas.MeetingCreate):
    db_meeting = models.Meeting(
        title=meeting.title,
        date=meeting.date,
        duration=meeting.duration,
        summary=meeting.summary,
        key_topics=meeting.key_topics,
        audio_url=meeting.audio_url
    )
    
    # Participants
    for p in meeting.participants:
        db_p = db.query(models.Participant).filter(models.Participant.name == p.name).first()
        if not db_p:
            db_p = models.Participant(name=p.name, email=p.email)
            db.add(db_p)
            db.flush()
        db_meeting.participants.append(db_p)
        
    # Tags
    for t_name in meeting.tags:
        clean_tag = t_name.strip().lstrip('#').lower()
        if not clean_tag:
            continue
        db_t = db.query(models.Tag).filter(models.Tag.name == clean_tag).first()
        if not db_t:
            db_t = models.Tag(name=clean_tag)
            db.add(db_t)
            db.flush()
        db_meeting.tags.append(db_t)

    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)

    # Speakers cache
    speakers_map = {}

    # Transcript segments
    for idx, seg in enumerate(meeting.transcript_segments):
        speaker_id = seg.speaker_id
        if not speaker_id and seg.speaker_name:
            if seg.speaker_name not in speakers_map:
                spk = models.Speaker(name=seg.speaker_name, meeting_id=db_meeting.id)
                db.add(spk)
                db.flush()
                speakers_map[seg.speaker_name] = spk.id
            speaker_id = speakers_map[seg.speaker_name]

        db_seg = models.TranscriptSegment(
            meeting_id=db_meeting.id,
            speaker_id=speaker_id,
            start_time=seg.start_time,
            end_time=seg.end_time or (seg.start_time + 5.0),
            text=seg.text,
            order_index=seg.order_index if seg.order_index is not None else idx,
            is_bookmarked=seg.is_bookmarked
        )
        db.add(db_seg)

    # Action items
    for item in meeting.action_items:
        db_item = models.ActionItem(
            meeting_id=db_meeting.id,
            text=item.text,
            assignee=item.assignee,
            due_date=item.due_date,
            completed=item.completed
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_meeting)
    db_meeting.action_items_count = len(db_meeting.action_items)
    return db_meeting

def create_meeting_from_text(db: Session, data: schemas.MeetingFromTextCreate):
    """
    Parses pasted transcript or uploaded transcript text (.txt, .vtt, .json, timestamped format),
    extracts speakers & segments, auto-generates AI summary & action items, and creates meeting.
    """
    text = data.transcript_text.strip()
    segments_to_create = []
    speakers_found = set()

    # Try JSON format first
    try:
        parsed_json = json.loads(text)
        if isinstance(parsed_json, list):
            for i, item in enumerate(parsed_json):
                spk = item.get("speaker") or item.get("speaker_name") or "Speaker 1"
                speakers_found.add(spk)
                segments_to_create.append({
                    "speaker": spk,
                    "start": float(item.get("start_time", item.get("start", i * 6.0))),
                    "end": float(item.get("end_time", item.get("end", (i * 6.0) + 5.0))),
                    "text": item.get("text", "")
                })
    except Exception:
        pass

    # If not JSON, parse lines (supports [00:15] Name: Text or Name: Text)
    if not segments_to_create:
        lines = [line.strip() for line in text.split("\n") if line.strip() and not line.startswith("WEBVTT")]
        current_time = 0.0
        
        for i, line in enumerate(lines):
            # Check timestamp format like [01:23] Speaker: text or 00:01:23 --> 00:01:28
            ts_match = re.search(r"\[?(\d{1,2}):(\d{2})(?::(\d{2}))?\]?", line)
            if ts_match:
                if ts_match.group(3): # hh:mm:ss
                    h, m, s = int(ts_match.group(1)), int(ts_match.group(2)), int(ts_match.group(3))
                    current_time = float(h * 3600 + m * 60 + s)
                else: # mm:ss
                    m, s = int(ts_match.group(1)), int(ts_match.group(2))
                    current_time = float(m * 60 + s)
                line = re.sub(r"^\[?\d{1,2}:\d{2}(?::\d{2})?\]?\s*", "", line)

            # Check speaker name prefix
            speaker_match = re.match(r"^([A-Za-z\s0-9]+):\s*(.+)$", line)
            if speaker_match:
                spk = speaker_match.group(1).strip()
                seg_text = speaker_match.group(2).strip()
            else:
                spk = f"Speaker {(i % 3) + 1}"
                seg_text = line.strip()

            speakers_found.add(spk)
            duration_est = max(3.0, len(seg_text.split()) * 0.4)
            segments_to_create.append({
                "speaker": spk,
                "start": round(current_time, 1),
                "end": round(current_time + duration_est, 1),
                "text": seg_text
            })
            current_time += duration_est + 1.0

    # Auto-generate summary and action items using AI engine
    ai_results = ai_engine.generate_summary_and_actions(text)
    
    total_duration = int(segments_to_create[-1]["end"]) if segments_to_create else 1800
    meeting_date = data.date or datetime.now(timezone.utc)

    db_meeting = models.Meeting(
        title=data.title,
        date=meeting_date,
        duration=total_duration,
        summary=ai_results["summary"],
        key_topics="\n".join(ai_results["key_topics"]),
        audio_url=None
    )
    db.add(db_meeting)

    # Participants
    all_participants = list(set(list(speakers_found) + (data.participants or [])))
    for p_name in all_participants:
        clean_p = p_name.strip()
        if not clean_p:
            continue
        db_p = db.query(models.Participant).filter(models.Participant.name == clean_p).first()
        if not db_p:
            db_p = models.Participant(name=clean_p, email=f"{clean_p.lower().replace(' ', '.')}@example.com")
            db.add(db_p)
            db.flush()
        db_meeting.participants.append(db_p)

    # Tags
    tags_list = data.tags or ["meeting", "ai-notes"]
    for t_name in tags_list:
        clean_tag = t_name.strip().lstrip('#').lower()
        if not clean_tag:
            continue
        db_t = db.query(models.Tag).filter(models.Tag.name == clean_tag).first()
        if not db_t:
            db_t = models.Tag(name=clean_tag)
            db.add(db_t)
            db.flush()
        db_meeting.tags.append(db_t)
    db.commit()
    db.refresh(db_meeting)

    # Speakers
    speakers_map = {}
    for spk_name in speakers_found:
        spk = models.Speaker(name=spk_name, meeting_id=db_meeting.id)
        db.add(spk)
        db.flush()
        speakers_map[spk_name] = spk.id

    # Transcript segments
    for idx, seg in enumerate(segments_to_create):
        db_seg = models.TranscriptSegment(
            meeting_id=db_meeting.id,
            speaker_id=speakers_map.get(seg["speaker"]),
            start_time=seg["start"],
            end_time=seg["end"],
            text=seg["text"],
            order_index=idx,
            is_bookmarked=False
        )
        db.add(db_seg)

    # Action Items
    for item in ai_results["action_items"]:
        db_item = models.ActionItem(
            meeting_id=db_meeting.id,
            text=item["text"],
            assignee=item["assignee"],
            due_date=item.get("due_date", "Next week"),
            completed=False
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_meeting)
    db_meeting.action_items_count = len(db_meeting.action_items)
    return db_meeting

def update_meeting(db: Session, meeting_id: int, updates: schemas.MeetingUpdate):
    db_meeting = get_meeting(db, meeting_id)
    if not db_meeting:
        return None
    if updates.title is not None:
        db_meeting.title = updates.title
    if updates.summary is not None:
        db_meeting.summary = updates.summary
    if updates.key_topics is not None:
        db_meeting.key_topics = updates.key_topics
        
    if updates.participants is not None:
        db_meeting.participants = []
        for p in updates.participants:
            db_p = db.query(models.Participant).filter(models.Participant.name == p.name).first()
            if not db_p:
                db_p = models.Participant(name=p.name, email=p.email)
                db.add(db_p)
                db.flush()
            db_meeting.participants.append(db_p)

    if updates.tags is not None:
        db_meeting.tags = []
        for t_name in updates.tags:
            clean_tag = t_name.strip().lstrip('#').lower()
            if not clean_tag:
                continue
            db_t = db.query(models.Tag).filter(models.Tag.name == clean_tag).first()
            if not db_t:
                db_t = models.Tag(name=clean_tag)
                db.add(db_t)
                db.flush()
            db_meeting.tags.append(db_t)
            
    db.commit()
    db.refresh(db_meeting)
    db_meeting.action_items_count = len(db_meeting.action_items)
    return db_meeting

def delete_meeting(db: Session, meeting_id: int):
    db_meeting = get_meeting(db, meeting_id)
    if db_meeting:
        db.delete(db_meeting)
        db.commit()
    return db_meeting

def get_all_tasks(db: Session):
    action_items = db.query(models.ActionItem).join(models.Meeting).order_by(models.ActionItem.completed.asc(), models.ActionItem.created_at.desc()).all()
    tasks = []
    for item in action_items:
        tasks.append({
            "id": item.id,
            "meeting_id": item.meeting_id,
            "text": item.text,
            "assignee": item.assignee,
            "due_date": item.due_date,
            "completed": item.completed,
            "created_at": item.created_at,
            "meeting_title": item.meeting.title if item.meeting else "Meeting",
            "meeting_date": item.meeting.date if item.meeting else datetime.now(timezone.utc)
        })
    return tasks

def add_action_item(db: Session, meeting_id: int, item: schemas.ActionItemCreate):
    db_item = models.ActionItem(
        meeting_id=meeting_id, 
        text=item.text, 
        assignee=item.assignee, 
        due_date=item.due_date,
        completed=item.completed
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_action_item(db: Session, item_id: int, updates: schemas.ActionItemCreate):
    db_item = db.query(models.ActionItem).filter(models.ActionItem.id == item_id).first()
    if db_item:
        db_item.text = updates.text
        db_item.assignee = updates.assignee
        db_item.due_date = updates.due_date
        db_item.completed = updates.completed
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_action_item(db: Session, item_id: int):
    db_item = db.query(models.ActionItem).filter(models.ActionItem.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

def toggle_bookmark_segment(db: Session, segment_id: int):
    seg = db.query(models.TranscriptSegment).filter(models.TranscriptSegment.id == segment_id).first()
    if seg:
        seg.is_bookmarked = not seg.is_bookmarked
        db.commit()
        db.refresh(seg)
    return seg

def add_comment(db: Session, meeting_id: int, comment: schemas.CommentCreate):
    db_c = models.Comment(
        meeting_id=meeting_id, 
        segment_id=comment.segment_id, 
        text=comment.text, 
        author=comment.author or 'User'
    )
    db.add(db_c)
    db.commit()
    db.refresh(db_c)
    return db_c

def get_comments(db: Session, meeting_id: int):
    return db.query(models.Comment).filter(models.Comment.meeting_id == meeting_id).order_by(models.Comment.created_at.desc()).all()

def delete_comment(db: Session, comment_id: int):
    db_c = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if db_c:
        db.delete(db_c)
        db.commit()
    return db_c

def get_tags(db: Session):
    return db.query(models.Tag).all()

def add_tag_to_meeting(db: Session, meeting_id: int, tag: schemas.TagCreate):
    db_meeting = get_meeting(db, meeting_id)
    clean_name = tag.name.strip().lstrip('#').lower()
    db_tag = db.query(models.Tag).filter(models.Tag.name == clean_name).first()
    if not db_tag:
        db_tag = models.Tag(name=clean_name)
        db.add(db_tag)
        db.flush()
    if db_meeting and db_tag not in db_meeting.tags:
        db_meeting.tags.append(db_tag)
        db.commit()
    return db_tag

def remove_tag_from_meeting(db: Session, meeting_id: int, tag_id: int):
    db_meeting = get_meeting(db, meeting_id)
    if db_meeting:
        db_meeting.tags = [t for t in db_meeting.tags if t.id != tag_id]
        db.commit()

def search_global(db: Session, query: str):
    search_pattern = f"%{query}%"
    meetings = db.query(models.Meeting).filter(
        or_(
            models.Meeting.title.ilike(search_pattern),
            models.Meeting.summary.ilike(search_pattern),
            models.Meeting.key_topics.ilike(search_pattern),
            models.Meeting.transcript_segments.any(models.TranscriptSegment.text.ilike(search_pattern)),
            models.Meeting.action_items.any(models.ActionItem.text.ilike(search_pattern))
        )
    ).all()
    for m in meetings:
        m.action_items_count = len(m.action_items)
    return meetings
