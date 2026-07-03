# SportMind AI - System Architecture Specification (Part 2)

**Continuation of SYSTEM_ARCHITECTURE.md**

---

## User Roles & Permissions (RBAC)

### Role Hierarchy

```
Level 10: Super Admin (Platform-wide)
                    │
Level 9:  Organization Admin (Organization-wide)
                    │
Level 8:  University / Club (Institutional)
                    │
Level 7:  Coach / Sports Scientist / Researcher
                    │
Level 6:  Assistant Coach / Physiotherapist
                    │
Level 5:  Athlete
```

### Permission Model

**Permission Format**: `resource:action:scope`

**Actions**:
- `create` - Create new resources
- `read` - View resources
- `update` - Modify resources
- `delete` - Remove resources
- `export` - Export data
- `share` - Share with others
- `approve` - Approve workflows

**Scopes**:
- `own` - Only own data
- `assigned` - Data assigned to user
- `team` - Team-level access
- `organization` - Organization-wide
- `all` - Platform-wide (super admin only)

---

### Role 1: Super Admin

**Scope**: Platform-wide (across all organizations)  
**Purpose**: SportMind AI platform administrators

**Permissions**:
| Resource | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| Organizations | ✅ all | ✅ all | ✅ all | ✅ all | Full platform control |
| Users | ✅ all | ✅ all | ✅ all | ✅ all | Any user in any org |
| System Settings | ✅ all | ✅ all | ✅ all | ✅ all | Global config |
| SIE Formulas | ✅ all | ✅ all | ✅ all | ✅ all | Modify science engine |
| AI Configuration | ✅ all | ✅ all | ✅ all | ✅ all | AI providers, models |
| Audit Logs | ❌ | ✅ all | ❌ | ❌ | Read-only access |
| Billing & Subscriptions | ✅ all | ✅ all | ✅ all | ✅ all | Financial ops |
| Feature Flags | ✅ all | ✅ all | ✅ all | ✅ all | Enable/disable features |
| Support Tools | ✅ all | ✅ all | ✅ all | ✅ all | Access customer data |

**Special Capabilities**:
- Impersonate any user for support
- Access all organization data
- Modify SIE formulas and normative values
- Deploy AI model updates
- Handle billing disputes

**Restrictions**:
- Cannot modify audit logs
- All actions are logged with elevated audit tier
- Requires 2FA for sensitive operations

---

### Role 2: Organization Admin

**Scope**: Single organization  
**Purpose**: Manage the entire organization (club, university, research center)

**Permissions**:
| Resource | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| Organization Settings | ❌ | ✅ own | ✅ own | ❌ | Their org only |
| Users (in org) | ✅ org | ✅ org | ✅ org | ✅ org | Manage all users |
| Teams | ✅ org | ✅ org | ✅ org | ✅ org | All teams |
| Athletes | ✅ org | ✅ org | ✅ org | ✅ org | All athletes |
| Performance Tests | ✅ org | ✅ org | ✅ org | ✅ org | All tests |
| Training Sessions | ✅ org | ✅ org | ✅ org | ✅ org | All sessions |
| Reports | ✅ org | ✅ org | ✅ org | ✅ org | All reports |
| Medical Records | ✅ org | ✅ org | ✅ org | ✅ org | Full access |
| Financial Data | ✅ org | ✅ org | ✅ org | ✅ org | If org has finance module |
| Audit Logs (org) | ❌ | ✅ org | ❌ | ❌ | Their org only |
| Roles & Permissions | ❌ | ✅ org | ✅ org | ❌ | Assign roles |
| AI Conversations | ❌ | ✅ org | ❌ | ✅ org | Can review AI usage |
| Research Projects | ✅ org | ✅ org | ✅ org | ✅ org | All projects |

**Special Capabilities**:
- Invite new users to organization
- Assign roles to users
- Configure organization settings (branding, timezone)
- Access all athlete data (including medical)
- Export any organization data
- Approve/reject research projects
- Manage subscription and billing (within org)

**Restrictions**:
- Cannot access other organizations
- Cannot modify SIE formulas
- Cannot change platform-wide settings

---

### Role 3: Coach (Head Coach)

**Scope**: Assigned teams + all athletes in their teams  
**Purpose**: Lead coaching for a team

**Permissions**:
| Resource | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| Own Team | ❌ | ✅ | ✅ | ❌ | Their assigned team |
| Team Athletes | ✅ team | ✅ team | ✅ team | ❌ | Add/update athletes |
| Training Sessions | ✅ team | ✅ team | ✅ team | ✅ own | Own team only |
| Performance Tests | ✅ team | ✅ team | ✅ team | ✅ own | Order tests, view results |
| Reports | ✅ team | ✅ team | ✅ own | ✅ own | Team reports |
| AI Coach | ✅ own | ✅ own | ❌ | ✅ own | Personal AI use |
| Medical Records | ❌ | ✅ team | ❌ | ❌ | Read-only, non-detailed |
| Team Roster | ✅ team | ✅ team | ✅ team | ❌ | Manage lineup |
| Calendar/Schedule | ✅ team | ✅ team | ✅ team | ✅ team | Team schedule |
| Notes on Athletes | ✅ team | ✅ team | ✅ own | ✅ own | Coaching notes |
| Communications | ✅ team | ✅ team | ❌ | ❌ | Message team |
| Other Teams (Read) | ❌ | ✅ org | ❌ | ❌ | View for benchmarking |

**Special Capabilities**:
- Design and modify training plans
- Assign athletes to training groups
- Approve/reject athlete transfers
- Generate coaching reports
- Interact with AI Coach agent extensively
- Set team performance goals
- Access performance benchmarking

**Restrictions**:
- Cannot delete athletes or teams
- Cannot access detailed medical records
- Cannot modify organization settings
- Cannot access other teams' internal data

---

### Role 4: Assistant Coach

**Scope**: Assigned team (with reduced permissions vs. Head Coach)  
**Purpose**: Support head coach with team operations

**Permissions**:
| Resource | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| Team Athletes | ❌ | ✅ team | ✅ team | ❌ | Cannot add new |
| Training Sessions | ✅ team | ✅ team | ✅ own | ❌ | Own sessions only |
| Performance Tests | ❌ | ✅ team | ❌ | ❌ | Read-only |
| Reports | ✅ own | ✅ team | ✅ own | ✅ own | Own reports |
| AI Coach | ✅ own | ✅ own | ❌ | ✅ own | Personal AI use |
| Notes on Athletes | ✅ own | ✅ team | ✅ own | ✅ own | Own notes |
| Calendar | ❌ | ✅ team | ❌ | ❌ | Read-only |
| Attendance | ✅ team | ✅ team | ✅ team | ❌ | Track attendance |

**Special Capabilities**:
- Record training session data
- Take attendance
- Add coaching notes
- Generate personal reports
- Use AI Coach for planning

**Restrictions**:
- Cannot modify training plans (only head coach)
- Cannot delete session data
- Cannot access medical information
- Cannot approve/reject transfers

---

### Role 5: Sports Scientist

**Scope**: Assigned athletes (across teams) + Research access  
**Purpose**: Scientific analysis and testing

**Permissions**:
| Resource | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| Performance Tests | ✅ assigned | ✅ org | ✅ own | ✅ own | Full test control |
| Test Protocols | ✅ org | ✅ org | ✅ own | ✅ own | Design protocols |
| Athletes | ❌ | ✅ org | ✅ assigned | ❌ | Update performance data |
| Baseline Data | ✅ assigned | ✅ org | ✅ assigned | ❌ | Set baselines |
| Reports (Scientific) | ✅ org | ✅ org | ✅ own | ✅ own | Full report access |
| Calculators | ✅ own | ✅ own | ❌ | ✅ own | Extensive use |
| SIE Data | ❌ | ✅ all | ❌ | ❌ | Read formulas & norms |
| AI Sports Scientist | ✅ own | ✅ own | ❌ | ✅ own | Primary user |
| Research Projects | ✅ org | ✅ org | ✅ own | ✅ own | Full research access |
| Statistical Analysis | ✅ org | ✅ org | ✅ own | ✅ own | Advanced analysis |
| Normative Data | ❌ | ✅ all | ❌ | ❌ | Reference values |

**Special Capabilities**:
- Design and validate performance tests
- Perform statistical analysis
- Contribute to research projects
- Access all normative databases
- Publish internal research papers
- Cross-team comparative analysis
- Use advanced AI Sports Scientist agent

**Restrictions**:
- Cannot access detailed medical records (physio only)
- Cannot manage team lineups
- Cannot modify SIE formulas (super admin only)

---

### Role 6: Physiotherapist

**Scope**: Assigned athletes + Medical data access  
**Purpose**: Medical care, injury prevention, recovery

