# AI Interview Prep Coach

A full-stack mobile app for AI-driven interview practice. React Native client, Node + Express + Prisma + Postgres backend, Google Gemini for question generation and feedback.

[![React Native](https://img.shields.io/badge/React%20Native-0.83-61DAFB?logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql)](https://www.postgresql.org/)

> Work in progress. See [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) for the active roadmap.

---

## What it does today

- **Auth:** email/password registration and login. JWT access tokens + refresh-token rotation. Tokens persisted to AsyncStorage.
- **Interview flow:** pick a session type, get an AI-generated question, submit an answer, get AI feedback, see a session summary.
- **Daily challenge:** dedicated daily-question screen.
- **Profile and progress:** basic user profile and progress screen wired to Redux.

### Implemented surface area

- 6 mobile screens: Login, Register, Home, Interview (Setup/Active/Summary), DailyChallenge, Profile, Progress.
- 2 Redux Toolkit slices: `auth`, `interview`.
- 7 Prisma models: `User`, `Resume`, `Question`, `InterviewSession`, `Answer`, `Feedback`, `UserStats`, `DailyChallenge`.
- 5 API route groups: register, login, refresh, profile, logout; plus interview routes.

### Not yet implemented (called out so the README doesn't oversell)

- Voice-to-text answers (`Answer.transcription` column exists, no audio capture yet).
- Resume PDF upload and parsing (`Resume` model exists, no upload endpoint).
- Achievement badges (only the `UserStats.badges` column exists).
- Leaderboards.
- Streaming feedback.
- Caching layer (Redis).
- Production deploy / Docker / CI.

The active list lives in [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md).

---

## Tech stack

### Mobile (`/`)
- React Native 0.83, TypeScript
- Redux Toolkit + redux-persist (persist not yet wired)
- React Navigation 7 (stack + bottom tabs)
- Axios with interceptors for auth + refresh-token rotation
- AsyncStorage for tokens
- Reanimated + gesture-handler (installed, light usage so far)

### Backend (`backend/`)
- Node 20, Express 4, TypeScript
- Prisma ORM + PostgreSQL
- Google Gemini SDK for question generation and feedback
- JWT (access + refresh, with rotation) and bcrypt
- `express-rate-limit` and `express-validator` (installed; not yet applied across all routes)

---

## Architecture

```
┌──────────────────┐
│  React Native    │  Redux (auth, interview slices)
│   Mobile App     │  axios w/ refresh-token interceptor
└────────┬─────────┘
         │ REST / JSON
┌────────▼─────────┐
│  Express API     │  routes ▶ controllers ▶ services
│  (TypeScript)    │  auth middleware (JWT)
└────────┬─────────┘
         │
    ┌────┴────┬────────────┐
┌───▼───┐ ┌───▼────┐   ┌───▼────┐
│Prisma │ │ Gemini │   │  JWT   │
│  ORM  │ │   AI   │   │ utils  │
└───┬───┘ └────────┘   └────────┘
    │
┌───▼───────────┐
│  PostgreSQL   │
└───────────────┘
```

### Data model
Seven tables today: `users`, `resumes`, `questions`, `interview_sessions`, `answers`, `feedback`, `user_stats`, `daily_challenges`. Cascade deletes from `User` to user-owned rows.

---

## Getting started

> **First time here?** Follow the full step-by-step guide in [docs/SETUP.md](docs/SETUP.md) — it covers installing Node, JDK 17, Android Studio, Postgres, and getting a Gemini API key from scratch.

### Prereqs
- Node ≥ 20
- PostgreSQL ≥ 15 (Neon works)
- React Native CLI + Android Studio / Xcode
- Google Gemini API key

### Backend

```bash
cd backend
npm install
cp .env.example .env   # set DATABASE_URL, GEMINI_API_KEY, JWT_SECRET, REFRESH_TOKEN_SECRET
npx prisma migrate dev
npx prisma generate
npm run dev
```

### Mobile

```bash
npm install
npm run android        # or: npm run ios (run pod install first)
```

Update `API_BASE_URL` in [src/services/api.ts](src/services/api.ts) so the device can reach your backend (LAN IP for a physical device).

---

## API surface

### Auth
```
POST   /api/auth/register     # email, password, name → user + tokens
POST   /api/auth/login        # email, password       → user + tokens
POST   /api/auth/refresh      # refreshToken          → new access + rotated refresh
GET    /api/auth/profile      # (auth)                → user
POST   /api/auth/logout       # (auth)                → ok
```

### Interview
```
POST   /api/interview/start
POST   /api/interview/question/generate
POST   /api/interview/:sessionId/answer
POST   /api/interview/:sessionId/complete
GET    /api/interview/:sessionId/feedback
```

### Misc
```
GET    /health                # liveness probe
GET    /api                   # version banner
```

---

## Tests

```bash
# Mobile
npm test
# 15 tests across authSlice, interviewSlice, and App smoke render.

# Backend
cd backend && npm test
# 28 tests across auth routes (register/login/refresh) and validators.
```

Test layout:
- Mobile: `src/store/slices/__tests__/`
- Backend: `backend/src/__tests__/`

---

## Project layout

```
/
├── App.tsx
├── src/
│   ├── screens/          auth, home, interview, challenge, profile, progress
│   ├── components/       base, common
│   ├── navigation/       App / Auth / Main navigators
│   ├── services/         api.ts, authService, interviewService
│   ├── store/            slices/ (auth, interview)
│   ├── styles/           shared styles
│   ├── types/            shared TS types
│   └── utils/            logger, validation
├── backend/
│   ├── src/
│   │   ├── app.ts            express app factory (used by tests + server)
│   │   ├── server.ts         boot script
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/         authService, geminiService, promptService
│   │   ├── middleware/       auth, errorHandler
│   │   └── utils/            jwt, prisma, validators
│   ├── prisma/               schema.prisma + migrations + seed.ts
│   └── scripts/              listModels.ts (Gemini connectivity check)
└── docs/
    └── IMPROVEMENTS.md       active improvement plan
```

---

## Roadmap

Tracked in [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md). High-level next steps:

1. Finish wiring `redux-persist` (or remove it).
2. Resume upload + Gemini-driven parsing.
3. Voice answers with Whisper / Gemini audio.
4. Dockerize backend, GitHub Actions CI, deploy somewhere public.
5. Streaming feedback (SSE) + Redis cache for Gemini responses.

---

## Author

**Anmol Singh**
- Portfolio: [anmoldevshowcase.vercel.app](https://anmoldevshowcase.vercel.app)
- LinkedIn: [linkedin.com/in/anmolsingh2060](https://www.linkedin.com/in/anmolsingh2060)
- GitHub: [@Anmolzezx](https://github.com/Anmolzezx)

---

## License

MIT.
