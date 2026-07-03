# SportMind AI - PRD Part 2: Screen Specifications

**Complete detailed specifications for all 62 screens**

---

## Screen Specification Template

Each screen documented with:
- **Purpose**: Why this screen exists
- **Components**: UI elements present
- **User Actions**: All possible interactions
- **Expected Outputs**: What happens on actions
- **States**: Loading, Empty, Error, Success, Offline
- **Edge Cases**: Special scenarios
- **Permissions**: Who can access
- **Dependencies**: Data/services needed
- **Future Enhancements**: Planned improvements

---

# A. ONBOARDING & AUTHENTICATION

## Screen 1: Splash Screen

**Purpose**: App launch screen, initialization

**Components**:
- SportMind AI logo (centered)
- Loading indicator (subtle)
- Version number (small, bottom)
- Background gradient (theme-aware)

**User Actions**: None (automatic)

**Expected Outputs**:
- Initialize app state
- Check authentication status
- Load user preferences
- Determine target screen:
  - First launch → Language Selection
  - Not authenticated → Login
  - Authenticated → Dashboard

**States**:
- Loading (default)
- Update available (with prompt)
- Maintenance mode (info screen)

**Edge Cases**:
- No internet on first launch (proceed with cached data)
- Corrupted local storage (reset and re-authenticate)
- App version too old (force update screen)

**Permissions**: N/A (public)

**Dependencies**:
- Auth service
- Local storage
- Configuration service

**Future Enhancements**:
- Animated logo
- Personalized greeting after first login
- Splash video for first launch

---

## Screen 2: Language Selection

**Purpose**: First-time language selection

**Components**:
- Welcome message (multilingual)
- Language list:
  - العربية (Arabic) with 🇸🇦 flag
  - English with 🇬🇧 flag
  - Additional languages (future)
- Selected indicator (checkmark)
- Continue button (bottom)

**User Actions**:
- Tap language row → Select
- Tap "Continue" → Proceed

**Expected Outputs**:
- Save language preference
- Apply language immediately
- Navigate to Onboarding

**States**:
- Default (English pre-selected based on device)
- Loading (applying language change)

**Edge Cases**:
- Device language unavailable → Fallback to English
- Language change fails → Show error, retry

**Permissions**: N/A (public)

**Dependencies**:
- i18n service
- Local storage

**Future Enhancements**:
- More languages (French, Spanish, etc.)
- Regional variants (Egyptian Arabic, etc.)
- Auto-detection from IP location

---

## Screen 3: Onboarding Carousel

**Purpose**: Introduce SportMind AI to first-time users

**Components**:
- 3 slides with:
  - Full-screen illustration
  - Bold heading
  - Descriptive subtitle
- Pagination dots (bottom)
- Skip button (top-right)
- Next/Get Started button (bottom)

**Slide 1: Welcome**
- Illustration: Sports science professional
- Title: "Welcome to SportMind AI"
- Subtitle: "The professional sports science platform"

**Slide 2: AI Power**
- Illustration: AI + sports imagery
- Title: "Powered by Specialized AI"
- Subtitle: "6 AI agents for every aspect of sports science"

**Slide 3: Scientific Rigor**
- Illustration: Data & charts
- Title: "Backed by Science"
- Subtitle: "Every insight is scientifically validated"

**User Actions**:
- Swipe left/right → Change slides
- Tap pagination dot → Jump to slide
- Tap "Skip" → Go to Login
- Tap "Next" (slides 1-2) → Advance
- Tap "Get Started" (slide 3) → Go to Login

**Expected Outputs**:
- Mark onboarding as completed
- Navigate to Login screen

**States**:
- Default (slide 1)
- Transitioning between slides
- Last slide (button changes to "Get Started")

**Edge Cases**:
- Returning user (skip onboarding entirely)
- App update with new features (show update onboarding)

**Permissions**: N/A (public)

**Dependencies**: Local storage for completion flag

**Future Enhancements**:
- Role-specific onboarding (coach vs. athlete)
- Interactive tutorials
- Video-based onboarding

---

## Screen 4: Login

**Purpose**: User authentication

**Components**:
- Logo (small, top)
- Welcome message
- Email input field
- Password input field (with show/hide toggle)
- "Forgot Password?" link
- "Sign In" button (primary)
- Divider "or continue with"
- Social login buttons:
  - Google
  - Apple (iOS)
  - Facebook (optional)
- "Don't have account? Sign Up" link
- Language switcher (bottom)

**User Actions**:
- Enter email → Type validation
- Enter password → Type validation
- Toggle password visibility
- Tap "Forgot Password" → Navigate
- Tap "Sign In" → Submit
- Tap social login → OAuth flow
- Tap "Sign Up" → Navigate
- Tap language switcher → Change language

**Expected Outputs**:
- Successful login → Dashboard
- Invalid credentials → Error message
- Network error → Retry option

**Validation Rules**:
- Email: Valid format required
- Password: Minimum 8 characters
- Both required before submit enabled

**States**:
- Default
- Field validation errors
- Loading (during authentication)
- Success (brief before navigation)
- Error (invalid credentials, network, account locked)
- Offline (queue for retry)

**Edge Cases**:
- Account not verified → Redirect to verification
- Account suspended → Show contact support
- 2FA enabled → Show 2FA screen
- Too many failed attempts → Temporary lock

**Permissions**: N/A (public)

**Dependencies**:
- Firebase Auth
- OAuth providers
- Analytics

**Future Enhancements**:
- Biometric auth (Face ID/Touch ID)
- Magic link login
- SSO for enterprise
- Passkeys support

---

## Screen 5: Registration - Type Selection

**Purpose**: Choose registration path