**Permissions**:
| Resource | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| Medical Records | ✅ assigned | ✅ assigned | ✅ own | ✅ own | Full medical access |
| Injury Records | ✅ org | ✅ org | ✅ own | ❌ | Track injuries |
| Recovery Plans | ✅ assigned | ✅ assigned | ✅ own | ✅ own | Create plans |
| Recovery Tests | ✅ assigned | ✅ assigned | ✅ own | ✅ own | Recovery metrics |
| Athletes | ❌ | ✅ assigned | ✅ assigned | ❌ | Medical fields only |
| Wellness Data | ✅ assigned | ✅ assigned | ✅ own | ❌ | Track wellness |
| Reports (Medical) | ✅ own | ✅ own | ✅ own | ✅ own | Confidential |
| AI Recovery Expert | ✅ own | ✅ own | ❌ | ✅ own | Primary user |
| Training Load | ❌ | ✅ assigned | ❌ | ❌ | Read for injury prevention |
| Return to Play | ✅ assigned | ✅ assigned | ✅ own | ❌ | RTP protocols |
| Medical History | ✅ assigned | ✅ assigned | ✅ own | ❌ | Update history |

**Special Capabilities**:
- Full access to medical records
- Create injury reports
- Design recovery protocols
- Return-to-play decisions
- Coordinate with medical staff
- Use AI Recovery Expert extensively
- Track wellness surveys

**Restrictions**:
- Cannot modify performance test data
- Cannot manage training plans
- Cannot access non-assigned athletes' medical data
- Medical records visible only to physio, doctors, and org admin

---

### Role 7: Athlete

**Scope**: Own data only  
**Purpose**: View personal performance and interact with system

**Permissions**:
| Resource | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| Own Profile | ❌ | ✅ own | ✅ own | ❌ | Basic info only |
| Own Performance Data | ❌ | ✅ own | ❌ | ❌ | View only |
| Own Medical Data | ❌ | ✅ own | ❌ | ❌ | View only |
| Own Reports | ❌ | ✅ own | ❌ | ❌ | View & download |
| Wellness Surveys | ✅ own | ✅ own | ✅ own | ❌ | Submit daily |
| RPE Ratings | ✅ own | ✅ own | ✅ own | ❌ | Self-report |
| Training Schedule | ❌ | ✅ own | ❌ | ❌ | View calendar |
| Team Information | ❌ | ✅ team | ❌ | ❌ | Read-only team info |
| AI Coach | ✅ own | ✅ own | ❌ | ✅ own | Personal AI assistant |
| Goals | ✅ own | ✅ own | ✅ own | ✅ own | Personal goals |
| Nutrition Log | ✅ own | ✅ own | ✅ own | ✅ own | Track nutrition |
| Sleep/Recovery Log | ✅ own | ✅ own | ✅ own | ✅ own | Personal tracking |

**Special Capabilities**:
- View personal performance trends
- Submit wellness surveys
- Report RPE after sessions
- Access personal AI coach for advice
- Set personal goals
- View own reports (with permission)
- Communicate with coaches (if enabled)

**Restrictions**:
- Cannot view other athletes' data
- Cannot modify performance test results
- Cannot access medical records of others
- Cannot see internal coaching notes
- Cannot access financial/administrative data

---

### Role 8: Researcher

**Scope**: Approved research projects + Anonymized data  
**Purpose**: Academic research and studies

**Permissions**:
| Resource | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| Research Projects | ✅ own | ✅ own | ✅ own | ✅ own | Own projects |
| Anonymized Data | ❌ | ✅ approved | ❌ | ❌ | Only approved studies |
| Consent Records | ❌ | ✅ own | ❌ | ❌ | Verify consent |
| Publications | ✅ own | ✅ own | ✅ own | ✅ own | Academic outputs |
| Statistical Tools | ✅ own | ✅ own | ❌ | ✅ own | Full analytics |
| SIE Data | ❌ | ✅ all | ❌ | ❌ | Formula references |
| AI Research Assistant | ✅ own | ✅ own | ❌ | ✅ own | Primary user |
| Cohort Selection | ✅ own | ✅ own | ✅ own | ✅ own | Design cohorts |
| Data Export | ❌ | ❌ | ❌ | ❌ | Requires approval |
| Ethics Approval | ❌ | ✅ own | ❌ | ❌ | Track approvals |

**Special Capabilities**:
- Design research studies
- Access anonymized data pools
- Statistical analysis tools
- Publish findings
- Use AI Research Assistant
- Cross-organization collaboration (with permission)
- Access historical data for meta-analysis

**Restrictions**:
- Cannot access identifiable athlete data
- Requires ethics approval for studies
- Data export requires organization approval
- Cannot modify performance data
- Read-only for most collections

---

### Role 9: University

**Scope**: Institutional level (multiple researchers, students)  
**Purpose**: Academic institution management

**Permissions**:
| Resource | Create | Read | Update | Delete | Notes |
|----------|--------|------|--------|--------|-------|
| Researchers (Manage) | ✅ inst | ✅ inst | ✅ inst | ✅ inst | Manage research staff |
| Research Projects | ✅ inst | ✅ inst | ✅ inst | ✅ inst | Institutional |
| Student Access | ✅ inst | ✅ inst | ✅ inst | ✅ inst | Grant student access |
| Publications | ✅ inst | ✅ inst | ✅ inst | ✅ inst | Institutional publications |
| Ethics Committee | ✅ inst | ✅ inst | ✅ inst | ✅ inst | Approve studies |
| Partnerships | ✅ inst | ✅ inst | ✅ inst | ✅ inst | Manage club partnerships |
| Anonymized Data | ❌ | ✅ approved | ❌ | ❌ | Broad access |
| Academic Courses | ✅ inst | ✅ inst | ✅ inst | ✅ inst | Educational content |

**Special Capabilities**:
- Manage research departments
- Grant/revoke researcher access
- Approve institutional research
- Partner with sports clubs
- Create educational content
- Access broader anonymized datasets
- Manage academic publications

---

### Role 10: Club (Institutional)

**Scope**: Club-level organization (specific type of organization)  
**Purpose**: Professional sports club management

**Permissions**:
- All permissions of `Organization Admin` for their club
- Additional club-specific features:
  - Transfer market data
  - Scouting reports
  - Contract management
  - Match analysis
  - Fan/marketing data (if applicable)

**Restrictions**:
- Cannot access other clubs' data
- Cannot modify platform settings

---

### Permission Matrix Summary

| Feature | Super Admin | Org Admin | Coach | Asst Coach | Sports Scientist | Physio | Athlete | Researcher |
|---------|-------------|-----------|-------|------------|------------------|--------|---------|------------|
| Platform Settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Organization Settings | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Users | ✅ | ✅ (org) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Teams | ✅ | ✅ | ✅ (own) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Athletes | ✅ | ✅ | ✅ (team) | ❌ | ❌ | ❌ | ❌ | ❌ |
| View All Athletes | ✅ | ✅ (org) | ✅ (org) | ✅ (team) | ✅ (org) | ✅ (assigned) | ❌ | Anon only |
| Edit Athlete | ✅ | ✅ | ✅ (team) | ✅ (team) | ✅ (assigned) | ✅ (medical) | ✅ (self) | ❌ |
| Delete Athlete | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perform Tests | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ (recovery) | ❌ | ❌ |
| View Test Results | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (own) | ✅ (own) | Anon |
| Access Medical | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ (own) | ❌ |
| Generate Reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (research) |
| Use AI Coach | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Use AI Analyst | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Use AI Recovery | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ (own) | ❌ |
| Use AI Scientist | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Use AI Research | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Export Data | ✅ | ✅ | ✅ (team) | ❌ | ✅ | ✅ (medical) | ✅ (own) | Approved |
| View Audit Logs | ✅ | ✅ (org) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Billing | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

### Implementation Strategy

**Firebase Custom Claims**:
```javascript
{
  role: "coach",
  organizationId: "org_12345",
  teamIds: ["team_001", "team_002"],
  permissions: ["create:test", "read:athlete:team", ...],
  isActive: true
}
```

**Client-side Guards**:
- Route guards based on role
- UI element visibility based on permissions
- API call validation before request

**Server-side Enforcement**:
- Firestore Security Rules (primary)
- Cloud Functions for complex logic
- Middleware for API endpoints (if using custom backend)

---

## User Flows

### Flow 1: User Registration

