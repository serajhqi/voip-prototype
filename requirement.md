# VoIP Customer & Call Center Staff Analysis System

## 1. System Overview & Core Philosophy
The system processes VoIP call records and audio to analyze customer behavior, evaluate call center staff performance, and automate post-call follow-ups.
- **Single Source of Truth:** Call events and recordings.
- **Primary Inputs:**
  1. VoIP Call Data (audio recordings, timestamps, caller/callee identifiers, duration).
  2. Administrative Configuration (evaluation criteria, scoring rubrics, tags, rules, prompt guidelines).

---

## 2. Core Entities & Domain Model

### 2.1 Customer
- **Identifiers:** Phone number(s), Customer ID, Name (if identified).
- **Profile Attributes:** Customer needs, purchase willingness/propensity score, effort tier, assigned tags.
- **History:** Chronological call records, past analysis summaries, open and completed follow-up tasks.
- **Lifecycle:** Auto-created upon call completion if no existing customer matches the caller/callee ID.

### 2.2 Staff (Call Center Agent)
- **Identifiers:** Staff ID, extension, name, department/team.
- **Performance Profile:** Aggregated performance scores, strengths, weaknesses, assigned tags.
- **Workload & Tasks:** Assigned follow-ups, scheduled callbacks, open action items.

### 2.3 Call Record (Raw & Processed)
- **Raw Metadata:** Call ID, direction (inbound/outbound), timestamp, duration, staff ID, customer phone/ID, audio file URL/path.
- **Transcription Data:** Full transcript with speaker diarization (Customer vs. Staff) and timestamps.
- **Analysis Data:** Brief summary, sentiment, criteria evaluation scores, extracted tags, detected urgency, recommended next actions.

### 2.4 Administrative Criteria & Rules
- **Evaluation Criteria:** Configurable rubrics to score staff performance (e.g., greeting, empathy, objection handling, clarity, closing).
- **Customer Analysis Criteria:** Purchasing intent signals, churn risk, budget/readiness thresholds.
- **Tagging Rules:** Taxonomy of tags for customers (e.g., `high-value`, `churn-risk`, `technical-issue`) and staff (e.g., `needs-training-closing`, `top-performer`).

### 2.5 Follow-up Task / Action Item
- **Fields:** Task ID, associated Call ID, Customer ID, assigned Staff ID, scheduled due date/time, urgency/priority (High, Medium, Low), action description, status (Pending, In Progress, Completed).

---

## 3. Workflow & Processing Pipeline

### Stage 1: Ingestion & Identification
1. Call event triggers on call creation / termination.
2. Ingest raw metadata: duration, staff identifier, customer phone number, audio recording.
3. Customer identity lookup: match phone number; if unmatched, stage new customer entity creation upon call termination.

### Stage 2: Audio Transcription & Metadata Extraction (Job 1)
1. Dispatch async transcription job.
2. Speech-to-text with speaker diarization (separating staff from customer).
3. Generate initial call brief and structural metadata.
4. Persist transcript and brief linked to Call Record.

### Stage 3: LLM Evaluation & Action Extraction (Job 2)
1. Assemble LLM prompt context:
   - Call transcript & audio metadata.
   - Customer historical profile & past interactions.
   - Staff performance history.
   - Admin-defined evaluation criteria, scoring rubrics, and active tags.
2. Execute LLM analysis to produce structured output:
   - **Call Brief:** Executive summary of the interaction.
   - **Staff Evaluation:** Score per criterion, behavioral tags, coaching points.
   - **Customer Evaluation:** Needs assessment, purchase intent level, urgency rating.
   - **Next Actions:** Scheduled tasks (e.g., "Schedule follow-up call tomorrow at 10:00 AM"), action item deadlines, urgency classification.
3. Persist analysis results, update Customer & Staff profiles, and create scheduled tasks.

---

## 4. Operational Features & User Experience

### 4.1 Real-Time CTI Screen Pop
- On incoming/active call creation, instantly trigger screen pop for the receiving staff member.
- Displayed information:
  - Customer profile and past interaction summary.
  - Historical call logs and previous LLM briefs.
  - Previous sentiment, tags, and open pending tasks.

### 4.2 Staff Task Management & Follow-up Scheduling
- Queue of scheduled tasks prioritized by deadline and urgency.
- Automatic reminder notifications for upcoming callbacks.

### 4.3 Analytics & Reporting Dashboards
- **Staff Performance Dashboard:**
  - Daily, weekly, monthly, and overall performance trends.
  - Workload analysis (call volume, handle time, task completion rate).
  - Descriptive evaluation reports, strengths/weaknesses, and call briefs.
- **Customer Analytics:**
  - Need breakdown and clustering.
  - Purchase willingness & conversion probability.
  - Effort allocation score (determining high-value vs. low-return leads).