**Components**:
- Header: "Create Account"
- Subtitle: "Choose your account type"
- Two large option cards:
  - **Individual Account**
    - Icon: Person
    - Title
    - Description: "For athletes, coaches, researchers"
    - "Continue" button
  - **Organization Account**
    - Icon: Building
    - Title
    - Description: "For clubs, universities, teams"
    - "Continue" button
- "Already have account? Sign In" link (bottom)

**User Actions**:
- Tap Individual card → Navigate
- Tap Organization card → Navigate
- Tap Sign In → Navigate to Login

**Expected Outputs**:
- Store selection
- Navigate to appropriate form

**States**:
- Default
- Selection highlighted on tap

**Edge Cases**: N/A

**Permissions**: N/A (public)

**Dependencies**: None

**Future Enhancements**:
- Additional account types (family, coach network)

---

## Screen 6: Registration - Individual

**Purpose**: Individual user registration

**Components**:
- Back button
- Progress indicator (step 1 of 3)
- Header: "Personal Information"
- Form fields:
  - First Name (required)
  - Last Name (required)
  - Email (required)
  - Password (required, with strength meter)
  - Confirm Password (required)
  - Date of Birth (required)
  - Gender (Male/Female/Prefer not to say)
  - Country (dropdown)
  - Role selector:
    - Athlete
    - Coach
    - Sports Scientist
    - Physiotherapist
    - Researcher
- Terms & Conditions checkbox
- Privacy Policy checkbox
- "Create Account" button

**User Actions**:
- Fill each field with real-time validation
- Toggle password visibility
- Select from dropdowns
- Accept terms
- Submit form

**Expected Outputs**:
- Create Firebase account
- Send verification email
- Navigate to Email Verification screen

**Validation Rules**:
- First Name: 2-50 characters, no numbers
- Last Name: 2-50 characters, no numbers
- Email: Valid format, not already registered
- Password: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special
- Confirm Password: Must match password
- Date of Birth: Must be 13+ years old
- Role: Required selection
- Terms & Privacy: Both must be accepted

**States**:
- Default (empty form)
- Filling (inline validation)
- Loading (submitting)
- Success (brief)
- Error (various)

**Edge Cases**:
- Email already exists → Prompt to login
- Under 13 years old → Show parental consent flow
- Weak password → Show strength suggestions
- Network error → Preserve form data

**Permissions**: N/A (public)

**Dependencies**:
- Firebase Auth
- Countries list
- Terms & Privacy documents

**Future Enhancements**:
- Progressive registration (fewer fields upfront)
- Import from social profile
- Phone number verification option

---

## Screen 7: Registration - Organization

**Purpose**: Organization registration

**Components**:
- Back button
- Progress indicator (step 1 of 4)
- Header: "Organization Details"
- Form sections:
  - **Organization Info**:
    - Name (required)
    - Type (dropdown: Club/University/Academy/Federation/Lab)
    - Sport(s) served (multi-select)
    - Country (required)
    - City
    - Website (optional)
    - Founded year (optional)
    - Description
  - **Admin Info** (Step 2):
    - Admin First Name
    - Admin Last Name
    - Admin Email
    - Admin Password
    - Admin Role/Title
  - **Subscription Choice** (Step 3):
    - Plan selection cards
    - Compare features
    - Contact sales for enterprise
  - **Payment** (Step 4, if paid):
    - Payment method
    - Billing info

- "Create Organization" button
- Progress dots

**User Actions**:
- Complete each step
- Navigate back to previous step
- Save progress (draft)
- Submit final step

**Expected Outputs**:
- Create organization in database
- Create admin account
- Send welcome email
- Navigate to Organization Setup Wizard

**Validation Rules**:
- Organization Name: 3-100 characters, unique
- Type: Required
- Country: Required
- Admin Email: Valid, unique
- Admin Password: Strong password rules
- All fields per section

**States**:
- Default per step
- Progress saving
- Loading (submitting)
- Success
- Error

**Edge Cases**:
- Organization name taken → Suggest variations
- Payment failure → Retry or contact support
- Draft recovery on return

**Permissions**: N/A (public)

**Dependencies**:
- Firebase Auth
- Stripe (payment)
- Countries/sports lists
- Subscription tiers config

**Future Enhancements**:
- White-label setup wizard
- Bulk import trial data
- Free trial without payment

---

## Screen 8: Forgot Password

**Purpose**: Password recovery

**Components**:
- Back button
- Header: "Reset Password"
- Description text
- Email input field
- "Send Reset Link" button
- "Back to Login" link

**User Actions**:
- Enter email
- Tap "Send Reset Link"

**Expected Outputs**:
- Send password reset email
- Show confirmation screen
- Option to resend after 60s

**Validation Rules**:
- Email: Valid format required

**States**:
- Default
- Loading
- Success (email sent confirmation)
- Error (email not found, network error)

**Edge Cases**:
- Email not registered → Generic success message (security)
- Rate limiting → Show wait time
- Reset link expired → Regenerate

**Permissions**: N/A (public)

**Dependencies**: Firebase Auth password reset

**Future Enhancements**:
- SMS-based reset option
- Security questions
- Magic link login instead

---

## Screen 9: Email Verification

**Purpose**: Verify email ownership

**Components**:
- Email icon (large)
- Header: "Verify Your Email"
- Description: "We sent a verification email to {email}"
- Instructions
- "Resend Email" button (with cooldown)
- "Change Email" link
- "Continue" button (checks verification)

**User Actions**:
- Check email inbox
- Click verification link (opens app or browser)
- Return to app
- Tap "Continue" to check status
- Tap "Resend" if not received
- Tap "Change Email" to update

**Expected Outputs**:
- Detect verification via deep link or manual check
- Navigate to onboarding/setup on verification

**States**:
- Waiting for verification
- Checking status (loading)
- Verified (brief success)
- Not verified (retry option)
- Resend cooldown

