# SportMind AI - Architecture Documentation

## Overview

SportMind AI is a professional AI-powered Sports Science Platform built with Expo/React Native, following Clean Architecture principles and modular design patterns.

**Target Users:**
- Sports Scientists
- Football Coaches
- Universities & Researchers
- Physiologists
- Sports Medicine Professionals
- Professional Clubs
- Athletes

---

## Tech Stack

### Frontend
- **Framework:** React Native 0.81+ with Expo SDK 54
- **Navigation:** Expo Router (file-based routing)
- **Language:** TypeScript
- **State Management:** Zustand (prepared for future use)
- **UI Components:** Custom design system
- **Charts:** Victory Native
- **Animations:** React Native Reanimated 4.x

### Backend (Prepared)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Storage:** Firebase Storage
- **Notifications:** Firebase Cloud Messaging

### AI Integration (Prepared)
- **AI Provider:** OpenAI API
- **Use Cases:** AI Coach, Performance Analysis, Research Assistant

---

## Project Structure

```
/app/frontend/
├── app/                          # Expo Router - File-based routing
│   ├── (tabs)/                   # Main tab navigation group
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── dashboard.tsx        # Dashboard home screen
│   │   ├── ai-coach.tsx         # AI coaching assistant
│   │   ├── athletes.tsx         # Athlete management
│   │   ├── performance-lab.tsx  # Performance analysis
│   │   └── more.tsx             # Feature hub
│   │
│   ├── calculator/              # Sports Science Calculator
│   │   └── index.tsx
│   ├── research/                # Research Assistant
│   │   └── index.tsx
│   ├── reports/                 # Reports Center
│   │   └── index.tsx
│   ├── team-management/         # Team Management
│   │   └── index.tsx
│   ├── settings/                # Settings
│   │   └── index.tsx
│   │
│   ├── _layout.tsx              # Root layout
│   └── index.tsx                # Entry point (redirects to tabs)
│
├── src/                         # Source code (Clean Architecture)
│   ├── core/                    # Core layer
│   │   ├── theme/              # Design System
│   │   │   ├── colors.ts       # Color palette (light/dark)
│   │   │   ├── typography.ts   # Type scale & styles
│   │   │   ├── spacing.ts      # Spacing, borders, shadows
│   │   │   └── index.ts        # Theme hook & exports
│   │   ├── constants/          # App constants
│   │   └── config/             # App configuration
│   │
│   ├── components/             # Presentation layer
│   │   ├── common/             # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Screen.tsx      # Safe area wrapper
│   │   │   ├── Header.tsx      # Reusable header
│   │   │   └── Container.tsx   # Content container
│   │   └── charts/             # Chart components (future)
│   │
│   ├── domain/                 # Domain layer (business logic)
│   │   ├── entities/           # Core entities
│   │   ├── repositories/       # Repository interfaces
│   │   └── usecases/           # Use cases
│   │
│   ├── data/                   # Data layer
│   │   ├── repositories/       # Repository implementations
│   │   ├── models/             # Data models
│   │   └── api/                # API clients
│   │
│   ├── services/               # External services
│   │   ├── firebase/           # Firebase service (prepared)
│   │   ├── ai/                 # AI service (OpenAI)
│   │   └── storage/            # Storage service
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   │   └── storage/            # KV storage wrapper
│   └── types/                  # TypeScript types
│
├── assets/                     # Static assets
│   ├── images/
│   └── fonts/ (if needed)
│
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── ARCHITECTURE.md             # This file
```

---

## Design System