```
┌─────────────────────────────────────────────────────────────┐
│                     USER REGISTRATION FLOW                    │
└─────────────────────────────────────────────────────────────┘

  Landing Page
       │
       ▼
  [Sign Up Button]
       │
       ▼
  Registration Type Selection
       │
       ├─── Individual (Athlete/Researcher)
       │        │
       │        ▼
       │    Fill Personal Info
       │        │
       │        ▼
       │    Verify Email
       │        │
       │        ▼
       │    Complete Profile
       │        │
       │        ▼
       │    Choose Plan (Free/Pro)
       │        │
       │        ▼
       │    Dashboard (Onboarding)
       │
       └─── Organization (Club/University)
                │
                ▼
            Organization Details
                │
                ▼
            Admin Account Setup
                │
                ▼
            Email Verification
                │
                ▼
            Subscription Selection
                │
                ▼
            Payment (if paid plan)
                │
                ▼
            Organization Setup Wizard
                │
                ├─── Set branding
                ├─── Configure settings
                ├─── Invite team members
                └─── Create first team
                │
                ▼
            Organization Dashboard
```

**Detailed Steps**:

1. **Entry Point**:
   - User clicks "Sign Up" on landing/login page
   - Presented with two options: Individual or Organization

2. **Individual Registration**:
   - Enter: Email, Password, First Name, Last Name
   - Choose role: Athlete or Researcher
   - Accept Terms of Service and Privacy Policy
   - System sends verification email
   - User clicks verification link
   - Complete profile: Date of birth, sport (if athlete), specialization (if researcher)
   - Choose subscription tier
   - Redirect to onboarding tour

3. **Organization Registration**:
   - Enter organization info: Name, type, country, size
   - Create admin account: Email, password, name
   - Choose subscription plan
   - Enter payment information (if paid)
   - Email verification
   - Setup wizard walks through:
     - Upload logo and set branding
     - Configure settings (timezone, measurement system)
     - Invite initial team members
     - Create first team
   - Dashboard access granted

4. **Post-Registration**:
   - Onboarding tour (dismissible)
   - Sample data generation option
   - Help center prompt
   - AI Coach introduction

---

### Flow 2: Organization Creation (by Super Admin or self-service)

```
┌─────────────────────────────────────────────────────────────┐
│                  ORGANIZATION CREATION FLOW                   │
└─────────────────────────────────────────────────────────────┘

  Trigger: New Organization Signup or Admin-Created
       │
       ▼
  Validate Requirements
       │
       ├─── Verify email uniqueness
       ├─── Check organization name availability
       └─── Validate subscription payment
       │
       ▼
  Create Organization Document
       │
       ├─── Generate organizationId
       ├─── Set default settings
       ├─── Initialize stats
       └─── Set subscription status
       │
       ▼
  Create Admin User
       │
       ├─── Create Firebase Auth account
       ├─── Set custom claims (role: org_admin)
       ├─── Create user document
       └─── Link to organization
       │
       ▼
  Initialize Organization Structure
       │
       ├─── Create default team (optional)
       ├─── Set up default categories
       ├─── Configure feature flags
       └─── Initialize audit log
       │
       ▼
  Send Welcome Package
       │
       ├─── Welcome email with credentials
       ├─── Setup guide PDF
       ├─── Training video links
       └─── Support contact info
       │
       ▼
  Onboarding Sequence Begins
```

---

### Flow 3: Team Creation

```
┌─────────────────────────────────────────────────────────────┐
│                     TEAM CREATION FLOW                        │
└─────────────────────────────────────────────────────────────┘

  Actor: Org Admin, Coach (with permission)
       │
       ▼
  Navigate to Teams Section
       │
       ▼
  Click "Create Team"
       │
       ▼
  Team Details Form
       │
       ├─── Team Name*
       ├─── Sport*
       ├─── Category (Professional/Youth/Amateur)
       ├─── Age Group (U-15, U-17, Senior, etc.)
       ├─── Gender
       ├─── Season Info
       ├─── Team Logo (optional)
       └─── Description
       │
       ▼
  Assign Staff
       │
       ├─── Head Coach*
       ├─── Assistant Coaches (multiple)
       ├─── Sports Scientist
       ├─── Physiotherapist
       └─── Other Staff
       │
       ▼
  Configure Team Settings
       │
       ├─── Training Schedule
       ├─── Performance Goals
       ├─── Team Rules
       └─── Communication Preferences
       │
       ▼
  Review & Confirm
       │
       ▼
  Team Created
       │
       ├─── Notification sent to staff
       ├─── Team dashboard initialized
       ├─── Default reports created
       └─── Audit log entry
       │
       ▼
  Redirect to Team Dashboard
       │
       ▼
  Prompt: Add Athletes?
       │
       ├─── Yes → Athlete Onboarding Flow
       └─── Later → Team Dashboard
```

---

### Flow 4: Athlete Onboarding

```
┌─────────────────────────────────────────────────────────────┐
│                   ATHLETE ONBOARDING FLOW                     │
└─────────────────────────────────────────────────────────────┘

  Entry Points:
  ├─── Coach creates athlete profile
  ├─── Athlete self-registers with invite code
  └─── Bulk import (CSV/Excel)
       │
       ▼
  Method Selection
       │
       ├────────────────────┬─────────────────┐
       │                    │                 │
       ▼                    ▼                 ▼
  Manual Entry      Self-Registration    Bulk Import
       │                    │                 │
       │                    │                 │
       ▼                    ▼                 ▼
  Basic Info Form    Athlete Invite      Upload File
       │              ├─Email/Code            │
       │              ├─Complete form         │
       │              └─Verify identity       │
       │                    │                 │
       └────────────────────┼─────────────────┘
                            │
                            ▼
                    Enter Personal Details
                            │
                            ├─── First/Last Name*
                            ├─── Date of Birth*
                            ├─── Gender*
                            ├─── Nationality
                            ├─── Photo (optional)
                            └─── Contact Info
                            │
                            ▼
                    Enter Physical Data
                            │
                            ├─── Height*
                            ├─── Weight*
                            ├─── Body Composition (optional)
                            └─── Dominant Side
                            │
                            ▼
                    Enter Sport Info
                            │
                            ├─── Primary Sport*
                            ├─── Position*
                            ├─── Secondary Positions
                            ├─── Career Info
                            └─── Jersey Number
                            │
                            ▼
                    Assign to Team(s)
                            │
                            ├─── Select team(s)
                            ├─── Set status (active/reserve)
                            └─── Set start date
                            │
                            ▼
                    Medical Information
                            │
                            ├─── Blood Type (optional)
                            ├─── Allergies
                            ├─── Chronic Conditions
                            ├─── Emergency Contact*
                            └─── Consent for medical data
                            │
                            ▼
                    Baseline Assessment
                            │
                            ├─── Schedule initial tests
                            ├─── Enter historical data
                            └─── Set baseline manually
                            │
                            ▼
                    Privacy & Consent
                            │
                            ├─── Data sharing preferences
                            ├─── Research participation
                            ├─── External sharing
                            └─── E-signature capture
                            │
                            ▼
                    Review & Create
                            │
                            ▼
                    Athlete Profile Created
                            │
                            ├─── Add to team roster
                            ├─── Send welcome (if self-account)
                            ├─── Create audit entry
                            ├─── Trigger notifications
                            └─── Update team stats
                            │
                            ▼
                    Prompt: Schedule First Test?
                            │
                            ├─── Yes → Performance Testing Flow
                            └─── Later → Athlete Profile
```

---

### Flow 5: Performance Testing

```
┌─────────────────────────────────────────────────────────────┐
│                  PERFORMANCE TESTING FLOW                     │
└─────────────────────────────────────────────────────────────┘

  Actor: Sports Scientist, Coach, or Physiotherapist
       │
       ▼
  Test Planning Phase
       │
       ├─── Select Test Type
       │    ├─── Physical (VO2, Sprint, Strength)
       │    ├─── Technical (Sport-specific)
       │    ├─── Psychological
       │    └─── Medical
       │
       ├─── Select Athletes
       │    ├─── Individual
       │    ├─── Team
       │    └─── Custom Group
       │
       ├─── Schedule Test
       │    ├─── Date & Time
       │    ├─── Location
       │    └─── Duration
       │
       └─── Choose Protocol
            ├─── Use existing protocol
            └─── Create custom protocol
       │
       ▼
  Pre-Test Preparation
       │
       ├─── Notify athletes (24h before)
       ├─── Send preparation guidelines
       ├─── Confirm attendance
       └─── Prepare equipment checklist
       │
       ▼
  Test Execution Day
       │
       ├─── Check-in athletes
       ├─── Verify readiness
       ├─── Record environmental conditions
       │    ├─── Temperature
       │    ├─── Humidity
       │    ├─── Altitude
       │    └─── Indoor/Outdoor
       │
       └─── Warm-up protocol
       │
       ▼
  Data Collection
       │
       ├─── Enter raw measurements
       │    ├─── Manual entry
       │    ├─── Device import (Bluetooth)
       │    └─── File upload
       │
       ├─── Real-time validation
       │    ├─── Check ranges
       │    ├─── Flag anomalies
       │    └─── Verify data quality
       │
       └─── Save incrementally
       │
       ▼
  SIE Processing (Automatic)
       │
       ├─── Apply appropriate formulas
       │    Example VO2 Max:
       │    ├─── Cooper Test formula
       │    ├─── Astrand-Rhyming formula
       │    └─── Beep test lookup
       │
       ├─── Calculate primary metrics
       ├─── Calculate secondary metrics
       └─── Determine normative comparisons
       │
       ▼
  Evaluation & Grading
       │
       ├─── Compare to athlete's baseline
       ├─── Compare to age/gender norms
       ├─── Compare to position norms
       ├─── Compare to team average
       ├─── Calculate percentile
       └─── Generate score (0-100)
       │
       ▼
  AI Analysis (Optional)
       │
       ├─── Route to Performance Analyst agent
       ├─── Analyze against historical data
       ├─── Identify strengths/weaknesses
       ├─── Generate recommendations
       └─── Suggest training focus
       │
       ▼
  Quality Validation
       │
       ├─── Automated checks
       │    ├─── Data completeness
       │    ├─── Value plausibility
       │    └─── Protocol compliance
       │
       └─── Manual review (if flagged)
       │
       ▼
  Test Record Finalized
       │
       ├─── Update athlete baseline
       ├─── Update team averages
       ├─── Trigger notifications
       │    ├─── Athlete: New test result
       │    ├─── Coach: Team update
       │    └─── Sports Scientist: Review needed
       │
       ├─── Log in audit trail
       └─── Available for reports
       │
       ▼
  Post-Test Actions
       │
       ├─── Share results with athlete
       ├─── Schedule follow-up test
       ├─── Update training plan
       └─── Generate individual report
```

