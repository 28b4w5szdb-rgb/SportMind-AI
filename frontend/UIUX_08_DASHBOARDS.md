# 08 · Role-Based Dashboards

> Same design system, five entirely different first-screens. The dashboard is the product for each role.

---

## 8.1 Shared Dashboard Skeleton

All dashboards share this structural spine:

```
[App Bar large]
  Greeting  (localized, time-aware: "Good morning, Dr. Al-Sayed")
  Notifications bell (with badge)
  Avatar (opens quick switcher)

[Sync Pulse Bar]

[Hero Zone]        ← role-specific KPI cards, 2–3 across on tablet
[Quick Actions]    ← 4 icon buttons, role-specific
[Insight Feed]     ← AI-curated cards with Explain Chips
[Activity Feed]    ← recent events, role-scoped
[Deep Links]       ← "Continue where you left off" resume cards

[Tab Bar]
```

Differences between roles are: **which KPIs, which quick actions, which insights, which activities**.

---

## 8.2 🧪 Sports Scientist Dashboard

**Mental model:** "I'm running a lab. Show me what needs attention."

### Hero KPIs
- **At-Risk Athletes** — count with danger chip; drilldown lists athletes flagged by SIE.
- **Tests Pending Review** — count; opens review queue.
- **Data Quality Score** — 0–100 ring (missing values, outliers detected).

### Quick Actions
- New Test  · Add Athlete  · Open Calculator  · Export Report

### Insights Feed (AI + SIE)
- "3 athletes' ACWR crossed 1.5 this week — review load" [Explain Chip]
- "HRV trend for Ahmed Al-Fahim → parasympathetic stress" [Explain Chip]
- "Data quality warning: 12 tests missing hydration status"

### Activity Feed
- Recent test completions.
- New athletes added by other users.
- Comments/replies on athlete notes.

### Signature Widget
- **Cohort Comparison Card** — small radar chart showing team profile vs. norms.

---

## 8.3 🏋️ Coach Dashboard

**Mental model:** "Who trains today, who sits out, and why?"

### Hero KPIs
- **Today's Session** — countdown + attendee count.
- **Squad Readiness** — average readiness ring for today's roster.
- **Injury Watch** — athletes flagged, click to prescribe modification.

### Quick Actions
- Start Session  · Message Team  · Modify Plan  · Weekly Review

### Insights Feed
- "Recommended intensity: −10% for Youssef (elevated soreness)" [Confidence 78%]
- "Consider swapping Fahad from A-team to recovery drill today"
- "Team readiness dropped 6% vs. last Tuesday — check yesterday's load"

### Activity Feed
- Athletes marked available/unavailable.
- Scientist recommendations arriving.
- Session attendance.

### Signature Widget
- **Readiness Traffic Light Grid** — every athlete as a colored tile (green/amber/red).

---

## 8.4 🏃 Athlete Dashboard

**Mental model:** "How am I today, and what should I do?"

### Hero KPIs
- **Readiness** — Big ring, tap for breakdown.
- **Today's Plan** — session preview card.
- **Recovery Score** — sleep + HRV composite.

### Quick Actions
- Log Wellness  · Log Sleep  · Message Coach  · View Plan

### Insights Feed (simpler language)
- "Your recovery is 82% — you're ready for a full session."
- "Sleep dipped last night. Consider hydrating more today."
- "Coach adjusted your plan to include 15 min mobility."

### Activity Feed
- Comments from coach.
- Achievements (PRs).
- Scheduled tests.

### Signature Widget
- **7-Day Wellness Streak** — a horizontal 7-day dot row showing wellness log completion (motivating without gamifying scientifically-important behavior).

### Youth Athletes (< 18)
- Reduced data density.
- Parental co-pilot mode: parent's dashboard shows athlete's view + parental oversight (opt-in).

---

## 8.5 🔬 Researcher Dashboard

**Mental model:** "Give me data, sample sets, and statistical tools."

### Hero KPIs
- **Active Studies** — count; links to cohort dashboards.
- **Consented Athletes** — pool size across studies.
- **Data Freshness** — last import timestamp per study.

### Quick Actions
- New Cohort  · Query Builder  · Statistical Toolkit  · Export Dataset

### Insights Feed
- "Cohort A shows significant HRV difference (p=0.03) vs. Cohort B — review."
- "Outlier detected in study #12 dataset — verify entry."
- "New literature suggestion in Knowledge Center matches your current study."

### Activity Feed
- Import events, export jobs, collaborator activity.

### Signature Widget
- **Correlation Scatter Snapshot** — a small scatter plot of the last-run analysis, tap to open Research Mode.

### Research Mode Chrome
- Iris tint on app bar (distinguishing chrome from clinical mode).
- "Research" watermark on all exports.

---

## 8.6 🏢 Organization Admin Dashboard

**Mental model:** "Health of the organization — usage, seats, teams, compliance."

### Hero KPIs
- **Active Users** — 30-day count vs. seats.
- **Teams** — count; drill into team management.
- **Subscription** — status, renewal date, usage tier.

### Quick Actions
- Invite User  · Create Team  · Manage Roles  · View Billing

### Insights Feed
- "5 pending invites — resend?"
- "Team U-19 has 2 vacant coach seats."
- "Consent renewals due for 8 athletes this month."

### Activity Feed
- User sign-ups, role changes, subscription events, audit events.

### Signature Widget
- **Compliance Board** — small grid showing consent, license, GDPR, retention status for the org — traffic-light coded.

### Audit Access
- Prominent link to Audit Log (Doc 04 §4.20 → Settings).

---

## 8.7 🎓 Student Dashboard (bonus — mentioned in role picker)

**Mental model:** "I'm learning. Give me sandboxed data and formulas."

### Hero KPIs
- Study Progress ring, Formula of the Day card, Sandbox athletes count.

### Quick Actions
- Open Calculator  · Sandbox  · Knowledge Center  · Ask AI Coach

### Insights Feed
- Curated learning cards, quiz prompts, formula walkthroughs.

### Signature Widget
- **Formula of the Day** — hero SIE Formula Card with worked example.

---

## 8.8 Dashboard Personalization

All dashboards support:
- **Reorder** — drag KPI cards (long-press on mobile; drag on web).
- **Show/Hide** — hide widgets not relevant.
- **Time range selector** — global toggle for 24 h / 7 d / 30 d / Custom.
- **Compare** — split dashboard into 2 columns comparing time ranges or cohorts (tablet/web).

---

## 8.9 Cross-Role Elements

Regardless of role, these always appear on every dashboard:
- **Sync Pulse Bar** (top-most under app bar).
- **Language toggle** accessible from avatar quick-menu.
- **AI Coach FAB** or entry point.
- **Notifications bell** (in-app only; no push suggestion by main agent).

---

## 8.10 Dashboard States

| State | Behavior |
|---|---|
| First-time (empty) | Onboarding checklist card + "Add your first athlete" empty state |
| Loading | Skeleton for each widget (matching shape) |
| Partial-data | Some cards populated, some empty-state within the same grid |
| Error | Per-widget error card with retry — dashboard never crashes as a whole |
| Offline | Sync Pulse amber; cached data with timestamp footer |

---

## 8.11 Dashboard Layout by Form Factor

| Form Factor | Layout |
|---|---|
| Phone | Single column, KPIs stacked, widgets scroll vertically |
| Tablet portrait | 2 columns, KPI row 2-across |
| Tablet landscape | 3 columns, KPI row 3-across |
| Web (xl) | 12-col grid, draggable widgets, saved layouts per user |

---

_See Doc 09 for the reporting experience each role exports to._