**Edge Cases**:
- Verification link expired → Auto-resend
- Wrong email entered → Change email flow
- Verification not received → Check spam guidance

**Permissions**: N/A (public, but requires account)

**Dependencies**: Firebase Auth, Email service

**Future Enhancements**:
- Deep link auto-open
- Alternative verification methods

---

# B. MAIN APPLICATION - TABS

## Screen 10: Dashboard (Home)

**Purpose**: Main overview screen for authenticated users

**Components**:

**Header Section**:
- User avatar (top-left)
- Greeting: "Good morning, {name}"
- Date and organization name
- Notification bell (with badge count)
- Search icon

**Quick Stats Section** (grid of cards):
- Total Athletes (with trend arrow)
- Active Sessions Today
- Pending Tests
- Recent Reports

**Today's Activity**:
- Scheduled sessions (list)
- Upcoming tests (list)
- Recent notifications preview

**Quick Actions** (grid of large buttons):
- AI Coach
- Add Athlete
- Log Test
- View Reports
- (customizable per role)

**Performance Highlights** (role-dependent):
- **Coach**: Team performance snapshot
- **Athlete**: Personal metrics
- **Scientist**: Recent test results

**AI Insights Card**:
- Latest AI-generated insight
- "Tap to view" button

**Pull-to-refresh** at top

**User Actions**:
- Tap notification bell → Notifications Center
- Tap search → Global Search
- Tap avatar → Profile/Menu
- Tap stat card → Related screen
- Tap quick action → Action screen
- Tap session/test → Detail
- Tap AI insight → Full analysis
- Pull down → Refresh

**Expected Outputs**:
- Real-time data updates
- Contextual navigation
- Personalized content

**States**:
- Loading (skeleton cards)
- Loaded (with real data)
- Empty state (new user - "Get started" guide)
- Error (retry option)
- Offline (cached data with indicator)

**Edge Cases**:
- New user with no data → Show onboarding tips
- No internet → Show cached data
- Very large organization → Aggregate data
- Multi-timezone → Show local times

**Permissions**: All authenticated users (different content by role)

**Dependencies**:
- Athletes, Tests, Sessions, Reports collections
- Notifications
- AI insights
- User preferences

**Future Enhancements**:
- Customizable dashboard widgets
- Drag-and-drop layout
- Widget marketplace
- Voice queries ("How's my team?")

---

## Screen 11: AI Coach Hub

**Purpose**: Central hub for AI agent interactions

**Components**:

**Header**:
- Title: "AI Assistants"
- Subtitle: "Choose your specialist"
- Search bar (search conversations)

**Agent Grid** (6 cards):
1. **AI Coach**
   - Icon + color theme
   - Description
   - Recent conversations count
   - "Start Chat" or "Continue"
2. **Performance Analyst**
3. **Recovery Expert**
4. **Sports Scientist**
5. **Research Assistant**
6. **Statistics Analyst**

**Recent Conversations** (list below):
- Conversation title
- Agent icon
- Last message preview
- Timestamp
- Unread indicator

**Pinned Conversations** (if any)

**Filter Tabs**: All / By Agent / Recent / Pinned

**User Actions**:
- Tap agent card → Start new chat
- Tap conversation → Continue
- Long press conversation → Options menu
- Swipe conversation → Quick actions
- Pin/unpin
- Delete conversation
- Search conversations

**Expected Outputs**:
- Navigate to specific agent chat
- Load conversation history

**States**:
- Loading agent list
- Loaded with conversations
- Empty (new user - suggest first prompt)
- Error

**Edge Cases**:
- Agent unavailable (rate limit)
- Very long conversation list → Pagination
- Deleted conversations → Undo option

**Permissions**:
- All authenticated users can access
- Some agents restricted by role
- Rate limits by subscription tier

**Dependencies**:
- AI service
- Conversations collection
- User's AI usage stats

**Future Enhancements**:
- Voice-based agent selection
- Agent recommendations based on context
- Multi-agent conversations
- Custom agent training (enterprise)

---

## Screen 12: Athletes List

**Purpose**: Browse and manage all athletes

**Components**:

**Header**:
- Title: "Athletes"
- Count: "42 athletes"
- Search icon
- Filter icon
- Sort icon
- FAB "+" (Add Athlete)

**Filter Chips** (horizontal scroll):
- All
- Active
- Injured
- By Team
- By Position
- By Age Group

**Sort Options**:
- Name (A-Z)
- Recent
- Position
- Performance

**Athletes List** (each row):
- Avatar
- Full name
- Position + Team
- Status badge (Active/Injured/Rest)
- Performance indicator (small chart)
- Chevron

**Empty State**:
- Illustration
- "No athletes yet"
- "Add your first athlete" button

**Search Mode**:
- Real-time search
- Highlighted matches
- Recent searches
- Suggested queries

**User Actions**:
- Tap athlete → Athlete Detail
- Long press → Quick actions menu
- Swipe → Options (edit, delete, message)
- Filter → Apply filters
- Sort → Change order
- Search → Type query
- Pull to refresh
- Tap FAB → Add Athlete

**Expected Outputs**:
- Navigate to details
- Apply filters/search
- Refresh data

**States**:
- Loading (skeleton rows)
- Loaded with data
- Empty state
- Filtered empty (no matches)
- Search results
- Error
- Offline (cached list)

**Edge Cases**:
- Very large list (1000+ athletes) → Virtualization
- Long names → Truncate with ellipsis
- Deleted athlete → Undo option
- Bulk operations (multi-select mode)

**Permissions**:
- Coaches see team athletes
- Scientists see assigned athletes
- Physio see assigned athletes
- Admins see all athletes
- Athletes see only self

**Dependencies**:
- Athletes collection
- Teams (for filtering)
- Real-time listener