---

### Flow 6: AI Analysis

```
┌─────────────────────────────────────────────────────────────┐
│                     AI ANALYSIS FLOW                          │
└─────────────────────────────────────────────────────────────┘

  Trigger Types:
  ├─── User-initiated (chat, request)
  ├─── Automated (post-test, scheduled)
  └─── System-triggered (alerts, anomalies)
       │
       ▼
  Agent Selection
       │
       ├─── User query analysis
       ├─── Context detection
       └─── Route to appropriate agent:
            │
            ├─── AI Coach (training queries)
            ├─── Performance Analyst (test results)
            ├─── Recovery Expert (injury/fatigue)
            ├─── Sports Scientist (research questions)
            ├─── Research Assistant (papers/studies)
            └─── Statistics Analyst (data analysis)
       │
       ▼
  Data Gathering Phase
       │
       ├─── Fetch relevant athlete data
       │    ├─── Performance history
       │    ├─── Recent tests
       │    ├─── Training load
       │    └─── Wellness data
       │
       ├─── Fetch context data
       │    ├─── Team information
       │    ├─── Recent sessions
       │    └─── Reports
       │
       └─── Query SIE for scientific data
            ├─── Applicable formulas
            ├─── Normative values
            ├─── Reference ranges
            └─── Evaluation rules
       │
       ▼
  SIE Consultation
       │
       ├─── Get scientific baselines
       ├─── Apply relevant formulas
       ├─── Determine evaluation logic
       └─── Retrieve decision rules
       │
       ▼
  Data Preprocessing
       │
       ├─── Anonymize if needed
       ├─── Format for AI consumption
       ├─── Structure context
       └─── Prepare prompt template
       │
       ▼
  AI Model Invocation
       │
       ├─── Select appropriate model
       │    ├─── GPT-4 (complex reasoning)
       │    ├─── Claude (long context)
       │    └─── Custom fine-tuned models
       │
       ├─── Send structured prompt
       │    ├─── System instructions
       │    ├─── SIE data references
       │    ├─── Athlete context
       │    └─── User query
       │
       └─── Handle response
       │
       ▼
  Response Validation
       │
       ├─── SIE Compliance Check
       │    ├─── Verify no unsupported claims
       │    ├─── Cross-check formulas used
       │    └─── Flag scientific inaccuracies
       │
       ├─── Safety Check
       │    ├─── Medical advice boundaries
       │    ├─── Injury risk assessment
       │    └─── Age-appropriate recommendations
       │
       └─── Quality Assurance
            ├─── Confidence scoring
            ├─── Source attribution
            └─── Reference tracking
       │
       ▼
  Response Formatting
       │
       ├─── Structure output
       │    ├─── Summary
       │    ├─── Key findings
       │    ├─── Recommendations
       │    ├─── Supporting data
       │    └─── References
       │
       ├─── Add visualizations
       │    ├─── Charts
       │    ├─── Tables
       │    └─── Diagrams
       │
       └─── Include actionable items
       │
       ▼
  Delivery to User
       │
       ├─── Chat interface (interactive)
       ├─── Report section (formal)
       └─── Notification (alert)
       │
       ▼
  Learning Loop
       │
       ├─── Capture user feedback
       ├─── Track usage patterns
       ├─── Improve prompts
       └─── Update SIE if needed
       │
       ▼
  Save to History
       │
       ├─── Conversation log
       ├─── Analysis record
       └─── SIE references used
```

---

### Flow 7: Report Generation

```
┌─────────────────────────────────────────────────────────────┐
│                   REPORT GENERATION FLOW                      │
└─────────────────────────────────────────────────────────────┘

  Initiation:
  ├─── Manual creation
  ├─── Scheduled (weekly/monthly)
  ├─── AI-triggered (insights ready)
  └─── Post-event (test completion)
       │
       ▼
  Report Type Selection
       │
       ├─── Individual Performance Report
       ├─── Team Analysis Report
       ├─── Medical Report
       ├─── Comparison Report
       ├─── Season Summary Report
       ├─── Research Report
       └─── Custom Report
       │
       ▼
  Configuration Phase
       │
       ├─── Select scope
       │    ├─── Athletes (individual/team)
       │    ├─── Date range
       │    ├─── Test types
       │    └─── Metrics
       │
       ├─── Choose template
       │    ├─── Standard templates
       │    ├─── Organization templates
       │    └─── Custom builder
       │
       ├─── Set options
       │    ├─── Include AI insights
       │    ├─── Include comparisons
       │    ├─── Include recommendations
       │    ├─── Charts style
       │    └─── Branding
       │
       └─── Configure export formats
       │
       ▼
  Data Collection
       │
       ├─── Query all relevant data
       │    ├─── Performance tests
       │    ├─── Training sessions
       │    ├─── Wellness data
       │    ├─── Medical records (if permitted)
       │    └─── AI conversations (summaries)
       │
       ├─── Apply date filters
       ├─── Handle permissions
       └─── Aggregate statistics
       │
       ▼
  SIE Analysis
       │
       ├─── Apply scientific evaluation
       ├─── Calculate percentiles
       ├─── Determine trends
       ├─── Compare to norms
       └─── Generate insights
       │
       ▼
  AI Enhancement (Optional)
       │
       ├─── Generate executive summary
       ├─── Identify key trends
       ├─── Provide recommendations
       ├─── Predict future performance
       └─── Suggest interventions
       │
       ▼
  Report Assembly
       │
       ├─── Build sections
       │    ├─── Title page
       │    ├─── Executive summary
       │    ├─── Athlete/team overview
       │    ├─── Performance metrics
       │    ├─── Trends and analysis
       │    ├─── Comparisons
       │    ├─── AI insights (if enabled)
       │    ├─── Recommendations
       │    └─── Appendix (raw data)
       │
       ├─── Generate visualizations
       │    ├─── Charts (line, bar, radar)
       │    ├─── Heatmaps
       │    ├─── Tables
       │    └─── Infographics
       │
       └─── Apply branding & formatting
       │
       ▼
  Quality Review
       │
       ├─── Automated checks
       │    ├─── Data completeness
       │    ├─── Chart accuracy
       │    └─── Formatting
       │
       └─── Manual review (if configured)
       │
       ▼
  Preview & Edit
       │
       ├─── User reviews report
       ├─── Add comments/notes
       ├─── Modify sections
       └─── Approve for final
       │
       ▼
  Final Generation
       │
       ├─── Save to database
       ├─── Generate exports (see Flow 8)
       ├─── Create shareable link
       └─── Trigger notifications
       │
       ▼
  Distribution
       │
       ├─── Notify recipients
       ├─── Email delivery (if configured)
       ├─── In-app notification
       └─── Available for download
```

---

### Flow 8: Exporting Results

