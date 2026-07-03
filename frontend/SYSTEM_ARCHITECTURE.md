# SportMind AI - System Architecture Specification

**Document Version**: 1.0  
**Date**: January 2026  
**Status**: Architecture Design Phase  
**Classification**: Production SaaS Platform

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Database Architecture](#database-architecture)
3. [User Roles & Permissions (RBAC)](#user-roles--permissions-rbac)
4. [User Flows](#user-flows)
5. [Notifications Architecture](#notifications-architecture)
6. [SportMind Intelligence Engine (SIE)](#sportmind-intelligence-engine-sie)
7. [AI Architecture](#ai-architecture)
8. [System Architecture Diagram](#system-architecture-diagram)
9. [Security & Compliance](#security--compliance)
10. [Scalability & Performance](#scalability--performance)

---

## Executive Summary

SportMind AI is a professional-grade Sports Science Platform designed as a multi-tenant SaaS solution. The platform combines:

- **Scientific Rigor**: Sports science formulas and normative data (SIE)
- **AI Intelligence**: Specialized AI agents for different domains
- **Data-Driven**: Comprehensive athlete performance tracking
- **Role-Based Access**: Granular permissions for 10 user types
- **Multi-Organization**: Support for clubs, universities, research institutions

**Architecture Principles**:
1. Separation of sports science logic (SIE) from AI reasoning
2. Multi-tenancy with data isolation
3. Role-based access control (RBAC)
4. Audit trails for all critical operations
5. Real-time data synchronization
6. Scalable microservices approach

---

## Database Architecture

### Technology Stack
- **Primary Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Cloud Storage
- **Real-time**: Firestore real-time listeners
- **Search**: Algolia (external integration)

### Multi-Tenancy Strategy
All data is isolated by `organizationId` at the root level. Each organization's data is completely separate.

---

### Collection Structure Overview

```
Firestore Root
├── organizations/                    # Top-level tenant separation
├── users/                           # User accounts
├── teams/                           # Teams within organizations
├── athletes/                        # Athlete profiles
├── performance-tests/               # Performance test records
├── training-sessions/               # Training session data
├── reports/                         # Generated reports
├── ai-conversations/                # AI chat history
├── notifications/                   # User notifications
├── calculations/                    # Calculator history
├── research-projects/               # Research studies
├── system-settings/                 # Global system configuration
└── audit-logs/                      # Audit trail
```

---

### Detailed Collection Schemas

#### 1. organizations/

**Purpose**: Multi-tenant root - each organization (club, university, research center)

```typescript
Document ID: {organizationId}

{
  // Identity
  id: string;                        // Same as document ID
  name: string;                      // "Real Madrid CF", "Stanford University"
  type: 'club' | 'university' | 'research' | 'private';
  
  // Configuration
  settings: {
    timezone: string;                // "Europe/Madrid"
    locale: string;                  // "en-US"
    currency: string;                // "EUR"
    dateFormat: string;              // "DD/MM/YYYY"
    measurementSystem: 'metric' | 'imperial';
  };
  
  // Branding
  branding: {
    logo?: string;                   // Storage URL
    primaryColor: string;            // "#0066FF"
    secondaryColor: string;          // "#00C853"
  };
  
  // Subscription
  subscription: {
    plan: 'free' | 'professional' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled';
    seats: number;                   // Licensed user count
    seatsUsed: number;
    startDate: timestamp;
    renewalDate: timestamp;
    features: string[];              // ["ai_coach", "advanced_analytics"]
  };
  
  // Contact
  contact: {
    email: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  createdBy: string;                 // userId
  
  // Stats (denormalized for quick access)
  stats: {
    totalUsers: number;
    totalAthletes: number;
    totalTeams: number;
    totalTests: number;
  };
  
  // Status
  isActive: boolean;
  isDeleted: boolean;
}
```

**Indexes**:
- `type` + `isActive`
- `subscription.status` + `subscription.renewalDate`
- `createdAt` (desc)

---

#### 2. users/

**Purpose**: User accounts across all organizations

```typescript
Document ID: {userId} (Firebase Auth UID)

{
  // Identity
  id: string;                        // Same as Firebase Auth UID
  email: string;                     // Unique
  displayName: string;
  avatar?: string;                   // Storage URL
  
  // Role & Organization
  organizationId: string;            // Primary organization
  role: 'super_admin' | 'org_admin' | 'coach' | 'assistant_coach' | 
        'sports_scientist' | 'physiotherapist' | 'athlete' | 
        'researcher' | 'university' | 'club';
  
  // Multiple organization access (for consultants, researchers)
  organizations: Array<{
    organizationId: string;
    role: string;
    joinedAt: timestamp;
    isActive: boolean;
  }>;
  
  // Profile
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth?: timestamp;
    gender?: 'male' | 'female' | 'other';
    phone?: string;
    bio?: string;
    
    // Professional info
    title?: string;                  // "Head Coach", "Lead Scientist"
    department?: string;
    certifications?: string[];       // ["UEFA Pro License", "PhD Sports Science"]
    specializations?: string[];      // ["Strength Training", "Injury Prevention"]
  };
  
  // Preferences
  preferences: {
    language: string;                // "en"
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacySettings: {
      profileVisibility: 'public' | 'organization' | 'private';
      showEmail: boolean;
    };
  };
  
  // Authentication
  auth: {
    emailVerified: boolean;
    lastLogin: timestamp;
    loginCount: number;
    twoFactorEnabled: boolean;
  };
  
  // Device tokens for push notifications
  deviceTokens: string[];
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  lastActiveAt: timestamp;
  
  // Status
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: timestamp;
}
```

**Indexes**:
- `organizationId` + `role` + `isActive`
- `email` (unique)
- `organizations.organizationId` (array-contains)
- `lastActiveAt` (desc)

---

#### 3. teams/

**Purpose**: Teams within organizations (squads, groups, cohorts)

```typescript
Document ID: {teamId}

{
  // Identity
  id: string;
  organizationId: string;            // Owner organization
  name: string;                      // "First Team", "U-21 Squad"
  code?: string;                     // "FT", "U21"
  
  // Classification
  sport: string;                     // "Football", "Basketball"
  category?: string;                 // "Professional", "Youth", "Academy"
  ageGroup?: string;                 // "U-21", "Senior"
  gender?: 'male' | 'female' | 'mixed';
  
  // Staff assignments
  staff: Array<{
    userId: string;
    role: 'head_coach' | 'assistant_coach' | 'sports_scientist' | 
          'physiotherapist' | 'analyst';
    assignedAt: timestamp;
    isActive: boolean;
  }>;
  
  // Athlete roster
  athleteIds: string[];              // Array of athlete IDs
  
  // Season/Period
  season?: {
    name: string;                    // "2025/2026"
    startDate: timestamp;
    endDate: timestamp;
  };
  
  // Schedule
  trainingSchedule?: Array<{
    dayOfWeek: number;               // 0-6 (Sunday-Saturday)
    startTime: string;               // "09:00"
    endTime: string;                 // "11:00"
    type: 'training' | 'match' | 'recovery';
  }>;
  
  // Performance goals
  goals?: {
    physical?: Record<string, number>;    // { "vo2max": 55, "speed": 35 }
    tactical?: string[];
    technical?: string[];
  };
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  createdBy: string;
  
  // Stats (denormalized)
  stats: {
    athleteCount: number;
    staffCount: number;
    totalTrainingSessions: number;
    totalTests: number;
  };
  
  // Status
  isActive: boolean;
  isArchived: boolean;
}
```

**Indexes**:
- `organizationId` + `isActive`
- `organizationId` + `sport` + `isActive`
- `athleteIds` (array-contains) + `isActive`
- `staff.userId` (array-contains)

**Subcollection**: `teams/{teamId}/training-plans`
- Individual training plans for the team

---

#### 4. athletes/

**Purpose**: Athlete profiles and baseline data

```typescript
Document ID: {athleteId}

{
  // Identity
  id: string;
  organizationId: string;
  userId?: string;                   // If athlete has user account
  
  // Basic Information
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth: timestamp;
  age: number;                       // Calculated
  gender: 'male' | 'female';
  
  // Profile
  avatar?: string;
  nationality: string;
  placeOfBirth?: string;
  languages?: string[];
  
  // Physical Attributes
  physical: {
    height: number;                  // cm
    weight: number;                  // kg
    bmi: number;                     // Calculated
    bodyFat?: number;                // percentage
    dominantSide: 'right' | 'left' | 'both';
  };
  
  // Sport-Specific
  sport: {
    primary: string;                 // "Football"
    position: string;                // "Midfielder", "Forward"
    secondaryPositions?: string[];
    preferredFoot?: 'right' | 'left' | 'both';
    jerseyNumber?: number;
  };
  
  // Team associations
  teams: Array<{
    teamId: string;
    teamName: string;                // Denormalized
    joinedAt: timestamp;
    status: 'active' | 'inactive' | 'transferred';
    isStarter: boolean;
  }>;
  
  // Career
  career: {
    professionalSince?: timestamp;
    formerClubs?: string[];
    internationalCaps?: number;
    internationalGoals?: number;
  };
  
  // Medical
  medical: {
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    injuries?: Array<{
      type: string;
      date: timestamp;
      severity: 'minor' | 'moderate' | 'severe';
      recoveryWeeks?: number;
      description?: string;
    }>;
    lastCheckup?: timestamp;
  };
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  // Baseline Performance (latest values)
  baseline: {
    vo2max?: number;
    maxHeartRate?: number;
    restingHeartRate?: number;
    speed?: {
      sprint10m?: number;
      sprint30m?: number;
      topSpeed?: number;
    };
    strength?: {
      squat?: number;
      bench?: number;
      deadlift?: number;
    };
    agility?: number;
    endurance?: number;
    flexibility?: number;
    lastUpdated?: timestamp;
  };
  
  // Access Control
  privacy: {
    dataSharing: 'full' | 'team_only' | 'restricted';
    allowResearch: boolean;
    allowExternalSharing: boolean;
  };
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  createdBy: string;
  
  // Status
  status: 'active' | 'inactive' | 'injured' | 'transferred' | 'retired';
  isDeleted: boolean;
}
```

**Indexes**:
- `organizationId` + `status`
- `organizationId` + `sport.primary` + `status`
- `teams.teamId` (array-contains) + `status`
- `dateOfBirth` (for age calculations)
- `lastName` + `firstName` (for alphabetical sorting)

**Subcollections**:
- `athletes/{athleteId}/performance-history` - Historical performance data
- `athletes/{athleteId}/medical-records` - Detailed medical records (restricted access)
- `athletes/{athleteId}/nutrition-plans` - Nutrition tracking
- `athletes/{athleteId}/psychological-assessments` - Mental performance data

---

#### 5. performance-tests/

**Purpose**: Individual performance test records

```typescript
Document ID: {testId}

{
  // Identity
  id: string;
  organizationId: string;
  athleteId: string;
  teamId?: string;
  
  // Test Classification
  testType: 'physical' | 'technical' | 'tactical' | 'psychological' | 'medical';
  testName: string;                  // "VO2 Max Test", "Sprint Test", "Agility Test"
  testCategory: string;              // "Aerobic Capacity", "Speed", "Strength"
  
  // Test Protocol
  protocol: {
    name: string;                    // "Beep Test", "Yo-Yo IR1"
    version?: string;
    standardReference?: string;      // Scientific reference
    equipment?: string[];
  };
  
  // Test Execution
  execution: {
    date: timestamp;
    time: string;                    // "14:30"
    location: string;                // "Training Ground A"
    environment: {
      temperature?: number;          // Celsius
      humidity?: number;             // Percentage
      altitude?: number;             // Meters
      indoorOutdoor: 'indoor' | 'outdoor';
    };
    conductedBy: string;             // userId of tester
    assistants?: string[];           // userId array
  };
  
  // Raw Data
  measurements: Record<string, any>; // Flexible structure for different test types
  // Examples:
  // { distance: 2800, time: 720, heartRate: [120, 145, 168, 185] }
  // { sprint10m: 1.85, sprint30m: 4.12, sprint50m: 6.23 }
  // { squat1RM: 120, bench1RM: 95, deadlift1RM: 140 }
  
  // Calculated Results
  results: {
    primaryMetric: {
      name: string;
      value: number;
      unit: string;
      rawValue?: number;             // Before normalization
    };
    secondaryMetrics?: Array<{
      name: string;
      value: number;
      unit: string;
    }>;
  };
  
  // SIE Evaluation
  evaluation: {
    score: number;                   // 0-100 normalized score
    grade: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
    percentile?: number;             // Compared to normative data
    zScore?: number;                 // Statistical score
    
    comparison: {
      toNorm: {
        normType: 'age' | 'position' | 'elite' | 'population';
        delta: number;               // Difference from norm
        interpretation: string;
      };
      toBaseline: {
        baselineValue?: number;
        delta?: number;              // Improvement/decline
        percentChange?: number;
      };
      toTeam: {
        teamAverage?: number;
        rank?: number;               // Rank within team
        percentile?: number;
      };
    };
  };
  
  // AI Analysis (generated by AI agents)
  aiAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    trainingFocus: string[];
    generatedAt: timestamp;
    generatedBy: string;             // AI agent identifier
  };
  
  // Quality Control
  validity: {
    isValid: boolean;
    validationStatus: 'validated' | 'pending' | 'rejected';
    validatedBy?: string;            // userId
    validatedAt?: timestamp;
    rejectionReason?: string;
    dataQualityScore?: number;       // 0-100
  };
  
  // Follow-up
  notes?: string;
  recommendations?: string;
  nextTestDate?: timestamp;
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  createdBy: string;
  
  // Status
  status: 'completed' | 'in_progress' | 'cancelled';
  isDeleted: boolean;
}
```

**Indexes**:
- `organizationId` + `athleteId` + `execution.date` (desc)
- `athleteId` + `testType` + `execution.date` (desc)
- `teamId` + `testType` + `execution.date` (desc)
- `organizationId` + `testType` + `execution.date` (desc)
- `execution.conductedBy` + `execution.date` (desc)

---

#### 6. training-sessions/

**Purpose**: Training session records and load monitoring

```typescript
Document ID: {sessionId}

{
  // Identity
  id: string;
  organizationId: string;
  teamId: string;
  
  // Session Details
  name: string;                      // "Morning Training - Tactical"
  type: 'training' | 'match' | 'recovery' | 'testing';
  category?: string;                 // "Technical", "Tactical", "Physical", "Combined"
  
  // Schedule
  schedule: {
    date: timestamp;
    startTime: string;               // "09:00"
    endTime: string;                 // "11:00"
    duration: number;                // Minutes
  };
  
  // Location
  location: {
    venue: string;
    field?: string;
    isHome: boolean;
  };
  
  // Staff
  staff: Array<{
    userId: string;
    role: 'coach' | 'assistant' | 'analyst' | 'physiotherapist';
  }>;
  
  // Attendance
  attendance: Array<{
    athleteId: string;
    status: 'present' | 'absent' | 'partial' | 'excused';
    arrivalTime?: string;
    departureTime?: string;
    notes?: string;
  }>;
  
  // Session Plan
  plan: {
    objectives: string[];
    phases: Array<{
      name: string;                  // "Warm-up", "Technical Drills", "Small-sided Games"
      duration: number;              // Minutes
      intensity: 'low' | 'medium' | 'high' | 'very_high';
      description: string;
      exercises?: string[];
    }>;
  };
  
  // Performance Monitoring (per athlete)
  monitoring: Array<{
    athleteId: string;
    
    // Load Metrics
    trainingLoad: {
      duration: number;              // Minutes
      intensity: number;             // RPE 1-10
      sessionRPE?: number;           // RPE * duration
      distance?: number;             // Meters
      highSpeedRunning?: number;     // Meters
      sprints?: number;              // Count
      accelerations?: number;
      decelerations?: number;
    };
    
    // Heart Rate Data (if monitored)
    heartRate?: {
      average: number;
      max: number;
      timeInZones: {
        zone1: number;               // Minutes in each zone
        zone2: number;
        zone3: number;
        zone4: number;
        zone5: number;
      };
    };
    
    // GPS Data (if available)
    gps?: {
      totalDistance: number;
      highSpeedDistance: number;
      sprints: number;
      maxSpeed: number;
      averageSpeed: number;
    };
    
    // Wellness (pre/post)
    wellness?: {
      fatigue: number;               // 1-10
      soreness: number;
      mood: number;
      sleep: number;
      stress: number;
    };
    
    // Performance Rating
    rating?: {
      technical: number;             // 1-10
      tactical: number;
      physical: number;
      mental: number;
      overall: number;
    };
    
    notes?: string;
  }>;
  
  // Session Outcome
  outcome?: {
    objectivesMet: boolean;
    overallRating: number;           // 1-10
    keyPoints: string[];
    improvements: string[];
    concerns: string[];
    nextSessionFocus: string[];
  };
  
  // Media
  media?: Array<{
    type: 'photo' | 'video' | 'document';
    url: string;
    caption?: string;
  }>;
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  createdBy: string;
  
  // Status
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  isDeleted: boolean;
}
```

**Indexes**:
- `organizationId` + `schedule.date` (desc)
- `teamId` + `schedule.date` (desc)
- `attendance.athleteId` (array-contains) + `schedule.date` (desc)
- `status` + `schedule.date`

---

#### 7. reports/

**Purpose**: Generated reports (performance, medical, research)

```typescript
Document ID: {reportId}

{
  // Identity
  id: string;
  organizationId: string;
  
  // Report Classification
  type: 'performance' | 'medical' | 'research' | 'team_analysis' | 
        'individual_progress' | 'comparison' | 'season_summary';
  title: string;
  subtitle?: string;
  
  // Scope
  scope: {
    athleteIds?: string[];
    teamIds?: string[];
    dateRange: {
      start: timestamp;
      end: timestamp;
    };
    testTypes?: string[];
  };
  
  // Report Structure
  sections: Array<{
    id: string;
    title: string;
    type: 'text' | 'chart' | 'table' | 'image' | 'metrics';
    order: number;
    content: any;                    // Flexible based on type
    metadata?: Record<string, any>;
  }>;
  
  // Data Summary
  summary: {
    totalAthletes: number;
    totalTests: number;
    dateRange: string;
    keyFindings: string[];
    highlights: string[];
    concerns: string[];
  };
  
  // Statistics (pre-calculated)
  statistics: Record<string, any>;
  
  // AI Insights (if generated by AI)
  aiInsights?: {
    summary: string;
    trends: string[];
    recommendations: string[];
    predictiveInsights?: string[];
    generatedAt: timestamp;
    generatedBy: string;             // AI agent
  };
  
  // Generation Info
  generation: {
    method: 'manual' | 'automated' | 'ai_assisted';
    templateId?: string;
    generatedAt: timestamp;
    generatedBy: string;             // userId
    processingTime?: number;         // Seconds
  };
  
  // Export
  exports: Array<{
    format: 'pdf' | 'excel' | 'word' | 'csv';
    url: string;                     // Storage URL
    generatedAt: timestamp;
    fileSize: number;                // Bytes
  }>;
  
  // Sharing
  sharing: {
    visibility: 'private' | 'team' | 'organization' | 'public';
    sharedWith: Array<{
      userId: string;
      role: string;
      sharedAt: timestamp;
      permissions: string[];         // ["view", "download", "comment"]
    }>;
  };
  
  // Approval Workflow (for sensitive reports)
  approval?: {
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    approvers: Array<{
      userId: string;
      status: 'pending' | 'approved' | 'rejected';
      timestamp?: timestamp;
      comments?: string;
    }>;
  };
  
  // Comments
  comments?: Array<{
    userId: string;
    text: string;
    timestamp: timestamp;
  }>;
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  createdBy: string;
  lastAccessedAt?: timestamp;
  accessCount: number;
  
  // Status
  status: 'draft' | 'published' | 'archived';
  isDeleted: boolean;
}
```

**Indexes**:
- `organizationId` + `type` + `createdAt` (desc)
- `scope.athleteIds` (array-contains) + `createdAt` (desc)
- `scope.teamIds` (array-contains) + `createdAt` (desc)
- `createdBy` + `createdAt` (desc)
- `status` + `organizationId`

---

#### 8. ai-conversations/

**Purpose**: AI agent interaction history

```typescript
Document ID: {conversationId}

{
  // Identity
  id: string;
  organizationId: string;
  userId: string;
  
  // Conversation Context
  context: {
    agentType: 'coach' | 'performance_analyst' | 'recovery_expert' | 
               'sports_scientist' | 'research_assistant' | 'statistics_analyst';
    topic?: string;                  // "Athlete Performance", "Training Plan"
    relatedEntityType?: 'athlete' | 'team' | 'test' | 'report';
    relatedEntityId?: string;
  };
  
  // Conversation Title (auto-generated or user-set)
  title: string;
  
  // Messages
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: timestamp;
    
    // Rich content
    attachments?: Array<{
      type: 'chart' | 'table' | 'image' | 'data';
      content: any;
    }>;
    
    // AI metadata
    metadata?: {
      model: string;                 // "gpt-4", "claude-3"
      tokens: number;
      processingTime: number;        // Milliseconds
      confidence?: number;           // 0-1
      sources?: string[];            // SIE formulas used, data referenced
    };
    
    // User feedback
    feedback?: {
      helpful: boolean;
      rating?: number;               // 1-5
      comment?: string;
    };
  }>;
  
  // Conversation State
  state: {
    isActive: boolean;
    isPinned: boolean;
    lastMessageAt: timestamp;
    messageCount: number;
  };
  
  // SIE Data Used
  sieReferences?: Array<{
    formulaId: string;
    formulaName: string;
    usageCount: number;
  }>;
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  
  // Status
  isArchived: boolean;
  isDeleted: boolean;
}
```

**Indexes**:
- `userId` + `createdAt` (desc)
- `organizationId` + `context.agentType` + `createdAt` (desc)
- `context.relatedEntityId` + `createdAt` (desc)
- `state.isPinned` + `userId`

---

#### 9. notifications/

**Purpose**: In-app notifications and alerts

```typescript
Document ID: {notificationId}

{
  // Identity
  id: string;
  
  // Recipient
  recipientId: string;               // userId
  organizationId: string;
  
  // Notification Content
  type: 'info' | 'success' | 'warning' | 'alert' | 'reminder';
  category: 'test_result' | 'training_session' | 'report_ready' | 
            'team_update' | 'system' | 'ai_insight' | 'approval_request';
  
  title: string;
  message: string;
  
  // Action
  action?: {
    type: 'navigate' | 'open_report' | 'view_athlete' | 'approve' | 'custom';
    route?: string;                  // App route
    params?: Record<string, any>;
    label?: string;                  // "View Report", "See Details"
  };
  
  // Related Entity
  relatedEntity?: {
    type: 'athlete' | 'team' | 'test' | 'report' | 'training_session';
    id: string;
  };
  
  // Sender (if user-initiated)
  senderId?: string;
  senderName?: string;
  
  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Delivery
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  
  deliveryStatus: {
    inApp: 'pending' | 'delivered' | 'failed';
    email?: 'pending' | 'sent' | 'delivered' | 'failed';
    push?: 'pending' | 'sent' | 'delivered' | 'failed';
    sms?: 'pending' | 'sent' | 'delivered' | 'failed';
  };
  
  // User Interaction
  readAt?: timestamp;
  isRead: boolean;
  clickedAt?: timestamp;
  dismissedAt?: timestamp;
  
  // Scheduling
  scheduledFor?: timestamp;          // Future delivery
  expiresAt?: timestamp;             // Auto-expire
  
  // Metadata
  createdAt: timestamp;
  sentAt?: timestamp;
  
  // Status
  isDeleted: boolean;
}
```

**Indexes**:
- `recipientId` + `isRead` + `createdAt` (desc)
- `recipientId` + `category` + `createdAt` (desc)
- `organizationId` + `type` + `createdAt` (desc)
- `relatedEntity.type` + `relatedEntity.id`

---

#### 10. calculations/

**Purpose**: Calculator usage history

```typescript
Document ID: {calculationId}

{
  // Identity
  id: string;
  organizationId: string;
  userId: string;
  athleteId?: string;                // If calculation is for specific athlete
  
  // Calculator Type
  calculatorType: 'vo2max' | 'bmi' | 'body_fat' | 'heart_rate_zones' | 
                  'training_load' | 'recovery_time' | 'power_output' | 
                  'energy_expenditure' | 'injury_risk';
  
  // Input Data
  inputs: Record<string, any>;
  // Example for VO2 Max:
  // { age: 25, gender: "male", distance: 2800, time: 720 }
  
  // Results
  results: {
    primaryValue: number;
    unit: string;
    interpretation: string;
    category?: string;               // "Excellent", "Good", etc.
    percentile?: number;
    zScore?: number;
    
    // Additional calculated values
    derived?: Record<string, number>;
  };
  
  // SIE Formula Used
  formula: {
    id: string;
    name: string;
    version: string;
    reference?: string;              // Scientific paper reference
  };
  
  // Context
  context?: {
    testId?: string;                 // Link to performance test
    notes?: string;
  };
  
  // Metadata
  createdAt: timestamp;
  
  // Status
  isSaved: boolean;                  // User chose to save
  isDeleted: boolean;
}
```

**Indexes**:
- `userId` + `calculatorType` + `createdAt` (desc)
- `athleteId` + `calculatorType` + `createdAt` (desc)
- `organizationId` + `calculatorType` + `createdAt` (desc)

---

#### 11. research-projects/

**Purpose**: Research studies and academic projects

```typescript
Document ID: {projectId}

{
  // Identity
  id: string;
  organizationId: string;
  
  // Project Details
  title: string;
  description: string;
  objectives: string[];
  
  // Classification
  type: 'observational' | 'experimental' | 'cohort' | 'case_study' | 'meta_analysis';
  field: string;                     // "Exercise Physiology", "Biomechanics"
  keywords: string[];
  
  // Research Team
  researchers: Array<{
    userId: string;
    role: 'principal_investigator' | 'co_investigator' | 'research_assistant';
    affiliation?: string;
    joinedAt: timestamp;
  }>;
  
  // Institutional Info
  institution?: {
    name: string;
    department?: string;
    ethicsApprovalNumber?: string;
    fundingSource?: string;
  };
  
  // Study Design
  design: {
    startDate: timestamp;
    endDate?: timestamp;
    duration?: number;               // Weeks
    sampleSize: number;
    targetSampleSize: number;
    inclusionCriteria: string[];
    exclusionCriteria: string[];
  };
  
  // Participants
  participants: Array<{
    athleteId: string;
    enrolledAt: timestamp;
    consentGiven: boolean;
    consentDocument?: string;        // Storage URL
    status: 'enrolled' | 'active' | 'completed' | 'withdrawn';
    withdrawalReason?: string;
  }>;
  
  // Data Collection
  dataCollection: {
    methods: string[];
    schedule: string;
    testProtocols: string[];
    variables: Array<{
      name: string;
      type: 'independent' | 'dependent' | 'control';
      measurementUnit: string;
    }>;
  };
  
  // Data Privacy
  privacy: {
    dataAnonymization: boolean;
    dataRetentionPeriod: number;     // Years
    dataAccessRestrictions: string[];
  };
  
  // Analysis
  analysis?: {
    statisticalMethods: string[];
    hypotheses: string[];
    findings?: string[];
    conclusions?: string[];
  };
  
  // Publications
  publications?: Array<{
    type: 'journal' | 'conference' | 'preprint';
    title: string;
    authors: string[];
    venue?: string;
    date?: timestamp;
    doi?: string;
    url?: string;
  }>;
  
  // Metadata
  createdAt: timestamp;
  updatedAt: timestamp;
  createdBy: string;
  
  // Status
  status: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled';
  isDeleted: boolean;
}
```

**Indexes**:
- `organizationId` + `status` + `createdAt` (desc)
- `researchers.userId` (array-contains) + `status`
- `field` + `status`
- `participants.athleteId` (array-contains)

---

#### 12. audit-logs/

**Purpose**: System-wide audit trail for compliance and security

```typescript
Document ID: {logId}

{
  // Identity
  id: string;
  
  // Actor
  actor: {
    userId: string;
    userName: string;
    role: string;
    ipAddress?: string;
    userAgent?: string;
  };
  
  // Organization Context
  organizationId: string;
  
  // Action
  action: {
    type: 'create' | 'read' | 'update' | 'delete' | 'export' | 'share' | 'approve';
    resource: string;                // "athlete", "test", "report"
    resourceId: string;
    description: string;             // Human-readable description
  };
  
  // Changes (for update/delete)
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    fields: string[];                // Fields that changed
  };
  
  // Result
  result: 'success' | 'failure';
  errorMessage?: string;
  
  // Metadata
  timestamp: timestamp;
  
  // Compliance
  compliance: {
    requiresApproval: boolean;
    sensitiveData: boolean;
    regulatoryFlags?: string[];      // ["GDPR", "HIPAA"]
  };
}
```

**Indexes**:
- `organizationId` + `timestamp` (desc)
- `actor.userId` + `timestamp` (desc)
- `action.resource` + `action.resourceId` + `timestamp` (desc)
- `compliance.sensitiveData` + `timestamp` (desc)

---

#### 13. system-settings/

**Purpose**: Global system configuration

```typescript
Document ID: "global" or specific setting key

{
  // SIE Configuration
  sieEngine: {
    version: string;
    lastUpdated: timestamp;
    formulaCount: number;
  };
  
  // AI Configuration
  aiProviders: Array<{
    name: string;                    // "openai", "anthropic"
    enabled: boolean;
    models: string[];
    rateLimit: number;
  }>;
  
  // Feature Flags
  features: Record<string, boolean>;
  
  // System Limits
  limits: {
    maxAthletes: number;
    maxTeams: number;
    maxStorageGB: number;
    maxUsersPerOrg: number;
  };
  
  // Maintenance
  maintenance: {
    isActive: boolean;
    message?: string;
    startTime?: timestamp;
    endTime?: timestamp;
  };
}
```

---

### Relationship Diagram

```
organizations (1)
  ├─── users (N) - organizationId
  ├─── teams (N) - organizationId
  │     ├─── athletes (N) - teams.teamId array
  │     └─── training-sessions (N) - teamId
  ├─── athletes (N) - organizationId
  │     ├─── performance-tests (N) - athleteId
  │     ├─── medical-records (N) - subcollection
  │     └─── performance-history (N) - subcollection
  ├─── reports (N) - organizationId
  ├─── ai-conversations (N) - organizationId
  ├─── notifications (N) - organizationId
  ├─── calculations (N) - organizationId
  └─── research-projects (N) - organizationId

users (1)
  ├─── ai-conversations (N) - userId
  ├─── notifications (N) - recipientId
  └─── audit-logs (N) - actor.userId

athletes (1)
  ├─── performance-tests (N) - athleteId
  ├─── training-sessions.monitoring (N) - array element
  └─── calculations (N) - athleteId

teams (1)
  ├─── athletes (N) - athletes.teams array
  └─── training-sessions (N) - teamId
```

---

### Indexing Strategy

#### Composite Indexes

1. **Performance Queries**:
   ```
   performance-tests: (organizationId ASC, athleteId ASC, execution.date DESC)
   performance-tests: (athleteId ASC, testType ASC, execution.date DESC)
   training-sessions: (teamId ASC, schedule.date DESC)
   ```

2. **Access Control**:
   ```
   users: (organizationId ASC, role ASC, isActive ASC)
   athletes: (organizationId ASC, status ASC)
   teams: (organizationId ASC, isActive ASC)
   ```

3. **Reporting**:
   ```
   reports: (organizationId ASC, type ASC, createdAt DESC)
   reports: (scope.athleteIds ARRAY_CONTAINS, createdAt DESC)
   ```

4. **Audit & Compliance**:
   ```
   audit-logs: (organizationId ASC, timestamp DESC)
   audit-logs: (actor.userId ASC, timestamp DESC)
   ```

#### Single-field Indexes

- All `isDeleted` fields
- All timestamp fields (`createdAt`, `updatedAt`)
- All `organizationId` fields
- All array fields for array-contains queries

---

### Data Aggregation & Denormalization Strategy

To optimize read performance, we strategically denormalize frequently accessed data:

**Denormalized Fields**:
1. **organizations.stats** - Quick dashboard metrics
2. **athletes.teams[].teamName** - Avoid team lookup for display
3. **athletes.baseline** - Latest performance values
4. **reports.summary** - Pre-calculated report stats
5. **users.organizations[]** - Multi-org access without joins

**Aggregation Rules**:
- Update aggregates via Cloud Functions on write operations
- Use batched writes for consistency
- Implement eventual consistency for non-critical aggregates
- Cache expensive queries in client with refresh strategy

---

### Data Retention & Archival

**Retention Policies**:

1. **Active Data** (Firestore):
   - Current season + 2 previous seasons
   - All users, teams, athletes (unless deleted)
   - Recent 12 months of training sessions
   - Last 3 years of performance tests

2. **Archived Data** (Cold Storage):
   - Older than 3 years → Cloud Storage (parquet/json)
   - Deleted entities → Soft delete + 90-day grace period
   - GDPR deletion requests → Hard delete + compliance log

3. **Audit Logs**:
   - 7 years retention for compliance
   - After 1 year → Move to BigQuery for long-term storage

---

### Security Rules Outline

**Firestore Security Rules Strategy**:

```javascript
// Organization Isolation
function belongsToOrganization(organizationId) {
  return request.auth.token.organizationId == organizationId;
}

// Role Checking
function hasRole(role) {
  return request.auth.token.role == role;
}

function hasAnyRole(roles) {
  return request.auth.token.role in roles;
}

// Permission Hierarchy
// super_admin > org_admin > coach > assistant_coach > sports_scientist > athlete

// Example Rule:
match /athletes/{athleteId} {
  // Read: Anyone in same organization
  allow read: if belongsToOrganization(resource.data.organizationId);
  
  // Write: Coaches, scientists, org admins
  allow write: if belongsToOrganization(request.resource.data.organizationId) &&
                  hasAnyRole(['org_admin', 'coach', 'sports_scientist']);
  
  // Delete: Only org admins
  allow delete: if hasRole('org_admin');
}
```

---

