# AI Interview Prep Coach - Backend

Node.js + Express backend with Google Gemini AI integration for interview preparation.

## 🚀 Quick Start

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## 📦 Dependencies

- **express** - Web framework
- **typescript** - Type safety
- **prisma** - Database ORM
- **@google/generative-ai** - Gemini API
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **cors** - CORS middleware

## 🗄️ Database Schema

- **User** - User accounts
- **UserStats** - User statistics
- **InterviewSession** - Interview sessions
- **Question** - Interview questions
- **Answer** - User answers
- **Feedback** - AI feedback

## 🔑 Environment Variables

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
GEMINI_API_KEY="your_gemini_key"
PORT=3000
```

## 📡 API Routes

### Auth (`/api/auth`)
- POST `/register` - Create account
- POST `/login` - Login
- POST `/refresh` - Refresh token
- GET `/profile` - Get profile
- POST `/logout` - Logout

### Interview (`/api/interview`)
- POST `/start` - Start session
- POST `/question/generate` - Generate question
- POST `/:sessionId/answer` - Submit answer
- POST `/:sessionId/complete` - Complete session
- GET `/:sessionId/feedback` - Get feedback

## 🧪 Testing

```bash
npm test
```

## 🏗️ Build

```bash
npm run build
npm start
```

## 📝 Scripts

- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

---

Built with TypeScript + Express + Prisma + Gemini AI