### Colors
- **Light Mode:** Professional whites, grays, and vibrant accents
- **Dark Mode:** Deep blacks with elevated surfaces
- **Brand Colors:**
  - Primary: Professional Blue (#0066FF)
  - Secondary: Sports Green (#00C853)
  - Accent: Premium Gold (#FFB300)

### Typography
- **Scale:** 12px to 48px following 8pt grid
- **Hierarchy:** Display, Headings (H1-H4), Body, Labels, Captions
- **Weights:** Light (300) to Bold (700)

### Spacing
- **System:** 8pt grid (8, 16, 24, 32, 40, 48...)
- **Border Radius:** 4px to 24px for rounded cards
- **Shadows:** 5 elevation levels (none, sm, md, lg, xl)

### Components
All components support:
- Theme awareness (light/dark mode)
- Accessibility (minimum touch targets: 44px iOS / 48px Android)
- Consistent spacing and styling
- TypeScript type safety

---

## Navigation Structure

### Tab Navigation (Bottom)
1. **Dashboard** - Home overview with quick stats and actions
2. **AI Coach** - AI-powered coaching assistant
3. **Athletes** - Athlete profiles and management
4. **Performance Lab** - Performance analysis and metrics
5. **More** - Hub for additional features

### Stack/Modal Screens
- **Calculator** - Sports Science calculations (VO2 Max, BMI, etc.)
- **Research** - Research assistant tools
- **Reports** - Report generation and viewing
- **Team Management** - Team and roster management
- **Settings** - App preferences and configuration

---

## Modules & Features

### 1. Dashboard
- **Status:** Empty screens created
- **Purpose:** Main overview with quick stats and navigation
- **Features:** Quick action cards, athlete stats, recent activity

### 2. AI Coach
- **Status:** Empty screens created
- **Purpose:** AI-powered coaching insights and recommendations
- **Tech:** OpenAI API (to be integrated)
- **Features:** Chat interface, performance insights, training plans

### 3. Athlete Profiles
- **Status:** Empty screens created
- **Purpose:** Comprehensive athlete data management
- **Features:** Profile management, performance metrics, history

### 4. Performance Lab
- **Status:** Empty screens created
- **Purpose:** Advanced performance analysis
- **Features:** Charts, trends, comparisons, analytics

### 5. Sports Science Calculator
- **Status:** Screen structure created
- **Purpose:** Professional scientific calculations
- **Calculators:**
  - VO2 Max
  - BMI
  - Body Fat Percentage
  - Heart Rate Zones
  - Training Load
  - Recovery Time

### 6. Research Assistant
- **Status:** Empty screens created
- **Purpose:** Sports science research tools
- **Features:** Paper access, analysis tools, citations

### 7. Reports Center
- **Status:** Empty screens created
- **Purpose:** Generate comprehensive reports
- **Exports:** PDF, Excel, Word (to be implemented)

### 8. Team Management
- **Status:** Empty screens created
- **Purpose:** Manage teams and rosters
- **Features:** Team creation, roster management, schedules

### 9. Settings
- **Status:** Structure created
- **Features:** Dark mode toggle, notifications, profile, privacy

---

## Clean Architecture Layers

### 1. Presentation Layer (`/app`, `/src/components`)
- React Native screens and components
- UI logic and user interactions
- Navigation and routing

### 2. Domain Layer (`/src/domain`)
- Business logic and rules
- Entity definitions
- Use case implementations
- Repository interfaces

### 3. Data Layer (`/src/data`)
- Repository implementations
- API clients and data sources
- Data models and DTOs

### 4. Core Layer (`/src/core`)
- Design system (theme)
- App configuration
- Constants and utilities

---

## Firebase Integration (Prepared)

### Setup Steps (When Ready)
1. Install Firebase SDK:
   ```bash
   yarn expo install firebase
   ```

2. Add Firebase config to `.env`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. Uncomment code in `/src/services/firebase/index.ts`

### Firebase Services
- **Authentication:** User sign up, login, password reset
- **Firestore:** Real-time database for app data
- **Storage:** Image and file uploads
- **Cloud Messaging:** Push notifications

---

## OpenAI Integration (Prepared)

### Setup Steps (When Ready)
1. Get OpenAI API key or use Emergent LLM key
2. Add to `.env`:
   ```
   EXPO_PUBLIC_OPENAI_API_KEY=your_api_key
   ```
3. Implement chat and analysis in `/src/services/ai/index.ts`

### AI Features
- AI Coach conversations
- Performance analysis and insights
- Training recommendations
- Research assistance

---

## State Management

### Current Approach
- Local component state with `useState`
- React Context (when needed)

### Prepared for Scale
- **Zustand** installed for global state management
- Lightweight, TypeScript-first
- Better performance than Redux

---

## Development Workflow

### Running the App
```bash
# Start Expo development server
yarn start

# Run on iOS simulator
yarn ios

# Run on Android emulator
yarn android

# Run on web
yarn web
```

### Code Organization Rules
1. **Screens** live in `/app` directory (Expo Router)
2. **Reusable components** live in `/src/components`
3. **Business logic** lives in `/src/domain`
4. **API calls** live in `/src/data`
5. **Theme/design** lives in `/src/core/theme`

### TypeScript
- Strict mode enabled
- Type all props and state
- Use interfaces for complex types
- Types live in `/src/types`

---

## Best Practices

### Component Design
- Small, focused, reusable components
- Props interface for every component
- Use theme hook for styling
- Support both light and dark modes

### Performance
- Use `React.memo` for expensive components
- Lazy load screens and heavy components
- Optimize images with `expo-image`
- Use FlatList/FlashList for long lists

### Accessibility
- Minimum touch target: 44px (iOS) / 48px (Android)
- Use semantic components
- Add accessibility labels
- Support screen readers

### Styling
- Use theme hook for all colors and spacing
- Follow 8pt grid system
- StyleSheet.create for performance
- Avoid inline styles

---

## Next Steps

### Phase 1: Foundation ✅
- [x] Project architecture created
- [x] Design system implemented
- [x] Navigation configured
- [x] Empty screens scaffolded
- [x] Reusable components built
- [x] Firebase structure prepared

### Phase 2: Core Features (Next)
- [ ] Implement athlete data management
- [ ] Build calculator implementations
- [ ] Create chart components
- [ ] Add form validation
- [ ] Implement data persistence

### Phase 3: Backend Integration
- [ ] Set up Firebase
- [ ] Implement authentication
- [ ] Connect Firestore database
- [ ] Add file upload/storage
- [ ] Implement real-time sync

### Phase 4: AI Integration
- [ ] Integrate OpenAI API
- [ ] Build AI Coach chat interface
- [ ] Implement performance analysis
- [ ] Add training recommendations

### Phase 5: Advanced Features
- [ ] Report generation (PDF/Excel)
- [ ] Team management features
- [ ] Research tools
- [ ] Push notifications
- [ ] Offline support

### Phase 6: Polish & Deploy
- [ ] Testing and bug fixes
- [ ] Performance optimization
- [ ] UI/UX refinements
- [ ] App store deployment

---

## Key Design Principles

1. **Premium UX:** Apple-quality, smooth, professional
2. **Scientific Accuracy:** Precise calculations and data
3. **Scalability:** Designed for growth and feature additions
4. **Maintainability:** Clean code, clear structure
5. **Performance:** Fast, responsive, efficient
6. **Accessibility:** Inclusive design for all users

---

## Support & Resources

- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Firebase Docs:** https://firebase.google.com/docs
- **OpenAI Docs:** https://platform.openai.com/docs

---

**Built with ❤️ for Sports Science Professionals**
