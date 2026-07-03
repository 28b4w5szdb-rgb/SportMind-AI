# 09 · Reporting Experience

> Reports are how SportMind AI leaves the app. They must be beautiful, defensible, and printable in Arabic and English.

---

## 9.1 Report Philosophy

1. **Reports are permanent artifacts.** Once shared with a coach, a doctor, a board, or a journal — they represent SportMind AI forever.
2. **Journal-grade typography.** Report layouts read like Nature or NEJM, not like a marketing PDF.
3. **Every claim is sourced.** Reports contain SIE calculation traces and SKB citations inline.
4. **Bilingual, not translated.** Arabic and English report templates are separately laid out — not mirrored from one another.
5. **Print-safe.** All reports work on A4 and US Letter, portrait and landscape, in monochrome and color.
6. **Machine-parseable.** Reports embed structured metadata (PDF/A + XMP + optional JSON attachment) so downstream systems can re-ingest.

---

## 9.2 Report Types

### 9.2.1 Athlete Report
**Audience:** Coach, athlete, parent, medical.  
**Length:** 4–8 pages.  
**Sections:**
1. Cover (athlete photo, name, org, date range)
2. Executive Summary (3 bullet insights + confidence)
3. Biometrics (table + growth chart)
4. Performance Metrics (VO₂, HR zones, power, speed) — one chart each
5. Training Load (ACWR chart + interpretation)
6. Recovery & Wellness (sleep + HRV composite)
7. AI Insights (with Explain traces)
8. Recommendations (coach-actionable)
9. Appendix (raw data table, SKB citations, glossary)

### 9.2.2 Team / Cohort Report
**Audience:** Head coach, organization admin.  
**Length:** 6–14 pages.  
**Sections:**
1. Cover with org branding
2. Team overview (roster stats)
3. Readiness heatmap (all athletes × 7 days)
4. Load distribution (bar chart)
5. Injury/absence log
6. Cohort comparisons (this week vs. last, vs. norms)
7. Standout athletes (top/bottom on selected metrics)
8. AI team insights
9. Actions & next steps

### 9.2.3 Session Report
**Audience:** Coach, athlete, distributed post-training.  
**Length:** 1–2 pages.  
**Sections:** Session summary, per-athlete quick stats, drill breakdown, quick chart, coach notes.

### 9.2.4 Research Report / Scientific Brief
**Audience:** Researcher, university, journal.  
**Length:** Variable.  
**Sections:**
1. Abstract
2. Methods (cohort, protocols, statistics)
3. Results (tables, plots, p-values, effect sizes)
4. Discussion (auto-drafted + editable)
5. References (auto-populated from SKB)
6. Appendix (raw dataset link, IRB status)

### 9.2.5 Compliance / Audit Report
**Audience:** Org admin, regulators.  
**Length:** Variable.  
**Sections:** Data access log, consent status, data export events, model decision log.

---

## 9.3 Cover Page Design

### 9.3.1 English (LTR)
```
┌──────────────────────────────────┐
│                                  │
│   [Org logo — top-left]          │
│                                  │
│                                  │
│        Athlete Performance       │
│              Report              │
│                                  │
│        Ahmed Al-Fahim            │
│        Team U-19 · Football      │
│        01 Jun 2026 – 30 Jun 2026 │
│                                  │
│                                  │
│                                  │
│                                  │
│   [SportMind AI mark — bottom]   │
│   Confidential · Do not share    │
└──────────────────────────────────┘
```

### 9.3.2 Arabic (RTL)
```
┌──────────────────────────────────┐
│                                  │
│          [شعار المنظمة — يمين]    │
│                                  │
│                                  │
│         تقرير أداء اللاعب        │
│                                  │
│         أحمد الفهيم              │
│         فريق تحت 19 · كرة قدم    │
│         1 يونيو 2026 – 30 يونيو  │
│                                  │
│                                  │
│                                  │
│    [علامة SportMind AI — أسفل]   │
│         سري · للاستخدام الداخلي   │
└──────────────────────────────────┘
```

Cover pages are **hand-designed per language** — the Arabic cover uses `Amiri` serif for headings, while the English cover uses `Newsreader`.

---

## 9.4 Typographic Recipe for Reports

