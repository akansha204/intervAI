# AI Interview Prep Coach 🎯

A full-stack mobile application that helps users prepare for job interviews using AI-powered feedback and STAR method analysis.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## ✨ Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication with refresh tokens
- Auto-login functionality
- Password encryption with bcrypt

### 🤖 AI-Powered Interviews
- Interview type selection (Behavioral, Technical, System Design)
- Difficulty levels (Easy, Medium, Hard)
- AI-generated questions using Google Gemini
- Real-time feedback with STAR method analysis
- Session tracking and scoring

### 📊 Progress Tracking
- Session history with detailed scores
- Performance analytics and statistics
- Progress visualization
- Achievement badges system

### 📝 Personalization
- Resume input for personalized questions
- Company-specific interview preparation
- Targeted question generation

### 🎯 Daily Challenges
- Daily interview challenges
- Streak tracking
- Gamification with points and badges

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **AI**: Google Gemini API
- **Auth**: JWT + bcrypt

### Mobile
- **Framework**: React Native CLI
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **API Client**: Axios
- **Storage**: AsyncStorage

## 📁 Project Structure

```
Ai_Interview_prep/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth & error handling
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── prisma/         # Database schema
│   └── package.json
│
└── mobile/                  # React Native app
    ├── src/
    │   ├── navigation/     # App navigation
    │   ├── screens/        # UI screens
    │   ├── store/          # Redux store
    │   ├── services/       # API services
    │   ├── components/     # Reusable components
    │   └── types/          # TypeScript types
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL database
- Google Gemini API key
- React Native development environment

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
GEMINI_API_KEY="your_gemini_api_key"
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### Mobile Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies (Mac only):
```bash
cd ios && pod install && cd ..
```

4. Start Metro bundler:
```bash
npm start
```

5. Run on Android:
```bash
npm run android
```

6. Run on iOS (Mac only):
```bash
npm run ios
```

## 📱 Screens

- **Auth**: Login, Register
- **Home**: Dashboard with stats
- **Interview**: Setup, Session, Summary
- **Progress**: History, Feedback Detail
- **Profile**: User info, Achievements, Settings
- **Resume**: Resume input
- **Company**: Company-specific prep
- **Challenge**: Daily challenges

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

### Interview
- `POST /api/interview/start` - Start interview session
- `POST /api/interview/question/generate` - Generate AI question
- `POST /api/interview/:sessionId/answer` - Submit answer
- `POST /api/interview/:sessionId/complete` - Complete session
- `GET /api/interview/:sessionId/feedback` - Get feedback

## 🎨 Screenshots

*Coming soon...*

## 📊 Project Stats

- **Days Completed**: 12
- **Total Commits**: 31
- **Screens Built**: 15+
- **Lines of Code**: 5000+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ as a learning project

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- React Native community
- Prisma team

---

**Status**: ✅ Core app complete and functional!
