# SportMind AI - Quick Start Guide

## 🚀 Project Overview

**SportMind AI** is a professional AI-powered Sports Science Platform built with:
- **Frontend**: Expo/React Native with TypeScript
- **Architecture**: Clean Architecture (scalable, maintainable)
- **Design**: Premium, Apple-quality UI with dark/light mode
- **Status**: Architecture complete, ready for feature implementation

---

## 📁 Key Directories

```
/app/frontend/
├── app/               → Screens (Expo Router)
│   ├── (tabs)/       → Main tab navigation
│   └── [features]/   → Feature screens
│
├── src/
│   ├── components/   → Reusable UI components
│   │   ├── common/   → Button, Card, Input, etc.
│   │   └── layout/   → Screen, Header, Container
│   │
│   ├── core/
│   │   ├── theme/    → Design system (colors, typography, spacing)
│   │   ├── config/   → App configuration
│   │   └── constants/→ App constants
│   │
│   ├── services/     → External services (Firebase, AI, Storage)
│   ├── types/        → TypeScript types
│   └── utils/        → Utility functions
```

---

## 🎨 Using the Design System

### Import the theme hook
```typescript
import { useTheme } from '@/src/core/theme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={[theme.typography.h1, { color: theme.colors.text }]}>
        Hello
      </Text>
    </View>
  );
};
```

### Available theme properties
```typescript
theme.colors        // All colors (primary, secondary, text, etc.)
theme.typography    // Text styles (h1-h4, body, label, caption)
theme.spacing       // Spacing values (xs, sm, md, lg, xl, etc.)
theme.borderRadius  // Border radius values
theme.shadows       // Shadow presets (sm, md, lg, xl)
theme.layout        // Layout constants
theme.isDark        // Boolean for dark mode
```

---

## 🧩 Using Components

### Button
```typescript
import { Button } from '@/src/components/common';

<Button
  title="Get Started"
  onPress={() => console.log('Pressed')}
  variant="primary"  // primary | secondary | outline | ghost
  size="medium"      // small | medium | large
  icon="arrow-forward"
  fullWidth
/>
```

### Card
```typescript
import { Card } from '@/src/components/common';

<Card variant="elevated" padding="lg">
  <Text>Card content</Text>
</Card>
```

### Input
```typescript
import { Input } from '@/src/components/common';

<Input
  label="Email"
  placeholder="Enter email"
  icon="mail"
  error={errors.email}
  value={email}
  onChangeText={setEmail}
/>
```

### Empty State
```typescript
import { EmptyState } from '@/src/components/common';

<EmptyState
  icon="people"
  title="No Athletes Yet"
  description="Add athletes to start tracking"
  actionLabel="Add Athlete"
  onAction={() => handleAddAthlete()}
/>
```

### Screen
```typescript
import { Screen } from '@/src/components/layout';

<Screen scrollable padding>
  {/* Your content */}
</Screen>
```

### Header
```typescript
import { Header } from '@/src/components/layout';

<Header
  title="Dashboard"
  subtitle="Welcome back"
  showBack
  rightAction={{
    icon: 'settings',
    onPress: () => router.push('/settings')
  }}
/>
```

---

## 🗂️ Adding a New Screen

### 1. Create the file
```bash
# Tab screen
/app/(tabs)/my-feature.tsx

# Stack screen
/app/my-feature/index.tsx
```

### 2. Basic screen template
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from '@/src/components/layout';
import { Header } from '@/src/components/layout';
import { useTheme } from '@/src/core/theme';

export default function MyFeatureScreen() {
  const theme = useTheme();
  
  return (
    <Screen padding={false}>
      <Header title="My Feature" showBack />
      
      <View style={{ padding: theme.spacing.md }}>
        <Text style={[theme.typography.h2, { color: theme.colors.text }]}>
          Feature Content
        </Text>
      </View>
    </Screen>
  );
}
```

### 3. Add to navigation (if tab)
Edit `/app/(tabs)/_layout.tsx` and add:
```typescript
<Tabs.Screen
  name="my-feature"
  options={{
    title: 'My Feature',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="star" size={size} color={color} />
    ),
  }}