```
┌─────────────────────────────────────────────────────────────┐
│                     EXPORT RESULTS FLOW                       │
└─────────────────────────────────────────────────────────────┘

  Trigger: User requests export
       │
       ▼
  Permission Check
       │
       ├─── User has export permission?
       ├─── Data privacy compliance?
       └─── Organization allows export?
       │
       ▼ (If allowed)
  Format Selection
       │
       ├─── PDF (formatted report)
       ├─── Excel (raw data + charts)
       ├─── Word (editable document)
       ├─── CSV (data only)
       ├─── JSON (API format)
       └─── PowerPoint (presentation)
       │
       ▼
  Content Configuration
       │
       ├─── Include/exclude sections
       ├─── Data anonymization option
       ├─── Include charts/images
       ├─── Include AI insights
       └─── Watermark options
       │
       ▼
  Data Preparation
       │
       ├─── Query data (with filters)
       ├─── Apply anonymization (if requested)
       ├─── Format based on export type
       └─── Generate visualizations
       │
       ▼
  Format-Specific Processing
       │
       ├─── PDF Generation
       │    ├─── Use template engine
       │    ├─── Apply branding
       │    ├─── Embed charts as images
       │    └─── Add digital signature
       │
       ├─── Excel Generation
       │    ├─── Create sheets per section
       │    ├─── Add formulas
       │    ├─── Insert charts
       │    └─── Apply cell formatting
       │
       ├─── Word Generation
       │    ├─── Use docx templates
       │    ├─── Embed rich content
       │    └─── Preserve editability
       │
       └─── CSV/JSON
            ├─── Flatten data structure
            ├─── Apply schema
            └─── Handle encoding
       │
       ▼
  File Storage
       │
       ├─── Upload to Cloud Storage
       ├─── Generate signed URL
       ├─── Set expiration (24 hours)
       └─── Record in reports collection
       │
       ▼
  Delivery Options
       │
       ├─── Direct Download
       │    └─── Browser download
       │
       ├─── Email Delivery
       │    └─── Send with attachment
       │
       ├─── Cloud Share
       │    ├─── Google Drive
       │    ├─── Dropbox
       │    └─── OneDrive
       │
       └─── Secure Link
            └─── Shareable URL with access control
       │
       ▼
  Audit & Compliance
       │
       ├─── Log export action
       ├─── Record data accessed
       ├─── Track recipient
       ├─── GDPR compliance check
       └─── Retention policy applied
       │
       ▼
  Post-Export
       │
       ├─── Notification to user
       ├─── Track download count
       └─── Expire after set period
```

---

## Notifications Architecture

### Notification Types

**Categories**:
1. **Test Results** - New test completed
2. **Training Sessions** - Session created/updated
3. **Report Ready** - Report generation complete
4. **Team Updates** - Roster changes, staff assignments
5. **System** - Platform announcements, maintenance
6. **AI Insights** - AI-generated observations
7. **Approval Requests** - Requires user approval
8. **Reminders** - Scheduled tasks, upcoming tests
9. **Alerts** - Critical (injury risk, performance drop)
10. **Social** - Comments, mentions, shares

### Delivery Channels

```
┌────────────────────────────────────────────────────┐
│              NOTIFICATION DELIVERY                   │
├────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   In-App    │  │    Email    │  │    Push    │ │
│  │  (Realtime) │  │  (SendGrid) │  │   (FCM)    │ │
│  └─────────────┘  └─────────────┘  └────────────┘ │
│         │                │                │        │
│         └────────────────┼────────────────┘        │
│                          │                         │
│                    ┌─────▼─────┐                   │
│                    │Notification│                   │
│                    │  Service   │                   │
│                    └─────┬─────┘                   │
│                          │                         │
│                    ┌─────▼─────┐                   │
│                    │ Firestore  │                   │
│                    └───────────┘                   │
└────────────────────────────────────────────────────┘
```

### Notification Rules Engine

**Priority Levels**:
- **Urgent**: Immediate (health/injury alerts)
- **High**: Within 5 minutes
- **Medium**: Within 30 minutes
- **Low**: Batched (daily digest)

**User Preferences**:
- Enable/disable per category
- Choose channels per category
- Quiet hours settings
- Digest frequency

**Smart Delivery**:
- Deduplication (avoid spam)
- Batching (group similar notifications)
- Time-zone aware (send during working hours)
- Rate limiting (max notifications per hour)

### Notification Flow

```
Event Occurs (e.g., Test Completed)
       │
       ▼
Event Trigger (Cloud Function)
       │
       ▼
Determine Recipients
       │
       ├─── Direct actor
       ├─── Related users (coach, physio)
       ├─── Team members
       └─── Watchers/subscribers
       │
       ▼
Check User Preferences
       │
       ├─── Category enabled?
       ├─── Channel preferences?
       ├─── Quiet hours?
       └─── Rate limits?
       │
       ▼
Create Notification Records
       │
       ▼
Route to Delivery Channels
       │
       ├─── In-App: Firestore write (real-time)
       ├─── Email: Queue to SendGrid
       ├─── Push: FCM message
       └─── SMS: Twilio (if enabled)
       │
       ▼
Track Delivery Status
       │
       ├─── Delivered
       ├─── Read
       ├─── Clicked
       └─── Failed (retry logic)
```

---

## SportMind Intelligence Engine (SIE)

### Overview

The **SportMind Intelligence Engine (SIE)** is a dedicated, deterministic sports science layer that operates independently from AI models. It provides:

- **Scientific accuracy** through validated formulas
- **Consistency** in evaluations
- **Reference data** (normative values)
- **Decision rules** for interpretations
- **Verifiability** - all outputs can be traced to sources

### Architecture Principle

```
┌──────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                     │
│              (Mobile App, Web Dashboard)                  │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│                      AI AGENT LAYER                       │
│         (Coach, Analyst, Recovery, Scientist, etc.)       │
│                                                           │
│    AI agents CANNOT make assumptions - they MUST consult  │
│                       SIE for scientific data              │
└─────────────────────────┬────────────────────────────────┘
                          │
                          │ SIE Consultation API
                          ▼
┌──────────────────────────────────────────────────────────┐
│         SPORTMIND INTELLIGENCE ENGINE (SIE)               │
│                                                           │
│    Deterministic, verified, scientifically-backed logic   │
└──────────────────────────────────────────────────────────┘
```

### SIE Core Modules

#### Module 1: Formulas Library

**Physical Performance Formulas**:

1. **VO2 Max Calculations**:
   - Cooper Test: `VO2max = (distance - 504.9) / 44.73`
   - Rockport Walk: `VO2max = 132.853 - (0.0769 × weight) - (0.3877 × age) + (6.315 × gender) - (3.2649 × time) - (0.1565 × HR)`
   - Beep Test: Lookup table by level completed
   - Astrand-Rhyming (submaximal)
   - Balke Treadmill Test

2. **BMI & Body Composition**:
   - BMI: `weight (kg) / height² (m)`
   - Body Fat (Jackson-Pollock 3-site)
   - Body Fat (Durnin-Womersley 4-site)
   - Lean Body Mass calculations
   - Waist-to-Hip Ratio

3. **Cardiovascular**:
   - Max Heart Rate: 
     - Tanaka: `208 - (0.7 × age)`
     - Fox: `220 - age`
     - Nes: `211 - (0.64 × age)`
   - Heart Rate Reserve (Karvonen)
   - Heart Rate Zones (5-zone model)
   - Recovery Heart Rate

4. **Speed & Power**:
   - Sprint velocity calculations
   - Force-Velocity Profile
   - Power output (bike, running)
   - Anaerobic capacity
   - Rate of Force Development (RFD)

5. **Strength**:
   - 1RM estimations (Brzycki, Epley, Lombardi)
   - Relative strength (kg/BW)
   - Power-to-weight ratio
   - Strength endurance

6. **Training Load**:
   - Session RPE (sRPE): `RPE × duration`
   - Acute:Chronic Workload Ratio (ACWR)
   - Training Impulse (TRIMP)
   - PlayerLoad™ (proprietary)
   - Monotony and Strain

7. **Recovery**:
   - Recovery Time estimation
   - Fatigue Index
   - HRV analysis
   - Wellness composite scores

8. **Sport-Specific**:
   - Football: xG, sprint counts, high-intensity distance
   - Basketball: Efficiency ratings, plus-minus
   - Endurance sports: Critical Power, FTP
   - Combat sports: Combat readiness index

#### Module 2: Normative Data

**Reference Databases**:

1. **Age-Based Norms**:
   ```
   VO2 Max (ml/kg/min) - Male
   ┌─────────┬───────────┬──────┬─────────┬───────────┬──────┐
   │ Age     │ Excellent │ Good │ Average │ Below Avg │ Poor │
   ├─────────┼───────────┼──────┼─────────┼───────────┼──────┤
   │ 20-29   │ 55+       │ 46-55│ 42-45   │ 37-41     │ <37  │
   │ 30-39   │ 52+       │ 43-52│ 39-42   │ 35-38     │ <35  │
   │ 40-49   │ 50+       │ 39-49│ 35-38   │ 31-34     │ <31  │
   │ 50-59   │ 45+       │ 36-44│ 32-35   │ 28-31     │ <28  │
   │ 60+     │ 42+       │ 33-41│ 30-32   │ 26-29     │ <26  │
   └─────────┴───────────┴──────┴─────────┴───────────┴──────┘
   ```

