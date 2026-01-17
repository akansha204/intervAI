# AI Interview Prep Coach - Mobile App

React Native mobile application for AI-powered interview preparation.

## 🚀 Quick Start

```bash
npm install
npm start
npm run android  # or npm run ios
```

## 📦 Dependencies

- **@react-navigation/native** - Navigation
- **@react-navigation/stack** - Stack navigator
- **@react-navigation/bottom-tabs** - Tab navigator
- **@reduxjs/toolkit** - State management
- **react-redux** - Redux bindings
- **axios** - HTTP client
- **@react-native-async-storage/async-storage** - Local storage

## 📱 Screens

### Auth
- LoginScreen
- RegisterScreen

### Main
- HomeScreen - Dashboard
- InterviewSetupScreen - Interview configuration
- InterviewScreen - Q&A interface
- SessionSummaryScreen - Results

### Progress
- ProgressScreen - History & analytics
- FeedbackDetailScreen - STAR analysis

### Profile
- ProfileScreen - User profile & achievements

### Additional
- ResumeInputScreen - Resume entry
- CompanyPrepScreen - Company prep
- DailyChallengeScreen - Daily challenges

## 🗂️ Project Structure

```
src/
├── navigation/          # Navigation setup
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── MainNavigator.tsx
├── screens/            # All screens
│   ├── auth/
│   ├── home/
│   ├── interview/
│   ├── progress/
│   ├── profile/
│   ├── resume/
│   ├── company/
│   └── challenge/
├── store/              # Redux store
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts
│       └── interviewSlice.ts
├── services/           # API services
│   ├── api.ts
│   ├── authService.ts
│   └── interviewService.ts
├── components/         # Reusable components
│   └── common/
│       ├── Button.tsx
│       └── Input.tsx
├── utils/              # Utilities
│   └── validation.ts
└── types/              # TypeScript types
    └── index.ts
```

## 🎨 Styling

All components use **inline styling** for consistency and simplicity.

## 🔐 Authentication Flow

1. App launches → Check AsyncStorage for tokens
2. Tokens found → Auto-login → Main app
3. No tokens → Login/Register screens
4. After login → Save tokens → Navigate to Main

## 📡 API Integration

Base URL: `http://localhost:3000/api`

- Automatic JWT token injection
- Token refresh on 401 errors
- Error handling with retry logic

## 🧪 Testing

```bash
npm test
```

## 🏗️ Build

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -configuration Release
```

## 📝 Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run lint` - Run linter

---

Built with React Native + TypeScript + Redux Toolkit