/>
```

---

## 🔥 Firebase Integration (When Ready)

### 1. Install Firebase
```bash
cd /app/frontend
yarn expo install firebase
```

### 2. Add config to `.env`
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Uncomment in `/src/services/firebase/index.ts`
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config from '@/src/core/config';

const app = initializeApp(config.firebase);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### 4. Use Firebase services
```typescript
import { auth, db } from '@/src/services/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Add document
const docRef = await addDoc(collection(db, 'athletes'), {
  name: 'John Doe',
  age: 25,
});
```

---

## 🤖 AI Integration (When Ready)

### 1. Get API Key
- Option A: Get OpenAI API key
- Option B: Use Emergent LLM key (universal key for OpenAI, Claude, Gemini)

### 2. Add to `.env`
```bash
EXPO_PUBLIC_OPENAI_API_KEY=your_api_key
```

### 3. Implement in `/src/services/ai/index.ts`
```typescript
export const aiService = {
  chat: async (message: string) => {
    // Implement OpenAI chat
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
      }),
    });
    
    return response.json();
  },
};
```

---

## 📊 State Management (Zustand)

### Create a store
```typescript
// /src/stores/athleteStore.ts
import { create } from 'zustand';
import { Athlete } from '@/src/types';

interface AthleteStore {
  athletes: Athlete[];
  addAthlete: (athlete: Athlete) => void;
  removeAthlete: (id: string) => void;
}

export const useAthleteStore = create<AthleteStore>((set) => ({
  athletes: [],
  addAthlete: (athlete) =>
    set((state) => ({ athletes: [...state.athletes, athlete] })),
  removeAthlete: (id) =>
    set((state) => ({
      athletes: state.athletes.filter((a) => a.id !== id),
    })),
}));
```

### Use the store
```typescript
import { useAthleteStore } from '@/src/stores/athleteStore';

const MyComponent = () => {
  const athletes = useAthleteStore((state) => state.athletes);
  const addAthlete = useAthleteStore((state) => state.addAthlete);
  
  return (
    <Button
      title="Add Athlete"
      onPress={() => addAthlete(newAthlete)}
    />
  );
};
```

---

## 🎯 Common Patterns

### Navigation
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to screen
router.push('/calculator');

// Navigate with params
router.push('/athlete/123');

// Go back
router.back();

// Replace current screen
router.replace('/login');
```

### Storage
```typescript
import { storage } from '@/src/utils/storage';

// Save data
await storage.setItem('user_data', userData);

// Get data
const userData = await storage.getItem('user_data', null);

// Secure storage (for tokens)
await storage.secureSet('auth_token', token);
const token = await storage.secureGet('auth_token', null);
```

### Loading States
```typescript
const [loading, setLoading] = useState(false);

if (loading) {
  return <LoadingSpinner message="Loading athletes..." fullScreen />;
}
```

---

## 🛠️ Development Commands

```bash
# Start development server
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android

# Run on web
yarn web

# Lint code
yarn lint

# Clear cache
yarn start --clear
```

---

## 📚 Key Files to Know

- **Entry point**: `/app/index.tsx`
- **Root layout**: `/app/_layout.tsx`
- **Tab layout**: `/app/(tabs)/_layout.tsx`
- **Theme**: `/src/core/theme/index.ts`
- **Types**: `/src/types/index.ts`
- **Config**: `/src/core/config/index.ts`

---

## ✅ Best Practices

1. **Always use the theme hook** for colors and spacing
2. **Create reusable components** for repeated UI patterns
3. **Keep screens simple** - move logic to hooks or services
4. **Type everything** - leverage TypeScript
5. **Follow 8pt grid** - use `theme.spacing` values
6. **Use vector icons** - never use emoji in UI
7. **Test on multiple devices** - phone and tablet sizes
8. **Handle loading/error states** - always
9. **Make touch targets 44px+** - accessibility
10. **Document complex logic** - help future you

---

## 🐛 Common Issues

### Issue: "Can't find module"
**Solution**: Check import path, use `@/` alias for src

### Issue: "Element type is invalid"
**Solution**: Check component import/export

### Issue: Metro bundler issues
**Solution**: `yarn start --clear`

### Issue: Styles not applying
**Solution**: Check if using StyleSheet.create, not plain objects

### Issue: Dark mode not working
**Solution**: Ensure using `theme.colors.x` not hardcoded colors

---

## 📖 Documentation

- **Architecture**: See `ARCHITECTURE.md`
- **Project Summary**: See `PROJECT_SUMMARY.md`
- **This Guide**: `QUICK_START.md`

---

## 🎉 You're Ready!

The architecture is complete and production-ready. Start building features using the components, theme, and patterns established. Follow Clean Architecture principles and maintain code quality.

**Happy coding! 🚀**