| Element | English | Arabic |
|---|---|---|
| Report title | Newsreader 36 semibold | Amiri 40 semibold |
| Section header | Newsreader 22 semibold | Amiri 26 semibold |
| Subsection | Newsreader 16 semibold | Amiri 18 semibold |
| Body | Newsreader 11 regular · 1.5 line | Amiri 12.5 regular · 1.65 line |
| Metric | JetBrains Mono 12 · tabular | (Latin) same |
| Caption | Newsreader 9.5 italic | Amiri 10 (no italic — use gray) |
| Footer | Inter 8.5 | IBM Plex Sans Arabic 9 |

Line measure: 65–72 characters English; 55–65 characters Arabic.

---

## 9.5 Report Chart Style

Report charts are subtly different from in-app charts:

- No color-filled backgrounds; white/paper only.
- Grid lines: 0.25 pt neutral/300.
- Data ink dominates; 2 pt line strokes.
- Legend inline with the axis labels.
- Every chart caption starts with a figure number (Fig. 1, شكل 1).
- Print-safe palette — colors chosen for both color print & B/W fallback.

---

## 9.6 SIE & SKB Attribution in Reports

Every AI-generated recommendation or SIE-derived metric in a report includes:
- **Method superscript:** e.g. VO₂ Max¹ — footnote references formula source.
- **Confidence chip inline:** "Predicted readiness 78% (± 4%)".
- **Citations page:** All SKB references collected at the end in citation style matching language (AMA style English, adapted Arabic bibliographic style).

---

## 9.7 In-App Report Preview

Before exporting, users see a WYSIWYG preview:
```
[App Bar: Report Preview · Language · Export]
[Segmented: A4 | Letter] [Segmented: Portrait | Landscape]
[Language toggle: AR | EN]
[Zoom controls]

[Preview canvas — pinch to zoom, scroll pages]

[Section toolbar (side panel on tablet/web):
  ☑ Cover
  ☑ Executive Summary
  ☑ Biometrics
  ☑ Performance
  ☐ Wellness (opt out)
  ☑ AI Insights
  ...
  [Reorder handles]
]

[Bottom: Export PDF | Export Excel | Share Link | Schedule]
```

Users can:
- Toggle sections on/off.
- Reorder sections (drag).
- Add a custom cover note.
- Choose recipients & permissions (view / comment / download).
- Set expiration on share link.
- Watermark toggle ("DRAFT", "CONFIDENTIAL").

---

## 9.8 Export Formats

| Format | Purpose |
|---|---|
| **PDF (default)** | Universally shareable, print-safe |
| **PDF/A-2b** | Long-term archival (audit, medical records) |
| **Excel (.xlsx)** | Raw data + calculated metrics, per athlete sheet |
| **CSV** | Machine consumption, per test type |
| **JSON** | Full structured export (research use) |
| **Web share link** | Read-only branded URL (with expiration + optional password) |

---

## 9.9 Branding & White Label

- Organization admins can upload logo, color, and cover-page template.
- Fonts stay fixed to preserve typographic quality (users cannot replace).
- White-label organizations get their logo on cover + footer of every page — SportMind AI mark moves to a discreet footer.

---

## 9.10 Accessibility of Reports

- Tagged PDF (heading structure, table headers, alt text on charts).
- Fully OCR-searchable text (never rasterized).
- Alt text on every chart with a plain-language summary of the trend.
- Sufficient color contrast in both color and B/W renders.

---

## 9.11 Ramadan-Aware & Locale-Aware Scheduling

- Scheduled reports respect user's timezone and Islamic calendar preferences.
- Reports can be tagged with Hijri dates alongside Gregorian.

---

## 9.12 Templates & Presets

Orgs can save report templates:
- Weekly team report (auto-generated Sunday 08:00 local).
- Monthly athlete report (auto-generated first of month).
- Post-test report (triggered on test completion).
- Custom templates with drag-and-drop section builder.

---

## 9.13 Anti-Patterns for Reports (Forbidden)

- ❌ Marketing-style pages ("You crushed it!") inside a scientific report.
- ❌ Overuse of color (color for signal only).
- ❌ Skeuomorphic paper edges or fake shadows.
- ❌ Rasterized text (breaks accessibility & search).
- ❌ Non-referenced AI claims.

---

_See Doc 10 for the consolidated blueprint that binds all documents._