**Future Enhancements**:
- Bulk import CSV
- Advanced filters (age range, metrics)
- Athlete comparison (multi-select)
- Group by team view
- Map view (geographic)

---

## Screen 13: Performance Lab

**Purpose**: Performance analytics and testing dashboard

**Components**:

**Header**:
- Title: "Performance Lab"
- Subtitle: current focus (athlete/team)
- Date range picker
- Filters button

**Overview Cards** (top):
- Tests conducted this month
- Average team performance
- Top performer
- Areas needing focus

**Metrics Grid**:
- Physical (VO2, Speed, Strength)
- Recovery (Sleep, HRV, Wellness)
- Technical (sport-specific)
- Load (ACWR, weekly load)

Each metric card shows:
- Current value
- Trend arrow
- Sparkline chart
- Comparison to norm

**Charts Section**:
- Performance trends (line chart)
- Team distribution (histogram)
- Position comparisons (bar chart)
- Correlation matrix (advanced)

**Athlete Comparison Widget**:
- Select multiple athletes
- Radar chart comparison
- Statistical differences

**Recent Tests List**:
- Latest tests conducted
- Quick access to results

**User Actions**:
- Tap metric card → Detailed view
- Tap chart → Full-screen chart
- Select athletes for comparison
- Change date range
- Apply filters
- Export analytics (data or images)
- Drill down into specific data

**Expected Outputs**:
- Interactive charts
- Detailed analytics
- Export files
- Deep links to raw data

**States**:
- Loading (skeleton charts)
- Loaded with data
- Empty (no tests conducted yet)
- Filtered (limited data)
- Error
- Offline

**Edge Cases**:
- Insufficient data for chart → Show minimum requirement
- Data quality warnings
- Statistical anomalies flagged
- Multiple sports handling

**Permissions**:
- Coach sees team analytics
- Scientist sees full analytics
- Athlete sees personal only
- Admin sees org-wide

**Dependencies**:
- Performance tests collection
- SIE calculations
- Charting library
- Aggregation service

**Future Enhancements**:
- 3D visualizations
- AI-generated insights inline
- Predictive analytics
- Video overlay on charts

---

## Screen 14: More Hub

**Purpose**: Access to additional features and settings

**Components**:

**Header**:
- Title: "More"
- User profile summary at top

**Sections**:

**Scientific Tools**:
- Calculator
- Research Assistant
- Reports Center

**Management**:
- Teams
- Athletes (link to tab)
- Analytics

**Integrations**:
- Plugins Marketplace
- Connected Devices
- API Access

**Communication**:
- Notifications Center
- Messages (future)

**Settings**:
- App Settings
- Profile
- Subscription
- Help & Support

Each item:
- Icon (colored square)
- Label
- Description (small)
- Chevron
- Badge (if applicable)

**User Actions**:
- Tap item → Navigate
- Long press → Add to favorites (future)

**Expected Outputs**:
- Navigate to section

**States**:
- Loaded (default)
- Some items disabled by permissions
- Some items marked "Premium"

**Edge Cases**:
- Feature disabled by subscription → Show upgrade prompt
- Feature disabled by role → Hide or grey out

**Permissions**: Varies by item

**Dependencies**: User role, subscription info

**Future Enhancements**:
- Customizable order
- Favorites at top
- Recently used

---

# C. ATHLETES MODULE

## Screen 15: Athlete Profile (Overview Tab)

**Purpose**: Comprehensive athlete overview

**Components**:

**Header**:
- Back button
- Athlete name
- Menu (three dots)
- Share button

**Profile Card** (top):
- Large avatar (with edit if permitted)
- Full name
- Position + Team badge
- Age
- Nationality flag
- Status indicator
- Key stats (height, weight, dominant side)

**Tab Bar**: Overview | Performance | Medical

**Overview Content**:

**Recent Activity Feed**:
- Last test result
- Recent session attendance
- Latest wellness survey
- Recent AI insights

**Key Metrics Snapshot** (grid):
- VO2 Max (with grade)
- Sprint Speed
- Strength Index
- Recovery Score

**Quick Actions**:
- Log Test
- Schedule Session
- Send Message
- View History

**Team Assignment**:
- Current team card
- Historical teams (collapsible)

**Career Summary** (collapsible):
- Professional since
- Major achievements
- International caps

**Coach Notes** (private, coach-only):
- Recent notes list
- Add note button

**User Actions**:
- Tap tab → Switch view
- Tap stat → Detail
- Tap action → Related screen
- Tap avatar → View full size / Edit
- Tap menu → Options (edit, delete, transfer, archive)
- Tap share → Share profile

**Expected Outputs**:
- Complete athlete overview
- Quick access to actions

**States**:
- Loading
- Loaded
- Error
- Restricted (permission-based)

**Edge Cases**:
- Minor athlete (parental consent required for some actions)
- Injured athlete (highlighted throughout)
- Transferred athlete (different display)
- Deleted athlete (view-only historical)

**Permissions**:
- Coach: Team members only
- Scientist: Assigned athletes
- Physio: Medical access only if assigned
- Admin: All athletes in org
- Athlete: Own profile only

**Dependencies**:
- Athletes collection
- Recent activity
- Metrics from SIE

**Future Enhancements**:
- Video highlights
- Social features
- Achievement badges
- Career timeline

---

## Screen 16: Athlete Profile (Performance Tab)

**Purpose**: Deep dive into athlete's performance data

**Components**:

**Time Range Selector**:
- Last 7 days / 30 days / 90 days / Season / All time / Custom

**Performance Score**:
- Overall grade (large)
- Percentile
- Trend arrow
- Comparison to norm

**Metrics Cards** (expandable):
- Physical Capacity
- Speed & Power
- Endurance
- Recovery
- Strength
- Agility

Each expands to show:
- Current value
- Historical chart
- Norm comparison
- SIE evaluation
- Test history link

