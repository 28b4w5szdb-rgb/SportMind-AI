# SportMind AI - PRD Part 3: User Workflows & Business Rules

**Complete workflows for every user type, AI interactions, and business rules**

---

## Table of Contents

1. [Scientific Workflow for Sports Scientists](#scientific-workflow-for-sports-scientists)
2. [Scientific Workflow for Coaches](#scientific-workflow-for-coaches)
3. [Scientific Workflow for Athletes](#scientific-workflow-for-athletes)
4. [Scientific Workflow for Researchers](#scientific-workflow-for-researchers)
5. [Physiotherapist Workflow](#physiotherapist-workflow)
6. [Organization Admin Workflow](#organization-admin-workflow)
7. [AI Interaction Flows](#ai-interaction-flows)
8. [Business Rules](#business-rules)
9. [Notification Behavior](#notification-behavior)
10. [Export Workflows](#export-workflows)
11. [Search & Filtering Behavior](#search--filtering-behavior)

---

## Scientific Workflow for Sports Scientists

### Daily Workflow

```
Morning Routine
   │
   ▼
Open App → Dashboard
   │
   ├─ Review overnight alerts
   ├─ Check athletes flagged for concern
   ├─ Review scheduled tests for the day
   └─ Check AI-generated overnight insights
   │
   ▼
Pre-Testing Preparation
   │
   ├─ Verify equipment status
   ├─ Review test protocols (SKB)
   ├─ Confirm athlete attendance
   └─ Check environmental conditions
   │
   ▼
Testing Session
   │
   ├─ Open Test Execution screen
   ├─ Select test type
   ├─ Record environmental conditions
   ├─ Execute test with each athlete
   ├─ Real-time data entry
   ├─ SIE validates data quality
   └─ Complete tests
   │
   ▼
Post-Testing Analysis
   │
   ├─ Review results (SIE-calculated)
   ├─ Compare to norms
   ├─ Consult AI Sports Scientist for insights
   ├─ Identify anomalies
   └─ Document observations
   │
   ▼
Reporting & Communication
   │
   ├─ Generate athlete/team reports
   ├─ Share with coaching staff
   ├─ Update athlete baselines
   └─ Schedule follow-up tests
   │
   ▼
Research Contribution (Optional)
   │
   ├─ Add anonymized data to studies
   ├─ Update ongoing research
   └─ Publish findings
```

### Weekly Workflow

**Monday**: Week planning
- Review upcoming testing schedule
- Confirm equipment availability
- Prepare testing protocols

**Mid-week**: Testing execution
- Perform scheduled tests
- Real-time data collection
- Preliminary analysis

**Friday**: Analysis & reporting
- Compile weekly test results
- Generate team performance report
- Share insights with coaches
- Update long-term trends

### Monthly Workflow

- Comprehensive team performance review
- Longitudinal analysis
- Norm comparisons
- Progress reports to admin
- Research contributions

### Key Screens Used
- Dashboard
- Athletes List/Detail
- Performance Tests (Create/Execute/Results)
- Performance Lab (Analytics)
- Reports Builder
- AI Sports Scientist Chat
- Research Portal

### Scientific Rigor Requirements
- All tests follow SKB protocols
- Environmental conditions documented
- Data validated by SIE before saving
- AI insights include XAI explanations
- All calculations traceable to sources
- Peer review for critical findings

---

## Scientific Workflow for Coaches

### Match Preparation Workflow

```
7 Days Before Match
   │
   ▼
Review Team Status
   │
   ├─ Check athletes' readiness scores
   ├─ Review injury reports
   ├─ Analyze recent performance data
   └─ Consult AI Coach for insights
   │
   ▼
Load Management (Week Structure)
   │
   ├─ Day 7: High intensity (MD-7)
   ├─ Day 5: Tactical (MD-5)
   ├─ Day 3: Team preparation (MD-3)
   ├─ Day 2: Light session (MD-2)
   ├─ Day 1: Activation (MD-1)
   └─ Match Day
   │
   ▼
Individual Preparation
   │
   ├─ Adjust for each player's condition
   ├─ Personalize warm-ups
   ├─ Address injury concerns
   └─ Mental preparation
   │
   ▼
AI Coach Consultation
   │
   ├─ Get evidence-based recommendations
   ├─ Review alternative approaches
   ├─ Understand XAI explanations
   └─ Make informed decisions
   │
   ▼
Communicate Plan
   │
   ├─ Share with coaching staff
   ├─ Brief physiotherapy team
   ├─ Inform sports scientists
   └─ Team meeting
```

### Daily Coaching Workflow

**Morning**:
- Review athletes' wellness surveys
- Check who's ready vs. needs attention
- Adjust day's session accordingly

**Session Planning**:
- Design session based on periodization
- Consider recent load (ACWR)
- Individual modifications
- AI Coach validates plan

**During Session**:
- Live session recording
- RPE collection post-session
- Note observations
- Adjust in real-time

**Post-Session**:
- Complete session records
- Review athlete responses
- Plan next session
- AI Coach analyzes session

### Post-Match Workflow

```
Immediately After Match
   │
   ├─ Record match load (via GPS/monitors)
   ├─ Collect athlete RPE
   ├─ Note injuries or issues
   └─ Brief post-match debrief
   │
   ▼
Recovery Planning
   │
   ├─ Individual recovery needs
   ├─ Wellness monitoring
   ├─ Coordinate with physio
   └─ Plan recovery sessions
   │
   ▼
Next-Day Analysis
   │
   ├─ Full match analysis
   ├─ Individual performances
   ├─ Compare to game plan
   └─ Extract learnings
   │
   ▼
Weekly Review
   │
   ├─ Team performance trends
   ├─ Player development
   ├─ Load management
   └─ Plan next week
```

### Key Screens Used
- Dashboard (team overview)
- Athletes (roster management)
- Training Sessions (planning & recording)
- Performance Lab (team analytics)
- AI Coach (primary tool)
- Reports (share with staff)

### Coach Decision Framework
1. Query AI Coach with context
2. Review XAI explanation
3. Cross-check with SIE data
4. Consider athlete individual factors
5. Make informed decision
6. Monitor outcomes
7. Feedback loop to AI

---

## Scientific Workflow for Athletes

### Daily Workflow

```
Morning Routine
   │
   ▼
Wellness Check-In
   │
   ├─ Sleep quality survey
   ├─ Fatigue level (1-10)
   ├─ Muscle soreness
   ├─ Mood
   ├─ Stress
   └─ Submit wellness score
   │
   ▼
Review Daily Plan
   │
   ├─ Today's training session
   ├─ Personal focus areas
   ├─ Recovery recommendations
   └─ Nutrition guidance (future)
   │
   ▼
Training Session
   │
   ├─ Attend session
   ├─ Give effort
   └─ Post-session RPE
   │
   ▼
Post-Training
   │
   ├─ Submit RPE (0-10)
   ├─ Add notes if needed
   ├─ Review AI recovery advice
   └─ Log recovery activities
   │
   ▼
Evening
   │
   ├─ Sleep tracking
   ├─ Recovery activities
   └─ Prepare for tomorrow
```

### Weekly Workflow

- Review personal performance trends
- Set weekly goals
- Communicate with coaches
- Consult AI Coach for personal questions
- Track compliance with recommendations

### Monthly Workflow

- Review long-term progress
- Update career goals
- Read personal reports
- Provide feedback to coaching staff

### Key Screens Used (Simplified UI)
- Dashboard (personal)
- Personal Performance
- AI Coach (personal assistant)
- Wellness Surveys
- Training Schedule
- Personal Reports

### Athlete-Specific Considerations
- Simplified language (not overly technical)
- Motivational tone
- Educational content
- Age-appropriate (youth vs. senior)
- Cultural sensitivity
- Privacy controls

---

## Scientific Workflow for Researchers

### Study Design Workflow

```
Research Idea
   │
   ▼
Literature Review
   │
   ├─ AI Research Assistant search
   ├─ SKB literature access
   ├─ External databases
   └─ Identify research gap
   │
   ▼
Study Design
   │
   ├─ Hypotheses
   ├─ Methodology
   ├─ Sample size calculation
   ├─ Ethical considerations
   └─ Data collection plan
   │
   ▼
Ethics Approval
   │
   ├─ Submit IRB application
   ├─ Consent form design
   ├─ Institutional review
   └─ Approval obtained
   │
   ▼
Study Setup in Platform
   │
   ├─ Create research project
   ├─ Configure data collection
   ├─ Define inclusion/exclusion
   └─ Set up consent workflow
```

### Data Collection Workflow

```
Participant Recruitment
   │
   ├─ Identify eligible athletes
   ├─ Obtain informed consent
   ├─ Enroll in study
   └─ Track enrollment progress
   │
   ▼
Data Collection Period
   │
   ├─ Schedule tests per protocol
   ├─ Ensure protocol adherence
   ├─ Monitor data quality
   ├─ Handle dropouts
   └─ Interim analysis
   │
   ▼
Data Analysis
   │
   ├─ Anonymize dataset
   ├─ Statistical analysis (AI Statistics Analyst)
   ├─ Verify findings
   └─ Draw conclusions
   │
   ▼
Publication
   │
   ├─ Write manuscript
   ├─ Peer review
   ├─ Journal submission
   └─ Publication
```

### Key Screens Used
- Research Portal (dedicated interface)
- Study Management
- Data Collection Tools
- Analysis Workbench
- AI Research Assistant
- AI Statistics Analyst
- Anonymized Data Access
- Publication Tracker

### Research-Specific Requirements
- IRB workflow support
- Consent management
- Data anonymization
- Statistical rigor
- Publication support
- Cross-institutional collaboration
- GDPR/HIPAA compliance

---

## Physiotherapist Workflow

### Injury Assessment Workflow

```
Injury Reported
   │
   ▼
Initial Assessment
   │
   ├─ Physical examination
   ├─ Injury classification (SKB reference)
   ├─ Severity grading
   ├─ Photo documentation
   └─ Immediate treatment
   │
   ▼
Documentation
   │
   ├─ Create injury record
   ├─ Update athlete status
   ├─ Notify coach and admin
   └─ Estimate recovery time (AI Recovery Expert)
   │
   ▼
Recovery Plan
   │
   ├─ Design rehabilitation protocol
   ├─ Set milestones
   ├─ Schedule check-ins
   └─ Coordinate with medical team
   │
   ▼
Rehabilitation Progression
   │
   ├─ Daily/weekly assessments
   ├─ Objective testing
   ├─ Adjust plan based on progress
   └─ Track pain and function
   │
   ▼
Return-to-Play Decision
   │
   ├─ Full physical assessment
   ├─ Sport-specific testing
   ├─ Psychological readiness
   ├─ Coach consultation
   ├─ AI Recovery Expert review
   └─ Clearance decision
   │
   ▼
Post-RTP Monitoring
   │
   ├─ Enhanced monitoring
   ├─ Gradual return to load
   ├─ Prevent re-injury
   └─ Regular check-ins
```

### Daily Wellness Monitoring

- Review overnight wellness surveys
- Identify concerning trends
- Meet with flagged athletes
- Coordinate with coaches
- Adjust training loads

### Key Screens Used
- Medical Records (restricted)
- Athlete Medical Tab
- Injury Management
- Recovery Plans
- AI Recovery Expert
- Wellness Monitoring
- Return-to-Play Protocols

---

## Organization Admin Workflow

### Onboarding New Organization

```
Initial Setup
   │
   ├─ Configure organization profile
   ├─ Upload branding assets
   ├─ Configure white-label settings
   ├─ Set up subscription
   └─ Configure preferences
   │
   ▼
User Management
   │
   ├─ Invite staff members
   ├─ Assign roles
   ├─ Configure permissions
   └─ Verify all onboarded
   │
   ▼
Team Structure
   │
   ├─ Create teams
   ├─ Assign coaches
   ├─ Set up positions
   └─ Configure schedules
   │
   ▼
Athlete Import
   │
   ├─ Bulk import athletes (CSV)
   ├─ Assign to teams
   ├─ Set baselines
   └─ Verify data
   │
   ▼
Testing Setup
   │
   ├─ Configure test protocols
   ├─ Set up equipment
   ├─ Schedule initial tests
   └─ Establish baselines
   │
   ▼
Go Live
   │
   ├─ Final review
   ├─ Staff training
   ├─ Support setup
   └─ Launch operations
```

### Daily/Weekly Admin Tasks

- Monitor system usage
- Review audit logs
- Handle user requests
- Approve report exports (if configured)
- Manage subscriptions
- Configure integrations
- Review analytics dashboards

### Key Screens Used
- Executive Dashboard
- User Management
- Team Management (org-wide)
- Analytics & BI
- Settings (org-level)
- Subscription & Billing
- Audit Logs
- Integrations (Plugins)

---

## AI Interaction Flows

### Standard AI Query Flow

```
User Query Input
   │
   ▼
Query Analysis
   │
   ├─ Language detection
   ├─ Intent classification
   ├─ Entity extraction
   └─ Context gathering
   │
   ▼
Agent Selection
   │
   ├─ Route to appropriate specialist
   └─ Or multi-agent orchestration
   │
   ▼
Context Preparation
   │
   ├─ Fetch relevant data
   ├─ Query SIE for calculations
   ├─ Query SKB for scientific backing
   └─ Prepare prompt
   │
   ▼
AI Processing
   │
   ├─ Model invocation
   ├─ Response generation
   └─ Streaming to UI
   │
   ▼
Response Validation
   │
   ├─ SIE compliance check
   ├─ SKB citation verification
   ├─ Safety check
   └─ XAI metadata generation
   │
   ▼
Response Delivery
   │
   ├─ Formatted response
   ├─ Interactive elements
   ├─ Charts/tables
   └─ XAI accessible
   │
   ▼
User Feedback (Optional)
   │
   ├─ Thumbs up/down
   ├─ Rating
   ├─ Follow-up questions
   └─ Report issues
```

### Multi-Agent Collaboration Flow

```
Complex Query Received
Example: "Design training plan for injured player return"
   │
   ▼
Query Router identifies multi-agent need
   │
   ▼
Orchestration Sequence:
   │
   ├─ Recovery Expert
   │   └─ Analyze injury status
   │
   ├─ Performance Analyst
   │   └─ Current fitness level
   │
   ├─ Sports Scientist
   │   └─ Evidence-based methodology
   │
   └─ AI Coach
       └─ Synthesize into plan
   │
   ▼
Consolidated Response
   ├─ Recovery-informed plan
   ├─ Evidence-backed
   ├─ Coach-actionable
   └─ Multi-agent contributions labeled
```

### Automated AI Triggers

**Overnight Batch Processing**:
- Analyze day's collected data
- Generate insights for morning review
- Flag concerning patterns
- Prepare briefings for coaches

**Post-Test Analysis**:
- Automatic analysis when test saved
- Notify tester with insights
- Update athlete profile
- Suggest follow-up actions

**Injury Risk Alerts**:
- Monitor ACWR daily
- Alert on high-risk scores
- Suggest interventions
- Notify relevant staff

**Weekly Reports**:
- Auto-generated team reports
- Email delivery
- Highlight changes
- AI executive summary

---

## Business Rules

### Data Business Rules

**Athlete Creation**:
- Athlete must have team assignment
- Minor athletes (< 18) require guardian consent
- Duplicate detection based on name + DOB
- Cannot delete athlete with performance data (archive only)

**Performance Testing**:
- Test data validated by SIE before save
- Environmental conditions required for outdoor tests
- Cannot retroactively edit test data > 24 hours old
- All tests require certified conductor
- Data quality score must be > 60% to save

**Training Sessions**:
- Sessions require at least one athlete
- Cannot create sessions in the past (unless authorized)
- Session RPE required within 24 hours
- Automatic ACWR calculation triggers

**Reports**:
- Reports generated cannot be edited (versioning)
- Approval workflow for sensitive reports
- Export limited to permission level
- Auto-archive after 2 years

### Financial Business Rules

**Subscription Management**:
- Trials automatically convert or downgrade
- Payment failure triggers 14-day grace period
- Downgrades take effect end of billing cycle
- Refunds handled case-by-case
- Multiple currencies auto-converted at time of transaction

**Usage Limits**:
- AI queries have monthly limits per tier
- Storage has quotas per organization
- User seats enforced strictly
- Excess usage → notification → upgrade prompt

### Access Business Rules

**Role Assignment**:
- Users can only be assigned roles by org admin
- Role changes take effect immediately
- Downgrading role preserves data (read-only if needed)
- Audit trail for all permission changes

**Data Access**:
- Coaches see only their team's data
- Scientists see assigned athletes
- Medical data restricted to physio + doctors
- Athletes see only own data
- Admins see all org data

**Multi-Organization Access**:
- Users can belong to multiple orgs
- Data isolated between orgs
- Login context switches orgs
- Separate roles per org

### Data Retention Rules

- Active data: Firestore
- Older than 3 years: Cold storage (BigQuery)
- Deleted: 90-day grace period
- GDPR requests: Immediate compliance
- Audit logs: 7 years
- Research data: Per IRB requirements

### AI Business Rules

**Boundaries**:
- No medical diagnoses
- No prescription of medications
- Always recommend medical consultation for serious concerns
- No ethical violations (doping advice, etc.)

**Quality**:
- Every response must cite sources
- Every recommendation must be explainable
- Confidence score always displayed
- SIE integration mandatory

**Rate Limits**:
- Free: 10 queries/day
- Starter: 100 queries/month
- Professional: 1000 queries/month
- Enterprise: Unlimited

---

## Notification Behavior

### Notification Categories & Rules

**Test Results**:
- Trigger: Test completed
- Recipients: Athlete, Coach, Sports Scientist
- Priority: High
- Channels: In-app + Push
- Timing: Immediate

**Training Sessions**:
- Trigger: Session created/modified
- Recipients: Attendees, Coaches
- Priority: Medium
- Channels: In-app + Push (day before)
- Timing: 24h and 2h reminder

**Reports Ready**:
- Trigger: Report generation complete
- Recipients: Requester + Shared with
- Priority: Medium
- Channels: In-app + Email
- Timing: Immediate

**Team Updates**:
- Trigger: Roster changes, staff assignments
- Recipients: Team members
- Priority: Low
- Channels: In-app
- Timing: Batched daily

**System**:
- Trigger: Platform announcements, maintenance
- Recipients: All users or affected
- Priority: Varies
- Channels: In-app + Email (major)
- Timing: Immediate to scheduled

**AI Insights**:
- Trigger: Automated analysis complete
- Recipients: Relevant staff
- Priority: Low-Medium
- Channels: In-app
- Timing: Morning digest

**Approval Requests**:
- Trigger: Report/action requires approval
- Recipients: Approvers
- Priority: High
- Channels: In-app + Email + Push
- Timing: Immediate

**Reminders**:
- Trigger: Scheduled tasks
- Recipients: Task owners
- Priority: Medium
- Channels: In-app + Push
- Timing: Configurable per user

**Alerts (Critical)**:
- Trigger: Injury risk, performance drops
- Recipients: Coach, Physio, Scientist
- Priority: Urgent
- Channels: In-app + Push + Email + SMS
- Timing: Immediate

**Social**:
- Trigger: Comments, mentions
- Recipients: Mentioned users
- Priority: Low
- Channels: In-app
- Timing: Real-time

### Smart Delivery Rules

**Quiet Hours**:
- Users can set quiet hours (default 10pm-7am)
- Only urgent notifications during quiet hours
- Others queued for morning

**Rate Limiting**:
- Max 10 push notifications per hour
- Max 50 in-app per day
- Automatic batching if exceeded

**Deduplication**:
- Same event to same user: single notification
- Similar events within 5 min: grouped
- Digest for low-priority items

**Preferences**:
- Per-category toggle
- Per-channel toggle
- Per-agent AI insights toggle
- Batch vs. real-time preference

**Time Zone Awareness**:
- Deliver during recipient's active hours
- Respect regional differences
- Weekend handling (optional)

### Notification Content

**Language**:
- In user's preferred language
- Sports terminology localized
- Names in original script

**Personalization**:
- Athlete name/team included
- Contextual details
- Deep link to relevant screen

**Actionability**:
- Clear call-to-action
- Direct navigation to context
- Quick actions (approve/reject)

---

## Export Workflows

### Standard Export Flow

```
User Initiates Export
   │
   ▼
Permission Check
   │
   ├─ User has export permission?
   ├─ Data privacy compliance?
   └─ Organization allows?
   │
   ▼
Format & Content Selection
   │
   ├─ Format (PDF/Excel/Word/CSV/JSON)
   ├─ Sections to include
   ├─ Date range
   ├─ Anonymization option
   ├─ Include AI insights
   └─ Branding options
   │
   ▼
Data Preparation
   │
   ├─ Query filtered data
   ├─ Apply anonymization
   ├─ Format per export type
   └─ Generate visualizations
   │
   ▼
Format-Specific Processing
   │
   ├─ PDF: Template + Fonts (esp. Arabic)
   ├─ Excel: Sheets + formulas + charts
   ├─ Word: Editable document
   └─ CSV: Flattened data
   │
   ▼
File Storage
   │
   ├─ Upload to Cloud Storage
   ├─ Generate signed URL
   └─ Set 24h expiration
   │
   ▼
Delivery
   │
   ├─ Direct download
   ├─ Email attachment
   ├─ Cloud share
   └─ Secure link
   │
   ▼
Audit & Track
   │
   ├─ Log export action
   ├─ Track recipients
   └─ Compliance record
```

### Export Types

**Individual Athlete Report**:
- Personal performance summary
- Charts and trends
- AI insights
- PDF format primary
- Arabic RTL support

**Team Performance Report**:
- Team overview
- Individual highlights
- Comparative analysis
- Season summary
- Multiple format options

**Medical Report**:
- Restricted access
- Injury history
- Recovery status
- Confidentiality watermark
- Digital signature

**Research Dataset**:
- Anonymized data
- CSV/JSON/SPSS formats
- Approval required
- Statistical documentation
- Citation guide

**Compliance Report**:
- Audit trails
- GDPR/HIPAA compliance
- Access logs
- User activity
- Restricted to admins

### Language-Specific Export

**Arabic PDF Reports**:
- Embedded Arabic fonts (Noto Sans Arabic, Cairo)
- RTL layout throughout
- Arabic-indic numerals optional
- Right-aligned tables
- Mirrored charts (numeric axis LTR)
- Bilingual toggle

**English PDF Reports**:
- Standard LTR layout
- Professional typography
- Chart annotations in English
- Standard number formatting

**Bilingual Reports** (optional):
- Both languages side-by-side
- Enterprise feature
- Configurable per section

---

## Search & Filtering Behavior

### Global Search

**Search Scope**:
- Athletes (name, team)
- Teams (name)
- Tests (type, results)
- Reports (title, content)
- AI conversations (topic)
- Documents (uploaded files)

**Search Features**:
- Real-time results (debounced 300ms)
- Fuzzy matching
- Search across languages (Arabic + English)
- Recent searches
- Suggested queries
- Filter within results

**Search UI**:
- Full-screen modal
- Categorized results
- Quick actions per result
- Empty state (recent + suggested)
- Loading state
- Error handling

**Search Analytics**:
- Track popular searches
- Improve suggestions
- Identify content gaps

### Filtering Behavior

**Consistent Filter Pattern**:
- Filter icon opens bottom sheet
- Categories on left, options on right
- Applied filters as removable chips
- "Clear all" option
- Save filter presets (future)

**Filter Types**:

**Athletes**:
- Team
- Position
- Age group
- Status (active/injured/etc.)
- Gender
- Nationality

**Tests**:
- Test type
- Date range
- Result grade
- Athlete
- Team
- Tester

**Reports**:
- Type
- Date generated
- Author
- Status
- Athlete/Team

**Notifications**:
- Category
- Read/Unread
- Date
- Priority

### Sort Options

**Universal Sort Options**:
- Name (A-Z / Z-A)
- Date (Newest / Oldest)
- Recently accessed
- Alphabetical
- Custom sort (future)

**Context-Specific Sorts**:
- Athletes: By performance, injury status
- Tests: By grade, date
- Reports: By views, date

### Advanced Search

**Boolean Operators**:
- AND, OR, NOT
- Quoted phrases
- Wildcards

**Field-Specific**:
- `athlete:name` - search only athlete names
- `type:vo2max` - specific test type
- `after:2025-01-01` - date filters

**Saved Searches**:
- Save frequently used queries
- Alert on new matching items
- Share searches

---

## Dashboard Widgets

### Widget Types

**Statistic Widgets**:
- Number with label
- Trend indicator (↑↓)
- Comparison (vs last period)
- Sparkline chart

**Chart Widgets**:
- Line chart (trends)
- Bar chart (comparisons)
- Pie/donut (distributions)
- Radar (multi-metric)
- Heatmap (patterns)

**List Widgets**:
- Recent items
- Upcoming events
- Alerts
- Notifications

**Activity Widgets**:
- Timeline
- Feed
- Calendar

**AI Widgets**:
- Latest insights
- Recommendations
- Quick queries

### Widget Configuration

- Position (drag & drop - future)
- Size (small/medium/large)
- Data source
- Time range
- Refresh interval
- Filters

### Role-Based Widget Sets

**Coach Dashboard**:
- Team readiness
- Today's session
- Recent tests
- AI Coach quick access

**Athlete Dashboard**:
- Personal metrics
- Today's plan
- Wellness reminder
- AI Coach

**Scientist Dashboard**:
- Testing schedule
- Data quality overview
- Team performance
- Research projects

**Admin Dashboard**:
- Organization stats
- User activity
- Subscription usage
- Compliance status

---

## Continuation

For details on:
- **Every form and validation** → See `PRD_INTERACTIONS.md`
- **All states (loading/empty/error)** → See `PRD_INTERACTIONS.md`
- **Settings options** → See `PRD_INTERACTIONS.md`

---

**Workflows Documentation Status**: Complete  
**Next**: See PRD_INTERACTIONS.md for interactions and states

*SportMind AI - PRD Part 3 of 4*