2. **Position-Specific Norms** (Football):
   ```
   Sprint 30m (seconds) - Elite Football
   ┌────────────────┬───────────┬─────────┐
   │ Position       │ Elite     │ Average │
   ├────────────────┼───────────┼─────────┤
   │ Goalkeeper     │ 4.10-4.30 │ 4.35    │
   │ Center Back    │ 4.00-4.20 │ 4.25    │
   │ Full Back      │ 3.90-4.10 │ 4.15    │
   │ Midfielder     │ 3.95-4.15 │ 4.20    │
   │ Winger         │ 3.85-4.05 │ 4.10    │
   │ Forward        │ 3.90-4.10 │ 4.15    │
   └────────────────┴───────────┴─────────┘
   ```

3. **Sport-Specific Norms**:
   - Elite standards by sport
   - National-level standards
   - Amateur standards
   - Youth development benchmarks

4. **Gender-Specific Norms**:
   - Male reference values
   - Female reference values
   - Adjustments for youth (male/female)

5. **Population Norms**:
   - General population baselines
   - Sedentary vs. active comparisons
   - Regional/ethnic considerations (with limitations)

#### Module 3: Decision Rules

**Evaluation Rules Engine**:

1. **Injury Risk Assessment**:
   ```
   IF ACWR > 1.5 THEN risk = "HIGH"
   IF ACWR > 1.3 AND < 1.5 THEN risk = "MODERATE"
   IF ACWR >= 0.8 AND <= 1.3 THEN risk = "OPTIMAL"
   IF ACWR < 0.8 THEN risk = "UNDER_TRAINED"
   
   IF wellnessScore < 3 AND fatigueLevel > 7 THEN alert = "URGENT_REVIEW"
   ```

2. **Return-to-Play Decision Tree**:
   ```
   IF injuryPhase = "acute" THEN restrict = "no_activity"
   IF pain > 3/10 THEN status = "not_ready"
   IF strengthDeficit > 20% THEN status = "graduated_return"
   IF psychologicalReadiness < 8/10 THEN require = "psych_clearance"
   ALL conditions met → status = "return_to_play"
   ```

3. **Performance Grading**:
   ```
   Score = normalize(actualValue, ageNorm, positionNorm, gender)
   IF score >= 90 THEN grade = "Elite"
   IF score >= 75 THEN grade = "Excellent"
   IF score >= 60 THEN grade = "Good"
   IF score >= 40 THEN grade = "Average"
   IF score >= 25 THEN grade = "Below Average"
   IF score < 25 THEN grade = "Needs Improvement"
   ```

4. **Training Load Adjustments**:
   ```
   IF fatigueScore > 7 THEN reduceLoad by 20%
   IF sleepQuality < 6 THEN emphasize = "recovery"
   IF stressLevel > 8 THEN modify = "reduce_intensity"
   IF wellness_trend = "declining_3_days" THEN alert = "coach_review"
   ```

#### Module 4: Performance Rules

**Sport Science Principles**:

1. **Periodization Rules**:
   - Progressive overload principles
   - Deload week timing (every 4-6 weeks)
   - Peaking protocols
   - Recovery cycle mandates

2. **Specificity Rules**:
   - Position-based training focus
   - Sport-specific energy systems
   - Movement pattern matching
   - Skill transfer principles

3. **Individualization Factors**:
   - Age-adjusted training
   - Experience-level modifications
   - Gender considerations
   - Injury history impact

4. **Recovery Protocols**:
   - Time between high-intensity sessions
   - Post-competition recovery timing
   - Sleep requirements by training load
   - Nutrition timing rules

#### Module 5: Evaluation Logic

**Multi-Factor Evaluation**:

```
Athlete Performance Score Calculation:
─────────────────────────────────────
1. Data Collection:
   - Physical metrics (weighted 40%)
   - Technical metrics (weighted 30%)
   - Tactical metrics (weighted 15%)
   - Mental/Wellness (weighted 15%)

2. For each metric:
   normalizedScore = SIE.normalize(value, norms, context)
   weightedScore = normalizedScore × categoryWeight

3. Aggregate:
   overallScore = Σ(weightedScores)
   
4. Interpretation:
   grade = SIE.determineGrade(overallScore)
   
5. Comparative Analysis:
   - vs Personal best
   - vs Team average
   - vs Age/position norm
   - vs Career trajectory

6. Trend Analysis:
   - 7-day trend
   - 30-day trend
   - Season trend
   - Career trend
```

### SIE API Structure

```
SIE.calculate.vo2max(protocol, data) → result
SIE.calculate.bmi(height, weight) → result
SIE.calculate.trainingLoad(rpe, duration) → result
SIE.calculate.acwr(acuteLoad, chronicLoad) → result

SIE.norms.get(metric, age, gender, sport, position) → normativeData
SIE.norms.compare(value, normativeData) → comparison

SIE.evaluate.performance(metrics, context) → evaluation
SIE.evaluate.injuryRisk(athleteData) → riskAssessment
SIE.evaluate.readiness(athlete, session) → readinessScore

SIE.rules.canReturnToPlay(injury, current) → decision
SIE.rules.recommendedRecovery(load, wellness) → protocol
SIE.rules.trainingIntensity(fatigue, phase) → prescription

SIE.reference.getFormula(id) → formula
SIE.reference.getStudy(topic) → studies
SIE.reference.getNormSource(norm) → source
```

### SIE Versioning & Updates

**Version Control**:
- Semantic versioning (v1.2.3)
- Change logs for all formula updates
- Backward compatibility maintained
- Migration guides for breaking changes

**Update Process**:
1. Scientific review board approval
2. Testing against historical data
3. Beta release to select organizations
4. Gradual rollout with monitoring
5. Full deployment

**Audit Trail**:
- Every SIE calculation logged
- Formula version used recorded
- Enables retrospective analysis
- Ensures reproducibility

---

## AI Architecture

### AI System Design Philosophy

Instead of a single monolithic chatbot, SportMind AI employs **specialized AI agents**, each expert in their domain. This approach provides:

- **Domain expertise**: Focused knowledge per agent
- **Better accuracy**: Specialized prompts and context
- **Scalability**: Independent scaling per agent
- **Safety**: Boundaries between medical, coaching, research
- **Auditability**: Clear tracking of which agent handled what

### The Six Specialized AI Agents

```
┌──────────────────────────────────────────────────────────────┐
│                    AI ORCHESTRATION LAYER                     │
│                                                               │
│   Query Router → Determines correct agent → Load context     │
└─────────────────────┬────────────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┬────────────────┐
    │                 │                 │                │
    ▼                 ▼                 ▼                ▼
┌─────────┐    ┌──────────┐    ┌────────────┐   ┌─────────────┐
│  Coach  │    │Performance│    │  Recovery  │   │   Sports    │
│         │    │ Analyst   │    │   Expert   │   │  Scientist  │
└─────────┘    └──────────┘    └────────────┘   └─────────────┘
    │                 │                 │                │
    │                 │                 │                │
    ▼                 ▼                 ▼                ▼
┌──────────────────────────────────────────────────────────────┐
│              SIE (SportMind Intelligence Engine)              │
└──────────────────────────────────────────────────────────────┘
    ▲                 ▲                 ▲                ▲
    │                 │                 │                │
┌───┴────┐      ┌─────┴─────┐    ┌──────┴─────┐   ┌─────┴─────┐
│Research│      │ Statistics│    │  (Future)  │   │  (Future) │
│ Assist │      │  Analyst  │    │            │   │           │
└────────┘      └───────────┘    └────────────┘   └───────────┘
```

---

### Agent 1: AI Coach

**Role**: Primary training and coaching assistant

**Responsibilities**:
- Design training plans
- Provide coaching advice
- Analyze team performance
- Suggest tactical improvements
- Player development recommendations
- Match preparation

**Users**: Coaches, Assistant Coaches, Athletes

**Knowledge Domain**:
- Training methodology
- Periodization principles
- Sport-specific tactics
- Team dynamics
- Skill development
- Match analysis

**SIE Dependencies**:
- Training load formulas
- Performance norms
- Periodization rules
- Progressive overload principles

**Interaction Patterns**:
```
User: "How should I structure this week's training given we have a match on Saturday?"

AI Coach:
1. Consults SIE for:
   - Optimal pre-match tapering (SIE.rules.tapering)
   - Training load calculations
   - Recovery time requirements

2. Analyzes context:
   - Team's recent training load
   - Athletes' wellness data
   - Match importance
   - Opponent analysis

3. Provides structured response:
   - Day-by-day training plan
   - Load prescription per day
   - Recovery protocols
   - Match day guidelines
   - References scientific principles
```