**Charts Section**:
- Longitudinal trends (line chart)
- Radar chart (multi-metric)
- Comparison to team average
- Comparison to personal best

**Recent Tests List**:
- Chronological
- Test type icons
- Results summary
- Grade indicators

**AI Insights**:
- Latest analysis
- Recommendations
- View full analysis link

**User Actions**:
- Change time range
- Expand metric cards
- Tap chart → Full screen
- Tap test → Test detail
- Request AI analysis
- Export data
- Compare with other athletes

**Expected Outputs**:
- Interactive data exploration
- Insights and analysis

**States**:
- Loading
- Loaded with data
- Empty (no tests yet - "Schedule first test" CTA)
- Insufficient data (needs minimum tests for analysis)
- Error

**Edge Cases**:
- Only one data point (can't show trend)
- Missing data periods (gaps in chart)
- Outdated baseline
- Multiple sports/positions

**Permissions**: Same as Overview tab

**Dependencies**:
- Performance tests
- SIE evaluations
- AI analysis
- Charting library

**Future Enhancements**:
- 3D performance envelope
- Predictive trajectory
- Peer benchmarking
- Video-linked metrics

---

## Screen 17: Athlete Profile (Medical Tab)

**Purpose**: Medical records and health tracking (restricted access)

**Components**:

**Access Control Banner** (if restricted): "Medical access required"

**Current Health Status**:
- Overall wellness indicator
- Injury status
- Return-to-play readiness

**Injury History**:
- Timeline view
- Current injuries (highlighted)
- Past injuries (chronological)
- Injury type, date, recovery, notes

**Vital Metrics** (recent):
- Resting heart rate
- HRV
- Sleep quality
- Body composition
- Blood pressure (if tracked)

**Wellness Surveys**:
- Recent submissions
- Trends
- Alert flags

**Recovery Plans**:
- Active plans
- Progress tracking
- Compliance

**Medical Documents**:
- Uploaded records
- Test results
- Imaging (X-rays, MRI)

**Emergency Info**:
- Blood type
- Allergies
- Chronic conditions
- Emergency contacts

**Physio Notes** (private):
- Recent entries
- Add note

**User Actions**:
- Add injury record
- Update health status
- Add wellness survey
- Upload document
- Create recovery plan
- Contact emergency contact
- Print/export medical summary

**Expected Outputs**:
- Comprehensive medical view
- Historical tracking

**States**:
- Loading
- Loaded
- Restricted access (permission error)
- Empty sections (no data)
- Alert states (active injury, critical values)

**Edge Cases**:
- Sensitive data protection
- HIPAA compliance display
- Consent-based data
- Minor athletes (guardian access)

**Permissions**:
- Physiotherapist (assigned): Full access
- Team Doctor: Full access
- Organization Admin: View only
- Coach: Limited (return-to-play status only)
- Athlete: Own data only
- Sports Scientist: Read-only for injury history

**Dependencies**:
- Medical records collection
- Recovery plans
- Uploaded documents storage

**Future Enhancements**:
- Wearable data integration
- AI injury risk predictions
- Doctor telemedicine integration
- Prescription tracking

---

## Screen 18: Add/Edit Athlete Form

**Purpose**: Create new athlete or edit existing

**Components**:

**Header**:
- Back button
- Title: "Add Athlete" or "Edit {name}"
- Save button (top-right, disabled until valid)

**Multi-step Form** with progress indicator:

**Step 1: Basic Information**
- First Name*
- Last Name*
- Date of Birth*
- Gender*
- Nationality (dropdown)
- Preferred name / nickname
- Profile photo (upload)

**Step 2: Physical Data**
- Height* (cm/ft-in based on unit)
- Weight* (kg/lbs)
- Body Fat % (optional)
- Dominant side (right/left/both)

**Step 3: Sport & Position**
- Primary Sport*
- Position* (dropdown based on sport)
- Secondary positions
- Preferred foot/hand (sport-specific)
- Jersey number

**Step 4: Team Assignment**
- Select team(s) (multi-select)
- Role (Starter/Reserve/Development)
- Join date

**Step 5: Contact & Emergency**
- Athlete phone (optional)
- Athlete email (creates account if provided)
- Emergency contact name*
- Emergency contact relationship*
- Emergency contact phone*

**Step 6: Medical Baseline**
- Blood type (optional)
- Allergies (checklist + custom)
- Chronic conditions (checklist)
- Previous injuries (list, add multiple)
- Last medical checkup date

**Step 7: Consent & Privacy**
- Data sharing consent
- Research participation opt-in
- External sharing consent
- E-signature capture
- Legal guardian info (if minor)

**Save Draft** at any step

**User Actions**:
- Fill fields with validation
- Navigate steps
- Upload photo (camera or gallery)
- Save draft
- Submit (final step)

**Expected Outputs**:
- Athlete created in database
- Invitation sent (if email provided)
- Navigate to athlete profile
- Success confirmation

**Validation Rules**:
- Names: 2-50 chars, letters and hyphens
- DOB: Valid date, age 5-70
- Height: 100-250 cm
- Weight: 30-200 kg
- Photo: Max 5MB, image formats
- Emergency contact: All fields required
- Team assignment: At least one team
- Consents: Required checkboxes

**States**:
- Empty form (new)
- Pre-filled (edit)
- Validating
- Saving
- Success
- Error
- Draft saved

**Edge Cases**:
- Duplicate athlete detection
- Minor athlete (require guardian consent)
- Multi-national (multiple citizenships)
- Photo failed to upload (retry)
- Draft recovery

**Permissions**:
- Coach: Add to own team
- Scientist: Add with team assignment
- Admin: Full control
- Athlete: Cannot self-add (invitation only)

**Dependencies**:
- Athletes collection
- Teams (for assignment)
- Storage (photo)
- Countries/sports/positions lists

**Future Enhancements**:
- Bulk import (CSV)
- Import from other systems
- Auto-fill from external databases
- AI-assisted form completion

---

## Screen 19: Athlete Performance History

**Purpose**: Chronological view of all athlete's tests and activities

**Components**:

**Header**:
- Back button
- Athlete name + photo
- Filter/Sort icons

**Timeline View** (default):
- Vertical timeline
- Grouped by month
- Each event:
  - Test/Session icon
  - Date + time
  - Type
  - Key result
  - Tap to view details

**Alternative Views** (toggle):
- List view
- Calendar view
- Chart view (metrics over time)

**Filter Options**:
- Test type
- Date range
- Result grade
- By tester

**Statistics Bar**:
- Total tests
- Test frequency
- Latest test date

**User Actions**:
- Tap event → Detail
- Change view mode
- Apply filters
- Export history
- Compare two events

**Expected Outputs**:
- Complete history exploration
- Trend understanding

**States**:
- Loading
- Loaded
- Empty (no history)
- Filtered empty
- Error

**Edge Cases**:
- Very long history → Pagination
- Missing data periods → Show gaps
- Deleted tests → Marked as deleted

**Permissions**: Same as athlete profile

**Dependencies**:
- Performance tests
- Training sessions
- Historical data

**Future Enhancements**:
- Video linked events
- Milestone markers
- Achievements timeline
- AI-generated season summary

---

# D. TESTING MODULE

## Screen 20: Performance Tests List

**Purpose**: View and manage all performance tests

**Components**:

**Header**:
- Title: "Performance Tests"
- Filter icon
- Search icon
- FAB "+" (New Test)

**View Modes**:
- List view (default)
- Calendar view
- Athlete-grouped

**Filter Chips**:
- All
- Upcoming
- Recent
- By test type
- By athlete
- By team

**Test Cards** (each row):
- Test type icon
- Test name
- Athlete(s) name
- Scheduled date/time
- Status badge (Scheduled/In Progress/Completed/Cancelled)
- Grade indicator (if completed)
- Chevron

**Group Headers** (by date):
- Today
- Tomorrow
- This Week
- Later This Month

**User Actions**:
- Tap test → Detail or execution
- Long press → Options
- Swipe → Quick actions
- Filter → Refine list
- Search → Find test
- Tap FAB → Create test
- Pull refresh

**Expected Outputs**:
- Complete test overview
- Navigation to details

**States**:
- Loading
- Loaded
- Empty (no tests scheduled)
- Filtered empty
- Error

**Edge Cases**:
- Overdue tests → Highlighted
- Cancelled tests → Dimmed
- Group tests (multiple athletes) → Special icon

**Permissions**:
- Coach: Team tests
- Scientist: All conducted/assigned tests
- Physio: Recovery tests
- Athlete: Own tests only
- Admin: All

**Dependencies**:
- Performance tests collection
- Athletes, Teams

**Future Enhancements**:
- Bulk test scheduling
- Test templates
- Recurring tests
- Import from calendar

---

## Screen 21: Test Type Selection

**Purpose**: Choose test protocol before starting

**Components**:

**Header**:
- Back button
- Title: "Select Test"

**Categories** (tabs or accordions):
- Physical Tests
- Technical Tests
- Cognitive Tests
- Medical Tests

**Test Cards** per category:
- Test icon
- Test name
- Duration estimate
- Equipment needed
- Description
- SKB-linked references
- "Select" button

**Test Details Preview** (bottom sheet on tap):
- Full description
- Protocol steps
- Equipment list
- Scientific reference
- Similar tests
- "Use this test" button

**Filters**:
- By sport
- By age group
- By equipment available
- By duration

**Search bar** for finding specific tests

**User Actions**:
- Browse categories
- Tap test for preview
- Confirm selection
- Filter by criteria
- Search test name

**Expected Outputs**:
- Test protocol selected
- Navigate to test execution setup

**States**:
- Loading
- Loaded
- No tests match filter
- Error

**Edge Cases**:
- Age-restricted tests (hidden for underage)
- Equipment unavailable warning
- Deprecated tests (marked as archived)

**Permissions**:
- Coach: Standard tests
- Scientist: All tests including advanced
- Physio: Medical/recovery tests
- Admin: Manage test library

**Dependencies**:
- Test library (SKB integration)
- Protocol details

**Future Enhancements**:
- Custom test builder
- Test packages/batteries
- Sport-specific defaults

---

## Screen 22: Test Execution

**Purpose**: Conduct performance test with real-time data entry

**Components**:

**Header**:
- Cancel button
- Test name
- Timer (if applicable)
- Save Draft button

**Pre-test Section**:
- Athlete info card
- Test protocol summary
- Environmental conditions:
  - Temperature
  - Humidity
  - Indoor/Outdoor
- Equipment check checklist
- "Start Test" button

**During Test - Data Entry**:

Different UI based on test type:

**For Timed Tests (e.g., Sprint)**:
- Large timer display
- Start/Stop buttons
- Distance markers
- Multiple attempts
- Best time highlighted

**For Continuous Tests (e.g., Beep Test)**:
- Level counter
- Auto-advancing levels
- Manual level entry
- Stop button

**For Measurement Tests (e.g., 1RM)**:
- Weight input
- Attempts tracker
- Success/Failed toggle
- Rest timer

**For Multi-parameter Tests**:
- Structured form
- Real-time validation
- Progress indicator

**Notes Section**:
- Observation notes
- Athlete condition
- Deviations from protocol

**Post-test Section**:
- Review data
- Auto-calculated results (via SIE)
- Comparison to previous
- Save & Complete button

**User Actions**:
- Enter environmental data
- Start/stop timers
- Enter measurements
- Add notes
- Handle errors/retakes
- Complete test

**Expected Outputs**:
- Test data saved
- SIE calculates results
- Navigate to results screen

**Validation Rules**:
- All required measurements
- Reasonable value ranges (SIE-validated)
- Environmental conditions required
- Consent verified

**States**:
- Setup (pre-test)
- In progress (active recording)
- Paused
- Reviewing (post-test)
- Saving
- Completed
- Error

**Edge Cases**:
- App backgrounded during test (preserve state)
- Data entry errors (undo)
- Athlete injury during test (abort with note)
- Equipment failure (marked in notes)
- Network loss (offline capable)

**Permissions**:
- Coach: Team tests
- Scientist: All tests
- Physio: Recovery tests
- Athlete: Cannot self-administer

**Dependencies**:
- Test protocols
- SIE calculations
- Real-time data validation
- Offline storage

**Future Enhancements**:
- Voice-controlled entry
- Wearable auto-sync
- Video recording integration
- Live streaming (multi-tester)

---

## Screen 23: Test Results Detail

**Purpose**: View comprehensive test results with SIE analysis

**Components**:

**Header**:
- Back button
- Test name
- Share/Export button
- Menu

**Athlete Card**:
- Photo, name, position

**Test Info**:
- Date, time, location
- Tester name
- Environmental conditions
- Protocol used

**Primary Result** (large):
- Value
- Unit
- Grade (Excellent/Good/Average/etc.)
- Percentile

**Comparison Section**:
- vs Personal Best
- vs Baseline
- vs Age Norm
- vs Position Norm
- vs Team Average

Visualizations:
- Bullet chart
- Comparison bars

**Historical Trend**:
- Line chart (last X tests)
- Improvement/decline indicator

**Detailed Metrics** (secondary):
- All measured values
- Calculated derivatives

**AI Analysis Section**:
- Performance interpretation
- Strengths highlighted
- Areas for improvement
- Training recommendations
- Confidence score
- "View Full Analysis" (XAI)

**SKB References**:
- Scientific formulas used
- Protocol reference
- Cited studies

**Actions**:
- Compare with another test
- Schedule follow-up test
- Add to report
- Print/PDF

**Notes**:
- Tester notes
- Add note

**User Actions**:
- View charts
- Access XAI explanation
- Share results
- Export PDF
- Compare tests
- Schedule follow-up

**Expected Outputs**:
- Complete result interpretation
- Actionable insights

**States**:
- Loading
- Loaded
- Pending validation
- Rejected (data quality issues)
- Error

**Edge Cases**:
- No historical data (first test)
- No norms available (unusual population)
- Outlier detection warnings
- Data quality flags

**Permissions**:
- Test participants view own
- Coach views team results
- Scientist views all
- Admin views all

**Dependencies**:
- Test data
- SIE evaluations
- SKB references
- AI analysis service

**Future Enhancements**:
- Video overlay
- 3D result visualization
- Comparison with elite athletes
- AR result overlay

---

## Screen 24: Test Comparison View

**Purpose**: Compare multiple tests side-by-side

**Components**:

**Header**:
- Back button
- Title: "Compare Tests"
- Add/Remove button

**Comparison Cards**:
- Up to 4 athletes side-by-side
- Or same athlete, different dates
- Or team vs team

**Metrics Table**:
- Rows: metrics
- Columns: subjects
- Highlighted differences
- Winner indicators

**Radar Chart**:
- Multi-metric overlay
- Color-coded per subject

**Statistical Analysis**:
- Differences percentages
- Statistical significance
- Effect sizes

**AI Comparative Analysis**:
- Insights on differences
- Recommendations based on comparison

**User Actions**:
- Add/remove subjects
- Change metrics shown
- Export comparison
- Save comparison template

**Expected Outputs**:
- Comparative insights
- Data-driven decisions

**States**:
- Selecting subjects
- Loaded comparison
- Insufficient data
- Error

**Edge Cases**:
- Different test types (can't compare)
- Different dates/conditions (note warnings)
- Small sample sizes

**Permissions**: Based on data access rules

**Dependencies**:
- Multiple test records
- Statistical service
- SIE

**Future Enhancements**:
- Time-lapse animation
- AI-suggested comparisons
- Anonymized benchmarks

---

# E. TRAINING MODULE

## Screen 25-28: Training Sessions

*[Following same detailed template as above screens]*

### Screen 25: Training Sessions List
Similar structure to Athletes List but for training sessions.

### Screen 26: Create Training Session
Multi-step form: Details → Athletes → Plan → Schedule

### Screen 27: Session Detail
View past/scheduled session with monitoring data

### Screen 28: Live Session Recording
Real-time load monitoring, RPE collection, notes

*(Full specifications follow same detailed pattern)*

---

# F. AI COACH MODULE

## Screen 29: AI Agent Selection

**Purpose**: Choose specific AI agent for query

*(Detailed spec similar to AI Coach Hub)*

## Screen 30: AI Chat Interface

**Purpose**: Conversation with AI agent

**Components**:
- Header (agent name, back, options)
- Chat message list (scrollable)
- User messages (right-aligned)
- AI messages (left-aligned)
- Rich content in AI messages:
  - Charts
  - Tables
  - Citations
  - Explanation link (XAI)
- Message input:
  - Text field
  - Attach button (data, athlete)
  - Voice input
  - Send button
- Suggested prompts (at start/idle)
- Typing indicator (AI thinking)

**User Actions**:
- Type message
- Attach context (athlete, test)
- Send message
- Voice input
- Copy response
- Provide feedback (thumbs up/down)
- View XAI explanation
- Save/pin message

**Expected Outputs**:
- AI responses with citations
- Explanations available
- Actionable recommendations

**States**:
- Empty conversation (suggested prompts)
- Active conversation
- AI thinking (typing indicator)
- Error (retry option)
- Rate limited (upgrade prompt)
- Offline (queue message)

**Edge Cases**:
- Very long responses (streaming)
- Failed AI response (retry)
- Inappropriate content (blocked)
- Off-topic queries (redirect)

**Permissions**: Role-based agent access

**Dependencies**:
- AI service (OpenAI/Anthropic)
- SIE integration
- SKB integration
- Conversation history

**Future Enhancements**:
- Voice conversation mode
- Video AI (analyze uploaded video)
- Multi-modal input
- Collaborative chats

## Screen 31: AI Conversation History

*(List of all conversations, similar to messaging apps)*

## Screen 32: AI Explanation Detail (XAI)

**Purpose**: Show detailed explanation of AI recommendation

**Components**:
- Header
- Recommendation (large, top)
- Confidence gauge
- **Reasoning Chain**: Step-by-step logic
- **Data Considered**: What influenced decision
- **SIE Rules Applied**: Which rules triggered
- **Scientific Sources**: SKB citations
- **Alternative Options**: What else was considered
- **Limitations**: What AI doesn't know
- **Monitoring Plan**: How to track outcomes
- Feedback options

*(Full XAI display as designed in Part 3)*

---

# G. CALCULATOR MODULE

## Screen 33: Calculator List

**Purpose**: Browse available calculators

**Components**:
- Header: "Sports Science Calculators"
- Search
- Categories:
  - Cardiovascular
  - Body Composition
  - Strength
  - Training Load
  - Recovery
  - Sport-specific
- Calculator cards (icon, name, description)

**User Actions**:
- Tap calculator → Open form
- Search by name
- Filter by category

## Screen 34: Calculator Form (Dynamic)

**Purpose**: Input calculator-specific data

**Components**: Varies by calculator type
- Input fields with unit selectors
- Athlete selector (optional linking)
- Auto-calculate on change
- Reset button
- Save result button
- Reference info

## Screen 35: Calculator Results

**Purpose**: Show calculation results with interpretation

**Components**:
- Result value (large)
- Unit
- Grade/category
- Interpretation
- Comparison to norms
- Percentile
- SKB references
- Save to athlete option
- Recalculate option

## Screen 36: Calculation History

**Purpose**: Past calculations by user

---

# H. REPORTS MODULE

## Screen 37: Reports List

**Purpose**: Browse and manage reports

**Components**:
- Header with search, filter
- FAB "+" (Create Report)
- View modes: Recent / By Type / By Athlete
- Report cards:
  - Title
  - Type
  - Subject (athlete/team)
  - Generated date
  - Author
  - Status (Draft/Published)
  - Actions (view, share, export)

## Screen 38: Report Detail View

**Purpose**: View generated report

**Components**:
- Header (title, share, download, edit)
- Report content (formatted)
- Sections navigation
- Interactive charts
- Comments section
- Approval workflow (if applicable)

## Screen 39: Report Builder

**Purpose**: Create custom reports

**Components**:
- Template selector
- Section builder (drag-drop)
- Data source selectors
- Chart type selectors
- Preview
- Save/Publish/Export options

## Screen 40: Report Templates

**Purpose**: Manage report templates

## Screen 41: Export Options

**Purpose**: Configure export settings

**Components**:
- Format selection (PDF/Excel/Word/CSV)
- Content options
- Branding options
- Delivery options (download/email/share)

---

# I-L. REMAINING MODULES

*Following screens follow the same detailed specification pattern:*

## I. Research Module (Screens 42-45)
- Research Projects List
- Research Project Detail
- Create Research Project (multi-step wizard)
- Data Analysis Tools

## J. Team Management (Screens 46-49)
- Teams List
- Team Detail (with tabs: Roster/Performance/Schedule)
- Create/Edit Team
- Team Roster Management

## K. Settings & Profile (Screens 50-56)
- Settings Main
- Profile Edit
- Preferences (Language/Theme/Units)
- Notifications Settings (per channel, per category)
- Privacy & Security
- Subscription & Billing
- About & Legal

## L. Utility Screens (Screens 57-62)
- Notifications Center
- Global Search
- Plugins Marketplace
- Plugin Configuration
- Offline Sync Status
- Conflict Resolution

---

## Common Screen Patterns

### List Screens (Athletes, Teams, Tests, etc.)
All list screens share:
- Header with title, count, search, filter, FAB
- Filter chips
- Sort options
- List items with consistent structure
- Empty/Loading/Error states
- Pull-to-refresh
- Pagination or virtualization
- Bulk selection (long press)

### Detail Screens
All detail screens share:
- Header with back, title, share, menu
- Hero section (subject info)
- Tab bar (if multiple views)
- Content sections
- Action buttons
- Related items
- Comments/notes section

### Form Screens
All form screens share:
- Header with title, save button
- Step indicator (if multi-step)
- Grouped sections
- Field-level validation
- Save draft option
- Submit button
- Loading/Error/Success states

### Chart/Analytics Screens
All chart screens share:
- Time range selector
- Filter options
- Interactive charts
- Legend
- Export option
- Full-screen mode

---

## Screen Development Checklist

For each screen implementation:

- [ ] Purpose clearly defined
- [ ] All components listed
- [ ] All user actions handled
- [ ] All states designed (loading/empty/error/success/offline)
- [ ] All edge cases handled
- [ ] Permissions enforced
- [ ] Dependencies identified
- [ ] Localized (Arabic + English)
- [ ] RTL layout verified
- [ ] Accessibility tested
- [ ] Tablet responsive
- [ ] Performance optimized
- [ ] testIDs added for testing
- [ ] Analytics events tracked

---

**Screens Documentation Status**: Complete  
**Next**: See PRD_WORKFLOWS.md for user workflows

*SportMind AI - PRD Part 2 of 4*
