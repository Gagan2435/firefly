from fastapi.testclient import TestClient
from main import app
import seed

client = TestClient(app)

def setup_module(module):
    """Seed the database before tests run."""
    seed.seed_db()

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_get_meetings():
    res = client.get("/api/meetings")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    assert "title" in data[0]
    assert "duration" in data[0]
    assert "action_items_count" in data[0]

def test_get_meeting_detail():
    res = client.get("/api/meetings/1")
    assert res.status_code == 200
    m = res.json()
    assert m["id"] == 1
    assert len(m["transcript_segments"]) > 0
    assert len(m["speakers"]) > 0
    assert len(m["action_items"]) > 0

def test_filter_and_sort_meetings():
    # Filter by tag
    res = client.get("/api/meetings?tag=product")
    assert res.status_code == 200
    data = res.json()
    assert len(data) > 0

    # Sort by duration
    res_dur = client.get("/api/meetings?sort_by=duration&order=desc")
    assert res_dur.status_code == 200
    dur_data = res_dur.json()
    assert dur_data[0]["duration"] >= dur_data[-1]["duration"]

def test_create_meeting_from_text():
    sample_text = """
    [00:00] Alice: Welcome everyone to the quarterly review.
    [00:20] Bob: Thanks Alice. I will make sure to send the final budget report by Friday.
    [00:45] Alice: Sounds great. Can you also review the client onboarding deck?
    """
    payload = {
        "title": "Quarterly Financial Review",
        "transcript_text": sample_text,
        "tags": ["finance", "review"]
    }
    res = client.post("/api/meetings/from-text", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Quarterly Financial Review"
    assert len(data["transcript_segments"]) == 3
    assert len(data["action_items"]) > 0
    assert data["summary"] is not None

def test_action_item_crud():
    # Add action item
    new_item = {
        "text": "Review pull request #123",
        "assignee": "Maya Chen",
        "due_date": "Tomorrow",
        "completed": False
    }
    res = client.post("/api/meetings/1/action-items", json=new_item)
    assert res.status_code == 200
    item = res.json()
    item_id = item["id"]
    assert item["text"] == new_item["text"]

    # Update (complete) action item
    res_up = client.put(f"/api/action-items/{item_id}", json={
        "text": item["text"],
        "assignee": item["assignee"],
        "due_date": item["due_date"],
        "completed": True
    })
    assert res_up.status_code == 200
    assert res_up.json()["completed"] is True

    # Delete action item
    res_del = client.delete(f"/api/action-items/{item_id}")
    assert res_del.status_code == 200

def test_ask_fred_chat():
    res = client.post("/api/meetings/1/chat", json={"question": "What are the action items for this meeting?"})
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert "action items" in data["answer"].lower()

def test_export_meeting():
    res_md = client.get("/api/meetings/1/export?format=md")
    assert res_md.status_code == 200
    assert "# " in res_md.text

    res_txt = client.get("/api/meetings/1/export?format=txt")
    assert res_txt.status_code == 200
    assert "EXECUTIVE SUMMARY:" in res_txt.text

def test_get_all_tasks():
    res = client.get("/api/tasks")
    assert res.status_code == 200
    tasks = res.json()
    assert len(tasks) > 0
    assert "meeting_title" in tasks[0]

if __name__ == "__main__":
    setup_module(None)
    tests = [
        test_health,
        test_get_meetings,
        test_get_meeting_detail,
        test_filter_and_sort_meetings,
        test_create_meeting_from_text,
        test_action_item_crud,
        test_ask_fred_chat,
        test_export_meeting,
        test_get_all_tasks,
    ]
    for t in tests:
        t()
        print(f"[PASS] {t.__name__}")
    print("\nALL 9 BACKEND TESTS PASSED SUCCESSFULLY!")