**Boundaries**:
- Cannot provide medical diagnoses
- Cannot override safety protocols
- Cannot access non-coaching data
- Must consult SIE for any performance calculations

---

### Agent 2: Performance Analyst

**Role**: Deep analysis of performance data

**Responsibilities**:
- Analyze test results in detail
- Identify performance trends
- Compare against benchmarks
- Predict performance trajectories
- Generate insights from data
- Highlight strengths/weaknesses

**Users**: Coaches, Sports Scientists, Organization Admins

**Knowledge Domain**:
- Statistical analysis
- Data interpretation
- Performance benchmarking
- Trend analysis
- Predictive modeling

**SIE Dependencies**:
- All performance formulas
- Normative data
- Evaluation rules
- Comparison protocols

**Interaction Patterns**:
```
User: "Analyze John's last 6 months of performance tests"

Performance Analyst:
1. Data gathering:
   - Retrieves all tests for athlete
   - Fetches SIE norms for age/position
   - Gets team averages

2. Analysis via SIE:
   - Calculate z-scores
   - Determine percentile ranks
   - Analyze trends
   - Compare to norms

3. Output:
   - Comprehensive analysis report
   - Trend charts (via visualizations)
   - Key findings ranked by importance
   - Comparative context
   - Statistical significance notes
   - Recommended focus areas
```

**Boundaries**:
- Analyzes only, doesn't prescribe training
- Refers to AI Coach for training recommendations
- Refers to Recovery Expert for injury implications

---

### Agent 3: Recovery Expert

**Role**: Recovery, wellness, and injury prevention

**Responsibilities**:
- Analyze fatigue and recovery
- Assess injury risk
- Design recovery protocols
- Monitor wellness trends
- Return-to-play recommendations
- Sleep and nutrition guidance

**Users**: Physiotherapists, Athletes, Sports Scientists

**Knowledge Domain**:
- Recovery science
- Sleep physiology
- Injury prevention
- Rehabilitation principles
- Wellness monitoring
- Nutrition for recovery

**SIE Dependencies**:
- Recovery formulas (HRV, wellness scores)
- ACWR calculations
- Injury risk rules
- Return-to-play protocols
- Recovery time norms

**Interaction Patterns**:
```
User: "Sarah reported high fatigue after yesterday's session"

Recovery Expert:
1. Retrieves data:
   - Sarah's recent training load
   - Historical wellness patterns
   - Sleep data (if available)
   - Recent injuries

2. SIE analysis:
   - Calculate ACWR
   - Assess injury risk
   - Determine recovery needs

3. Response:
   - Risk assessment (with SIE-based grade)
   - Recommended recovery protocol
   - Sleep and nutrition guidance
   - Suggested load modification
   - Timeline for return to normal training
   - Red flags to monitor
```

**Boundaries**:
- Cannot diagnose medical conditions
- Recommends consulting medical professional for serious cases
- Cannot override doctor's orders
- Handles wellness/recovery, not medical treatment

---

### Agent 4: Sports Scientist

**Role**: Deep scientific analysis and methodology

**Responsibilities**:
- Explain scientific principles
- Validate testing protocols
- Interpret complex data
- Provide research-based insights
- Advanced statistical analysis
- Sport science education

**Users**: Sports Scientists, Researchers, Organization Admins

**Knowledge Domain**:
- Exercise physiology
- Biomechanics
- Testing methodology
- Statistical methods
- Research design
- Scientific literature

**SIE Dependencies**:
- All SIE formulas with full scientific context
- Reference studies
- Methodology standards
- Statistical procedures

**Interaction Patterns**:
```
User: "What's the best protocol for testing anaerobic capacity in youth players?"

Sports Scientist:
1. Consults SIE:
   - Available anaerobic tests
   - Age-appropriate protocols
   - Scientific validation levels

2. Analyzes context:
   - Age range specified
   - Available equipment
   - Testing environment
   - Participant experience

3. Response:
   - Multiple validated options with references
   - Pros/cons of each protocol
   - Reliability and validity data
   - Practical implementation guide
   - Scientific citations
   - Modified protocols for age group
```

**Boundaries**:
- Provides science-based information
- Doesn't design specific training programs (AI Coach)
- Doesn't provide medical advice (Recovery Expert)
- Focuses on methodology and interpretation

---

### Agent 5: Research Assistant

**Role**: Academic research support and literature analysis

**Responsibilities**:
- Search scientific literature
- Summarize research papers
- Suggest research methodologies
- Statistical planning
- Literature reviews
- Citation management

**Users**: Researchers, Sports Scientists, Universities

**Knowledge Domain**:
- Scientific literature databases
- Research methodology
- Statistical analysis
- Academic writing
- Meta-analysis techniques
- Publication standards

**SIE Dependencies**:
- Reference database
- Established methodologies
- Standard formulas
- Validated protocols

**External Integrations**:
- PubMed API
- Google Scholar
- Sports science journals

**Interaction Patterns**:
```
User: "Find recent studies on plyometric training in adolescent athletes"

Research Assistant:
1. Search operations:
   - Query scientific databases
   - Filter by relevance and recency
   - Rank by impact factor

2. Analysis:
   - Extract key findings
   - Identify consensus and disagreements
   - Note methodological approaches
   - Highlight practical applications

3. Response:
   - Structured literature review
   - Top 5-10 most relevant papers
   - Summary of findings
   - Meta-analysis (if data available)
   - Suggested research gaps
   - Citation-ready references
```

**Boundaries**:
- Cannot access non-public research
- Respects copyright and licensing
- Provides information, not opinions
- Suggests but doesn't design studies

---

### Agent 6: Statistics Analyst

**Role**: Advanced statistical and data analysis

**Responsibilities**:
- Perform statistical tests
- Advanced data visualization
- Predictive modeling
- Correlation analysis
- Regression analysis
- Data-driven insights

**Users**: Sports Scientists, Researchers, Data Analysts

**Knowledge Domain**:
- Statistical methods
- Machine learning basics
- Data visualization
- Predictive analytics
- Time series analysis
- Correlation vs causation

**SIE Dependencies**:
- Statistical formulas
- Normative distributions
- Reference calculations
- Standard methodologies

**Interaction Patterns**:
```
User: "Is there a correlation between sleep quality and next-day performance?"

Statistics Analyst:
1. Data preparation:
   - Query relevant data
   - Clean and format
   - Handle missing values

2. Analysis:
   - Determine appropriate test
   - Run statistical analysis (Pearson, Spearman, etc.)
   - Calculate effect sizes
   - Test for significance

3. Response:
   - Statistical results with p-values
   - Effect size interpretation
   - Visualizations (scatter plots, regression)
   - Limitations and caveats
   - Practical significance
   - Suggested follow-up analyses
```

**Boundaries**:
- Provides statistical analysis, not conclusions
- Notes limitations of data
- Distinguishes correlation from causation
- Recommends additional data if needed

---

### AI Agent Orchestration

**Query Router Logic**:

```
User Query → Query Router → Analyzes intent
                              │
     ┌────────────────────────┼────────────────────────┐
     │                        │                        │
     ▼                        ▼                        ▼
Training/Coaching?   Performance Data?      Recovery/Injury?
     │                        │                        │
     ▼                        ▼                        ▼
  AI Coach          Performance Analyst      Recovery Expert
     
     ┌────────────────────────┬────────────────────────┐
     │                        │                        │
     ▼                        ▼                        ▼
Scientific/Method?      Research/Papers?     Statistical Analysis?
     │                        │                        │
     ▼                        ▼                        ▼
Sports Scientist       Research Assistant    Statistics Analyst
```

**Multi-Agent Collaboration**:

Some queries require multiple agents:

```
User: "Design a training plan for our team's pre-season, 
       accounting for recent injury history"

1. Query Router identifies multi-agent need
2. Coordinates:
   - Recovery Expert: Analyze injury patterns
   - Performance Analyst: Current fitness levels
   - Sports Scientist: Evidence-based methodology
   - AI Coach: Synthesize into training plan
3. Consolidated response with contributions labeled
```

### AI Safety & Compliance

**Safety Rules**:

1. **Medical Boundaries**:
   - No medical diagnoses
   - No prescription of medications
   - Always recommend medical consultation for serious concerns

2. **Age-Appropriate**:
   - Youth-specific guidelines
   - Age-based training limits
   - Growth and development considerations

3. **Ethical Guidelines**:
   - No performance-enhancing drug advice
   - Ethical sport principles
   - Anti-doping compliance

4. **Data Privacy**:
   - Anonymize when possible
   - Respect consent
   - Follow GDPR/HIPAA guidelines

**Verification Layer**:

