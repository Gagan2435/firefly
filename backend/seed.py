import database
import models
from datetime import datetime, timezone, timedelta

def seed_db():
    print("Dropping and recreating database schema...")
    database.Base.metadata.drop_all(bind=database.engine)
    database.Base.metadata.create_all(bind=database.engine)
    db = database.SessionLocal()
    
    now = datetime.now(timezone.utc)

    # -------------------------------------------------------------
    # Meeting 1: Q3 Product Strategy & AI Copilot Roadmap
    # -------------------------------------------------------------
    m1 = models.Meeting(
        title="Q3 Product Strategy & AI Copilot Roadmap",
        date=now - timedelta(days=1, hours=2),
        duration=1420, # ~23 min 40 sec
        summary="The team reviewed the Q3 AI Copilot roadmap, prioritizing sub-second latency optimization and real-time streaming summaries. Discussed customer feedback from enterprise trials regarding speaker diarization accuracy in noisy boardrooms. Agreed on feature freeze for July 30th and beta rollout on August 15th.",
        key_topics="1. Architecture & Model Latency [00:00]\n2. Enterprise Feedback on Diarization [04:30]\n3. Live Streaming Summaries & Fred Chat [11:15]\n4. Release Timeline & GTM Milestones [18:40]",
        audio_url=None
    )
    db.add(m1)
    db.commit()
    db.refresh(m1)

    p1 = [
        models.Participant(name="Alex Rivers", email="alex.rivers@fireflies-demo.com"),
        models.Participant(name="Maya Chen", email="maya.chen@fireflies-demo.com"),
        models.Participant(name="Liam Smith", email="liam.smith@fireflies-demo.com"),
        models.Participant(name="Jordan Bell", email="jordan.bell@fireflies-demo.com")
    ]
    for p in p1:
        db.add(p)
    db.commit()
    for p in p1:
        m1.participants.append(p)

    tags1 = ["product", "ai-roadmap", "q3-planning"]
    for t_name in tags1:
        t = models.Tag(name=t_name)
        db.add(t)
        db.commit()
        m1.tags.append(t)

    spk_alex = models.Speaker(name="Alex Rivers", meeting_id=m1.id)
    spk_maya = models.Speaker(name="Maya Chen", meeting_id=m1.id)
    spk_liam = models.Speaker(name="Liam Smith", meeting_id=m1.id)
    spk_jordan = models.Speaker(name="Jordan Bell", meeting_id=m1.id)
    for spk in [spk_alex, spk_maya, spk_liam, spk_jordan]:
        db.add(spk)
    db.commit()

    transcript_m1 = [
        (spk_alex.id, 0.0, 18.0, "Welcome everyone. Today we are aligning on our Q3 AI Copilot roadmap. We have three main items: latency reduction, speaker diarization enhancements, and live meeting query capabilities."),
        (spk_maya.id, 19.0, 48.0, "Thanks Alex. On the model latency side, we have benchmarked our speculative decoding pipeline. We reduced time-to-first-token from 820 milliseconds down to 240 milliseconds on our primary GPU cluster."),
        (spk_jordan.id, 49.0, 75.0, "That is a huge improvement Maya. Are we seeing any degradation in summary coherence or factuality with the smaller speculative draft model?"),
        (spk_maya.id, 76.0, 110.0, "Zero degradation. Our verification pass ensures 100% token fidelity. We validated this across 1,500 synthetic meeting transcripts with standard ROUGE and BERT scores."),
        (spk_liam.id, 112.0, 142.0, "From the UX perspective, users in our pilot said the instant response feels like magic. In the new Ask Fred panel, showing citation pills next to answers gave them much higher confidence."),
        (spk_alex.id, 144.0, 178.0, "That's great. What about the enterprise feedback regarding diarization? Acme Corp noted that when two speakers speak over each other, voice segments sometimes get merged."),
        (spk_maya.id, 180.0, 220.0, "Yes, we are integrating PyAnnote 3.1 with custom beamforming heuristics for multi-mic conference rooms. That will roll out in the staging cluster by next Tuesday."),
        (spk_jordan.id, 222.0, 256.0, "I will ensure our QA team has automated regression test suites running against the 40-speaker stress test benchmark."),
        (spk_liam.id, 258.0, 290.0, "I also finalized the new transcript soundbite selector. Users can highlight any text segment and generate a shareable 30-second audio clip with one click."),
        (spk_alex.id, 292.0, 335.0, "Fantastic progress. Let's make sure we hit the July 30th code freeze so we are in prime shape for the August 15th beta rollout. Thanks all!")
    ]

    for idx, (spk_id, start, end, text) in enumerate(transcript_m1):
        seg = models.TranscriptSegment(
            meeting_id=m1.id,
            speaker_id=spk_id,
            start_time=start,
            end_time=end,
            text=text,
            order_index=idx,
            is_bookmarked=(idx in [1, 8])
        )
        db.add(seg)

    m1_actions = [
        models.ActionItem(meeting_id=m1.id, text="Deploy PyAnnote 3.1 diarization updates to staging cluster", assignee="Maya Chen", due_date="Next Tuesday", completed=True),
        models.ActionItem(meeting_id=m1.id, text="Run 40-speaker stress test regression suite in QA", assignee="Jordan Bell", due_date="July 25", completed=False),
        models.ActionItem(meeting_id=m1.id, text="Finalize soundbite share modal interaction specs", assignee="Liam Smith", due_date="July 28", completed=False),
        models.ActionItem(meeting_id=m1.id, text="Prepare GTM beta announcement collateral for August 15 release", assignee="Alex Rivers", due_date="August 5", completed=False)
    ]
    for act in m1_actions:
        db.add(act)

    # -------------------------------------------------------------
    # Meeting 2: Enterprise Client Discovery: Acme Corp Implementation
    # -------------------------------------------------------------
    m2 = models.Meeting(
        title="Enterprise Client Discovery: Acme Corp Implementation",
        date=now - timedelta(days=2, hours=5),
        duration=1860, # 31 min
        summary="Technical discovery session with Acme Corp's IT and Security leadership. Explored single-tenant deployment architecture, HIPAA and SOC2 Type II compliance controls, Active Directory SSO, and historical meeting transcript ingestion.",
        key_topics="1. Acme Infrastructure Requirements [00:00]\n2. Data Governance & Encryption at Rest [05:20]\n3. Custom Company Vocabularies & PII Redaction [13:10]\n4. POC Milestone Planning & Sign-off [22:00]",
        audio_url=None
    )
    db.add(m2)
    db.commit()
    db.refresh(m2)

    p2 = [
        models.Participant(name="Sarah Jenkins", email="sarah.jenkins@fireflies-demo.com"),
        models.Participant(name="David Ross", email="david.ross@fireflies-demo.com"),
        models.Participant(name="Elena Rostova", email="elena.rostova@acmecorp-demo.com"),
        models.Participant(name="Marcus Vance", email="marcus.vance@acmecorp-demo.com")
    ]
    for p in p2:
        db.add(p)
    db.commit()
    for p in p2:
        m2.participants.append(p)

    tags2 = ["sales", "enterprise", "security", "discovery"]
    for t_name in tags2:
        t = db.query(models.Tag).filter(models.Tag.name == t_name).first()
        if not t:
            t = models.Tag(name=t_name)
            db.add(t)
            db.commit()
        m2.tags.append(t)

    spk_sarah = models.Speaker(name="Sarah Jenkins", meeting_id=m2.id)
    spk_david = models.Speaker(name="David Ross", meeting_id=m2.id)
    spk_elena = models.Speaker(name="Elena Rostova", meeting_id=m2.id)
    spk_marcus = models.Speaker(name="Marcus Vance", meeting_id=m2.id)
    for spk in [spk_sarah, spk_david, spk_elena, spk_marcus]:
        db.add(spk)
    db.commit()

    transcript_m2 = [
        (spk_sarah.id, 0.0, 16.0, "Good morning Elena and Marcus. Thank you for joining us today. We want to dive deep into Acme's specific architecture needs for our enterprise rollout."),
        (spk_elena.id, 17.0, 44.0, "Thanks Sarah. We currently have 4,200 knowledge workers across North America and Europe. Security and data isolation are our non-negotiable criteria."),
        (spk_marcus.id, 45.0, 82.0, "Specifically Marcus Vance here from InfoSec. We require AES-256 encryption at rest, customer-managed KMS keys, and strict guarantee that our audio and transcripts are never used for foundational model retraining."),
        (spk_david.id, 83.0, 125.0, "Understood Marcus. In our Enterprise Tier, all customer data is logically isolated in dedicated VPC tenancies with zero retention policies for raw audio post-transcription unless explicitly opted in."),
        (spk_marcus.id, 126.0, 155.0, "That aligns with our standard vendor checklist. What about automated PII and PHI masking on generated summaries?"),
        (spk_david.id, 156.0, 192.0, "We offer real-time NER filters that automatically redact credit cards, SSNs, phone numbers, and custom regex-defined entity strings before summaries are persisted."),
        (spk_elena.id, 194.0, 230.0, "That's excellent. We also want to import 6 months of historical Zoom cloud recordings so our teams have immediate searchable context."),
        (spk_sarah.id, 232.0, 268.0, "We have a batch migration CLI and OAuth connector for Zoom that can ingest up to 10,000 meeting hours over a weekend without throttling."),
        (spk_elena.id, 270.0, 305.0, "Wonderful. Let's schedule the 30-day proof of concept kickoff for next Monday with our core product engineering team.")
    ]

    for idx, (spk_id, start, end, text) in enumerate(transcript_m2):
        seg = models.TranscriptSegment(
            meeting_id=m2.id,
            speaker_id=spk_id,
            start_time=start,
            end_time=end,
            text=text,
            order_index=idx,
            is_bookmarked=(idx in [2, 5])
        )
        db.add(seg)

    m2_actions = [
        models.ActionItem(meeting_id=m2.id, text="Send SOC2 Type II report and KMS encryption whitepaper to Marcus", assignee="David Ross", due_date="Tomorrow", completed=True),
        models.ActionItem(meeting_id=m2.id, text="Draft 30-day Enterprise POC agreement with 50-seat trial scope", assignee="Sarah Jenkins", due_date="Friday", completed=False),
        models.ActionItem(meeting_id=m2.id, text="Provide Acme Zoom tenant admin credentials for sandbox connection", assignee="Elena Rostova", due_date="Next Monday", completed=False)
    ]
    for act in m2_actions:
        db.add(act)

    # -------------------------------------------------------------
    # Meeting 3: Weekly Engineering Standup & Incident Review
    # -------------------------------------------------------------
    m3 = models.Meeting(
        title="Weekly Engineering Standup & Incident Review",
        date=now - timedelta(days=3, hours=1),
        duration=1320, # 22 min
        summary="Engineering standup addressing the Tuesday webhook queue backlog. Root cause was traced to a Redis Sentinel failover timeout under burst load. Action items assigned to implement exponential jitter backoff and Redis connection pool warming.",
        key_topics="1. Incident Post-Mortem Timeline [00:00]\n2. Webhook Dispatch Architecture & Bottlenecks [04:45]\n3. Circuit Breaker Implementation [10:15]\n4. Sprint Deliverables Status [16:00]",
        audio_url=None
    )
    db.add(m3)
    db.commit()
    db.refresh(m3)

    p3 = [
        models.Participant(name="Jordan Bell", email="jordan.bell@fireflies-demo.com"),
        models.Participant(name="Maya Chen", email="maya.chen@fireflies-demo.com"),
        models.Participant(name="Priya Patel", email="priya.patel@fireflies-demo.com"),
        models.Participant(name="Kevin Zhao", email="kevin.zhao@fireflies-demo.com")
    ]
    for p in p3:
        existing = db.query(models.Participant).filter(models.Participant.name == p.name).first()
        if not existing:
            db.add(p)
            db.commit()
            m3.participants.append(p)
        else:
            m3.participants.append(existing)

    tags3 = ["engineering", "incident", "standup", "infrastructure"]
    for t_name in tags3:
        t = db.query(models.Tag).filter(models.Tag.name == t_name).first()
        if not t:
            t = models.Tag(name=t_name)
            db.add(t)
            db.commit()
        m3.tags.append(t)

    spk_jordan3 = models.Speaker(name="Jordan Bell", meeting_id=m3.id)
    spk_priya = models.Speaker(name="Priya Patel", meeting_id=m3.id)
    spk_kevin = models.Speaker(name="Kevin Zhao", meeting_id=m3.id)
    for spk in [spk_jordan3, spk_priya, spk_kevin]:
        db.add(spk)
    db.commit()

    transcript_m3 = [
        (spk_jordan3.id, 0.0, 15.0, "Alright team, let's start with the review of the webhook delay incident from Tuesday 14:00 UTC."),
        (spk_priya.id, 16.0, 52.0, "I analyzed the Prometheus traces. The primary Redis instance experienced a high memory spike, which triggered a Sentinel node election. During the 12-second failover window, incoming webhooks accumulated in memory."),
        (spk_kevin.id, 53.0, 88.0, "When the new master node came online, the worker pool flooded it simultaneously, causing connection pool exhaustion and a cascading retry loop."),
        (spk_jordan3.id, 89.0, 118.0, "Clear root cause. What safeguards are we putting in place so this cannot happen during our high-traffic US morning peaks?"),
        (spk_kevin.id, 119.0, 155.0, "I've drafted a pull request introducing exponential backoff with full jitter on Celery tasks, plus a rate limiter capped at 1,200 dispatches per second per queue."),
        (spk_priya.id, 156.0, 190.0, "On the infrastructure side, I'm upgrading our Redis cluster to AWS ElastiCache multi-AZ with automatic failover time under 2 seconds."),
        (spk_jordan3.id, 192.0, 225.0, "Awesome. Kevin, get that PR merged today after peer review. Let's do a load test on staging tomorrow afternoon.")
    ]

    for idx, (spk_id, start, end, text) in enumerate(transcript_m3):
        seg = models.TranscriptSegment(
            meeting_id=m3.id,
            speaker_id=spk_id,
            start_time=start,
            end_time=end,
            text=text,
            order_index=idx,
            is_bookmarked=(idx == 4)
        )
        db.add(seg)

    m3_actions = [
        models.ActionItem(meeting_id=m3.id, text="Review and merge Celery exponential backoff pull request #482", assignee="Kevin Zhao", due_date="Today 5 PM", completed=True),
        models.ActionItem(meeting_id=m3.id, text="Complete ElastiCache multi-AZ migration on production", assignee="Priya Patel", due_date="Thursday", completed=False),
        models.ActionItem(meeting_id=m3.id, text="Conduct synthetic load testing with 5,000 concurrent webhooks", assignee="Priya Patel", due_date="Friday", completed=False)
    ]
    for act in m3_actions:
        db.add(act)

    # -------------------------------------------------------------
    # Meeting 4: UI/UX Design Sprint: Mobile App Redesign
    # -------------------------------------------------------------
    m4 = models.Meeting(
        title="UI/UX Design Sprint: Mobile App Redesign",
        date=now - timedelta(days=4, hours=3),
        duration=2280, # 38 min
        summary="Liam presented high-fidelity prototypes for the upcoming Fireflies iOS and Android apps. Highlights include bottom-sheet transcript controls, scrubbable waveform audio player, and swipe gestures to save soundbites.",
        key_topics="1. Mobile Transcript Navigation [00:00]\n2. Waveform Scrubber & Haptics [08:30]\n3. Soundbite Bookmarking & Sharing [17:00]\n4. Design Tokens & Dark Theme [27:10]",
        audio_url=None
    )
    db.add(m4)
    db.commit()
    db.refresh(m4)

    p4 = [
        models.Participant(name="Liam Smith", email="liam.smith@fireflies-demo.com"),
        models.Participant(name="Alex Rivers", email="alex.rivers@fireflies-demo.com"),
        models.Participant(name="Chloe Dubois", email="chloe.dubois@fireflies-demo.com")
    ]
    for p in p4:
        existing = db.query(models.Participant).filter(models.Participant.name == p.name).first()
        if not existing:
            db.add(p)
            db.commit()
            m4.participants.append(p)
        else:
            m4.participants.append(existing)

    tags4 = ["design", "mobile", "ui-ux", "prototypes"]
    for t_name in tags4:
        t = db.query(models.Tag).filter(models.Tag.name == t_name).first()
        if not t:
            t = models.Tag(name=t_name)
            db.add(t)
            db.commit()
        m4.tags.append(t)

    spk_liam4 = models.Speaker(name="Liam Smith", meeting_id=m4.id)
    spk_alex4 = models.Speaker(name="Alex Rivers", meeting_id=m4.id)
    spk_chloe = models.Speaker(name="Chloe Dubois", meeting_id=m4.id)
    for spk in [spk_liam4, spk_alex4, spk_chloe]:
        db.add(spk)
    db.commit()

    transcript_m4 = [
        (spk_liam4.id, 0.0, 24.0, "Hey team! Today we are looking at the v2 mobile experience. The main goal was making transcript skimming frictionless on 6-inch screens."),
        (spk_chloe.id, 25.0, 58.0, "Love the new bottom scrubber. On mobile, users don't want to tap tiny text to seek audio; they want a sticky waveform bar at the bottom with thumb-friendly controls."),
        (spk_alex4.id, 59.0, 94.0, "Agreed. What about the soundbite clipping workflow? On desktop we have a right-click menu, but how does that translate to mobile touch?"),
        (spk_liam4.id, 95.0, 134.0, "We added a swipe-right gesture on any transcript line. Swiping right highlights the segment and immediately displays a floating snackbar saying 'Soundbite saved to Notebook' with an instant share link."),
        (spk_chloe.id, 135.0, 168.0, "That feels super native and snappy. We should also add subtle haptic feedback when the swipe threshold is crossed."),
        (spk_alex4.id, 170.0, 210.0, "Approved. Let's hand off the Figma component library to the React Native team so they can begin building the design system tokens.")
    ]

    for idx, (spk_id, start, end, text) in enumerate(transcript_m4):
        seg = models.TranscriptSegment(
            meeting_id=m4.id,
            speaker_id=spk_id,
            start_time=start,
            end_time=end,
            text=text,
            order_index=idx,
            is_bookmarked=(idx == 3)
        )
        db.add(seg)

    m4_actions = [
        models.ActionItem(meeting_id=m4.id, text="Export Figma design tokens for typography, spacing, and colors", assignee="Liam Smith", due_date="Wednesday", completed=True),
        models.ActionItem(meeting_id=m4.id, text="Implement haptic vibration engine for transcript gesture actions", assignee="Chloe Dubois", due_date="Next Monday", completed=False),
        models.ActionItem(meeting_id=m4.id, text="Schedule user testing session with 10 beta mobile testers", assignee="Alex Rivers", due_date="Next Friday", completed=False)
    ]
    for act in m4_actions:
        db.add(act)

    # -------------------------------------------------------------
    # Meeting 5: Executive Briefing: H1 Revenue & Growth Trajectory
    # -------------------------------------------------------------
    m5 = models.Meeting(
        title="Executive Briefing: H1 Revenue & Growth Trajectory",
        date=now - timedelta(days=6, hours=4),
        duration=1680, # 28 min
        summary="C-suite quarterly review discussing H1 revenue performance, net revenue retention (134%), and expansion of enterprise licensing tiers. Approved capital allocation for expanding our dedicated inference GPU cluster.",
        key_topics="1. Financial Performance & ARR Milestones [00:00]\n2. Enterprise Cohort Retention & NRR [06:40]\n3. GPU Infrastructure Capital Expenditure [14:15]\n4. H2 Strategic Goals & Headcount [21:00]",
        audio_url=None
    )
    db.add(m5)
    db.commit()
    db.refresh(m5)

    p5 = [
        models.Participant(name="Rachel Vance", email="rachel.vance@fireflies-demo.com"),
        models.Participant(name="Carlos Gomez", email="carlos.gomez@fireflies-demo.com"),
        models.Participant(name="Alex Rivers", email="alex.rivers@fireflies-demo.com")
    ]
    for p in p5:
        existing = db.query(models.Participant).filter(models.Participant.name == p.name).first()
        if not existing:
            db.add(p)
            db.commit()
            m5.participants.append(p)
        else:
            m5.participants.append(existing)

    tags5 = ["executive", "leadership", "financials", "strategy"]
    for t_name in tags5:
        t = db.query(models.Tag).filter(models.Tag.name == t_name).first()
        if not t:
            t = models.Tag(name=t_name)
            db.add(t)
            db.commit()
        m5.tags.append(t)

    spk_rachel = models.Speaker(name="Rachel Vance", meeting_id=m5.id)
    spk_carlos = models.Speaker(name="Carlos Gomez", meeting_id=m5.id)
    spk_alex5 = models.Speaker(name="Alex Rivers", meeting_id=m5.id)
    for spk in [spk_rachel, spk_carlos, spk_alex5]:
        db.add(spk)
    db.commit()

    transcript_m5 = [
        (spk_rachel.id, 0.0, 20.0, "Good morning Alex and Carlos. Let's review the H1 numbers and discuss how we allocate capital for the upcoming half."),
        (spk_carlos.id, 21.0, 58.0, "We closed H1 at 18% above revenue forecast. Annual Recurring Revenue reached $24.8M, driven primarily by mid-market account expansions upgrading to the AI Copilot add-on."),
        (spk_alex5.id, 59.0, 92.0, "The adoption curve on Ask Fred has been extraordinary. Teams that use Ask Fred daily show a 94% retention rate at the 6-month mark."),
        (spk_rachel.id, 93.0, 126.0, "That is compelling data. Carlos, what is our projected runway if we expand our H100 GPU cluster reserve by another 48 nodes?"),
        (spk_carlos.id, 127.0, 160.0, "Even with that CapEx commitment, our cash runway extends beyond 32 months given our positive operating cash flow."),
        (spk_rachel.id, 162.0, 198.0, "Approved. Alex, work with engineering to finalize the GPU contract, and let's present these numbers to the board next Thursday.")
    ]

    for idx, (spk_id, start, end, text) in enumerate(transcript_m5):
        seg = models.TranscriptSegment(
            meeting_id=m5.id,
            speaker_id=spk_id,
            start_time=start,
            end_time=end,
            text=text,
            order_index=idx,
            is_bookmarked=(idx == 1)
        )
        db.add(seg)

    m5_actions = [
        models.ActionItem(meeting_id=m5.id, text="Finalize 48-node H100 GPU reserved instance procurement", assignee="Alex Rivers", due_date="Next Wednesday", completed=False),
        models.ActionItem(meeting_id=m5.id, text="Prepare board slide deck with H1 ARR and cohort retention curves", assignee="Carlos Gomez", due_date="Next Tuesday", completed=False),
        models.ActionItem(meeting_id=m5.id, text="Send shareholder quarterly investor letter", assignee="Rachel Vance", due_date="August 1", completed=False)
    ]
    for act in m5_actions:
        db.add(act)

    # Add sample comments on transcripts
    c1 = models.Comment(meeting_id=m1.id, segment_id=2, text="Crucial latency metric - let's feature this in the engineering blog!", author="Alex Rivers")
    c2 = models.Comment(meeting_id=m2.id, segment_id=12, text="Verify whether Acme requires EU data residency or if US-East is sufficient.", author="Sarah Jenkins")
    db.add(c1)
    db.add(c2)

    db.commit()
    db.close()
    print("Database successfully seeded with 5 rich meetings, full transcripts, action items, tags, and comments!")

if __name__ == "__main__":
    seed_db()