Before AI response is delivered:
```
AI Response
    │
    ▼
SIE Verification
    │
    ├─── Are all formulas cited?
    ├─── Do calculations match SIE?
    ├─── Are norms accurate?
    └─── Any unsupported claims?
    │
    ▼
Safety Check
    │
    ├─── Medical boundaries respected?
    ├─── Age-appropriate advice?
    ├─── Ethical concerns?
    └─── Legal compliance?
    │
    ▼
Quality Score
    │
    ├─── Confidence level
    ├─── Data completeness
    └─── Source attribution
    │
    ▼
Deliver to User
```

### AI Learning & Improvement

**Feedback Loops**:
- User ratings on responses
- Follow-up query analysis
- Success metric tracking
- Expert review periodic

**Prompt Optimization**:
- A/B testing prompts
- Domain-specific tuning
- Context window optimization
- Response quality tracking

**Model Selection**:

| Agent | Primary Model | Backup Model | Fine-tuned |
|-------|--------------|--------------|------------|
| AI Coach | GPT-4 | Claude 3 | Yes |
| Performance Analyst | Claude 3 | GPT-4 | Yes |
| Recovery Expert | GPT-4 | Claude 3 | Yes |
| Sports Scientist | Claude 3 | GPT-4 | Yes |
| Research Assistant | Claude 3 | GPT-4 | No |
| Statistics Analyst | GPT-4 | Claude 3 | Custom |

---

## System Architecture Diagram

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT APPLICATIONS                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌────────────────┐    ┌────────────────┐    ┌──────────────────┐    │
│   │  Mobile App    │    │  Web Dashboard │    │  Admin Portal    │    │
│   │  (React Native)│    │  (React/Next)  │    │  (React)         │    │
│   └────────┬───────┘    └────────┬───────┘    └────────┬─────────┘    │
│            │                     │                     │                │
└────────────┼─────────────────────┼─────────────────────┼───────────────┘
             │                     │                     │
             └──────────┬──────────┴─────────┬───────────┘
                        │                    │
                        ▼                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY / CDN                                │
│              (Firebase Hosting, Cloud Load Balancer)                    │
└──────────────────────────────┬────────────────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
┌──────────────────┐  ┌────────────────┐  ┌──────────────────┐
│  Authentication  │  │  Cloud Functions│  │  Real-time Data  │
│                  │  │                 │  │                  │
│  Firebase Auth   │  │  Business Logic │  │  Firestore       │
│                  │  │  API Endpoints  │  │  Real-time DB    │
│  - Sign up       │  │  Triggers       │  │                  │
│  - Sign in       │  │  Scheduled Jobs │  │  - Users         │
│  - JWT tokens    │  │                 │  │  - Athletes      │
│  - Custom claims │  │                 │  │  - Tests         │
│  - 2FA           │  │                 │  │  - Reports       │
└──────────────────┘  └────────┬────────┘  └──────────────────┘
                               │
    ┌──────────────────────────┼──────────────────────────┐
    │                          │                          │
    ▼                          ▼                          ▼
┌─────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│                 │  │                     │  │                     │
│  SIE Engine     │  │  AI Orchestration   │  │  External Services  │
│                 │  │                     │  │                     │
│  - Formulas     │◄─┤  - Query Router     │  │  - SendGrid (Email) │
│  - Norms DB     │  │  - Agent Manager    │  │  - Twilio (SMS)     │
│  - Rules Engine │  │  - Prompt Templates │  │  - FCM (Push)       │
│  - Evaluation   │  │  - Response Filter  │  │  - Stripe (Payment) │
│                 │  │                     │  │  - Algolia (Search) │
└─────────────────┘  └────────┬────────────┘  └─────────────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  AI Provider │      │  AI Provider │      │  Custom      │
│  OpenAI      │      │  Anthropic   │      │  Fine-tuned  │
│  GPT-4       │      │  Claude 3    │      │  Models      │
└──────────────┘      └──────────────┘      └──────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                       DATA & STORAGE LAYER                              │
├───────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌────────────────┐   ┌────────────────┐   ┌────────────────────┐   │
│   │   Firestore    │   │  Cloud Storage │   │    BigQuery        │   │
│   │                │   │                │   │                    │   │
│   │  Primary DB    │   │  - Images      │   │  Analytics         │   │
│   │  - Collections │   │  - Videos      │   │  - Historical data │   │
│   │  - Documents   │   │  - PDFs        │   │  - Aggregations    │   │
│   │  - Sub-colls   │   │  - Excel files │   │  - Data warehouse  │   │
│   │  - Real-time   │   │  - Reports     │   │  - ML training     │   │
│   └────────────────┘   └────────────────┘   └────────────────────┘   │
│                                                                        │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                      MONITORING & OBSERVABILITY                         │
├───────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   Firebase Analytics │ Sentry (Errors) │ Datadog │ Cloud Logging      │
│                                                                        │
└───────────────────────────────────────────────────────────────────────┘
```

### Data Flow: Performance Test Example

```
1. Sports Scientist opens app
   ↓
2. Mobile App authenticates (Firebase Auth)
   ↓
3. Selects athlete + test protocol
   ↓
4. Enters test data
   ↓
5. Data sent to Cloud Function
   ↓
6. Cloud Function:
   a. Validates data
   b. Consults SIE for calculations
   c. Applies formulas via SIE
   d. Determines evaluations
   e. Saves to Firestore
   ↓
7. Optionally triggers AI Analysis:
   a. Performance Analyst agent activated
   b. Fetches athlete history
   c. Consults SIE again
   d. Calls AI provider (GPT-4/Claude)
   e. Validates response against SIE
   f. Saves analysis to Firestore
   ↓
8. Real-time listeners update UI
   ↓
9. Notifications triggered:
   a. Athlete notified of new test
   b. Coach notified of team update
   ↓
10. Data flows to BigQuery (async)
    for analytics
```

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                     │
│                                                               │
│   Region: Multi-region (US, EU, Asia)                        │
│                                                               │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│   │  Firebase    │  │  Cloud Run   │  │  Cloud SQL   │      │
│   │  Hosting     │  │  (Functions) │  │  (Postgres)  │      │
│   │  CDN         │  │  Auto-scale  │  │  (analytics) │      │
│   └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│   ┌──────────────┐  ┌──────────────┐                         │
│   │  Firestore   │  │  Storage     │                         │
│   │  Multi-zone  │  │  Multi-zone  │                         │
│   └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    STAGING ENVIRONMENT                        │
│              (Mirror of production, single region)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  DEVELOPMENT ENVIRONMENT                      │
│              (Local + Firebase Emulator Suite)                │
└─────────────────────────────────────────────────────────────┘
```

---

## Security & Compliance

### Security Layers

1. **Authentication**: Firebase Auth with MFA
2. **Authorization**: Role-based (Firestore Security Rules)
3. **Encryption**: TLS in transit, AES-256 at rest
4. **API Security**: Rate limiting, API keys, JWT validation
5. **Data Isolation**: Multi-tenancy via organizationId
6. **Audit Logging**: Complete audit trail
7. **Backup**: Daily automated backups
8. **Disaster Recovery**: Multi-region replication

### Compliance Requirements

- **GDPR** (European users): Right to be forgotten, data portability
- **HIPAA** (US health data): Encrypted PHI, access controls
- **CCPA** (California): Data privacy rights
- **SOC 2 Type II**: Security certification
- **ISO 27001**: Information security management

---

## Scalability & Performance

### Scaling Strategy

**Horizontal Scaling**:
- Cloud Functions auto-scale (0-1000 instances)
- Firestore auto-scales reads/writes
- CDN for static content
- Multi-region deployment

**Performance Targets**:
- API response: <200ms (p95)
- Real-time updates: <500ms
- App load time: <3 seconds
- Report generation: <30 seconds

**Caching Strategy**:
- CDN caching (static)
- Client-side caching (offline support)
- Server-side caching (frequently accessed norms)
- Redis for session data (if needed)

---

## Conclusion

This architecture provides SportMind AI with:

1. **Scalability**: Multi-tenant, cloud-native, auto-scaling
2. **Security**: Enterprise-grade with compliance
3. **Flexibility**: Modular design, easy to extend
4. **Reliability**: 99.9% uptime target with redundancy
5. **Performance**: Optimized data structures and caching
6. **Intelligence**: Separated SIE (deterministic) + AI (creative)
7. **Auditability**: Complete tracking of actions and decisions

**Ready for**:
- Multi-organization deployments
- Global scale (millions of users)
- Complex sports science workflows
- Research-grade data collection
- Enterprise contracts
- Regulatory compliance

---

**Document Status**: Complete Architecture Specification  
**Next Phase**: Awaiting approval to begin implementation  
**Estimated Implementation**: 6-9 months for full platform

---

*SportMind AI - Where Sports Science Meets Artificial Intelligence*
