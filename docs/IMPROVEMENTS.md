# Project Improvement Plan

A prioritized, step-by-step plan to take this project from "demo with inflated README" to a credible, resume-grade full-stack app.

Work top-to-bottom. Check items off as we go.

---

## Current State Audit (as of 2026-05-12)

### What actually works
- React Native app: auth (login/register), home, interview flow (setup/active/summary), daily challenge, profile, progress.
- Redux Toolkit with **2 slices** (`authSlice`, `interviewSlice`) + Provider wired in `App.tsx`.
- Stack + Bottom-tabs navigation.
- Backend: Express + TypeScript + Prisma + Postgres.
- 2 controllers (auth, interview), JWT auth middleware, Gemini service.
- 7 Prisma models: User, Resume, Question, InterviewSession, Answer, Feedback, UserStats, DailyChallenge.

### What's broken or fake
- README claims "15+ slices" → actually 2.
- README claims "12+ tables" → actually 7.
- README claims "99.9% uptime", "50+ concurrent users", "500+ tokens/day" → no monitoring or load test exists.
- README claims voice-to-text, resume parsing, 25+ badges → not implemented.
- `__tests__/` directory is empty. Zero tests.
- `redux-persist` installed and `serializableCheck` configured, but `persistReducer` / `PersistGate` never applied.
- `react-native-reanimated`, `gesture-handler`, `worklets` installed but barely used.
- Empty screen folders: `src/screens/company/`, `src/screens/feedback/`, `src/screens/resume/`.
- ~~`console.log` statements leak emails and token events in `authSlice.ts`.~~ Fixed in Tier 1.2.
- ~~Refresh-token endpoint is missing despite refresh tokens being generated everywhere.~~ Audit correction: the endpoint **does** exist at `POST /api/auth/refresh`. Rotation added in Tier 1.3.
- ~~`backend/src/listModels.ts` appears to be leftover scratch code.~~ Moved to `backend/scripts/` in Tier 1.6.

---

## Tier 1 — Credibility (must fix before showing to anyone) ✅ DONE

- [x] **1.1** Rewrite README with truthful numbers and feature list. Replaced fabricated metrics; called out implemented vs not-yet-implemented surface area.
- [x] **1.2** Remove all `console.log` from `src/store/slices/authSlice.ts` and `src/services/api.ts`. Replaced with a `__DEV__`-gated logger at `src/utils/logger.ts`.
- [x] **1.3** Refresh-token endpoint already existed; **added rotation** (issues a new refresh token alongside each new access token). Mobile interceptor updated to persist the rotated token.
- [x] **1.4** Jest + RTL set up. Tests live in `src/store/slices/__tests__/`. **15 mobile tests passing** across `authSlice` (login/register/logout/loadStoredAuth/clearError), `interviewSlice` reducers, and the App smoke render. `LoginScreen` form test pushed to Tier 2 since it's lower priority than the slice coverage.
- [x] **1.5** Backend Jest + supertest set up. Tests live in `backend/src/__tests__/`. **28 backend tests passing** across `auth.routes` (register/login/refresh happy + error paths + `/health`) and pure validators. `authController` Prisma-mock and `geminiService` SDK-mock tests deferred to Tier 3.
- [x] **1.6** Moved `backend/src/listModels.ts` to `backend/scripts/listModels.ts`.

**Definition of done:** ✅ `npm test` is green in both packages: **15 mobile + 28 backend = 43 tests passing.**

Additional hardening achieved during Tier 1 (worth noting on a resume):
- Refactored `backend/src/server.ts` into an `app.ts` factory + a thin `server.ts` boot script, so tests import the app without spinning up a listener or hitting Postgres.
- Refresh-token **rotation** — measurably better than the original implementation (limits replay window if a refresh token leaks).

---

## Tier 2 — Finish half-wired features ✅ DONE

- [x] **2.1** Uninstalled `redux-persist` (was never wired). Removed the `serializableCheck.ignoredActions` config that referenced its actions. Auth tokens continue to persist via the manual AsyncStorage flow in `authSlice` and the `loadStoredAuth` thunk.
- [x] **2.2** Audit correction: the screen folders weren't empty — `CompanyPrepScreen`, `FeedbackDetailScreen`, and `ResumeInputScreen` already existed; they just weren't wired into navigation. Done in this tier:
  - [x] `CompanyPrepScreen` registered in the Interview stack at route `CompanyPrep`. Entry point added from `InterviewSetupScreen` ("Prep for a specific company →"). Its `handleStartPrep` now navigates to `InterviewSession` with `{ type: 'company-specific', company, role }` params instead of bouncing back to the tab root.
  - [x] `FeedbackDetailScreen` registered at route `FeedbackDetail`. Refactored to use `useNavigation()` + `useRoute()` hooks (its prop-based typing was incompatible with React Navigation's `component` slot). Each question card in `SessionSummaryScreen` is now a `TouchableOpacity` that opens `FeedbackDetail` with the question/answer/feedback payload.
  - [x] `ResumeInputScreen` registered in a new `ProfileStackNavigator`. Entry point added from `ProfileScreen` ("My Resume"). Full PDF parsing still deferred to Tier 4 — this screen currently does an in-memory paste flow.
- [x] **2.3** Three Reanimated animations shipped:
  - [x] Animated horizontal progress bar (`src/components/common/AnimatedProgressBar.tsx`) on `ProgressScreen` showing the avg-score fill from 0 → target over 900ms with cubic-out easing.
  - [x] Animated counting score reveal (`src/components/common/AnimatedNumber.tsx`) on `SessionSummaryScreen` — the score header counts up from 0.0 → average over 1.5s using `useSharedValue` + `useDerivedValue` + `runOnJS`.
  - [x] Question card transition on `InterviewScreen` — wrapped in `Animated.View` with `entering={FadeInUp.duration(400).springify()}` keyed by `currentQuestion.id` so each new question fades up; feedback panel uses `FadeIn.duration(500)`.

**Tier 2 side effects worth noting:**
- Updated `jest.setup.js` with a self-contained Reanimated mock (the upstream `react-native-reanimated/mock` boots the real package and crashes in Jest because `react-native-worklets` requires native modules). The custom mock uses a `Proxy`-based chainable for entering animations and identity functions for `withTiming` etc.
- Mobile + backend tests still green: **15 mobile + 28 backend = 43 tests passing.**

---

## Tier 3 — Engineering hygiene ✅ DONE

- [x] **3.1** Zod env validation at [`backend/src/utils/env.ts`](../backend/src/utils/env.ts). Schema covers DATABASE_URL, GEMINI_API_KEY, JWT_SECRET (≥ 16 chars), REFRESH_TOKEN_SECRET (≥ 16 chars), expiries, allowed origins, log level. Invalid env crashes the process at startup with the failing fields named. `jwt.ts` + `geminiService.ts` now read from the typed `env` object instead of `process.env`.
- [x] **3.2** `express-validator` chains applied to every auth route (`/register`, `/login`, `/refresh`) with a shared `validate` middleware at [`backend/src/middleware/validate.ts`](../backend/src/middleware/validate.ts). Validation failures return the typed envelope with `code: 'VALIDATION_FAILED'` and a `fields` map. Interview routes still rely on body checks in the controllers — fine for now since the inputs are simpler; can be tightened later.
- [x] **3.3** Typed API error envelope shipped end-to-end. Backend: `ApiError` class + `ApiErrorBody` type at [`backend/src/types/errors.ts`](../backend/src/types/errors.ts); `errorHandler` renders it and logs via pino. Mobile: matching `ApiError` class at [`src/types/api.ts`](../src/types/api.ts); axios response interceptor parses `{ code, message, fields }` from server responses and rejects with a typed `ApiError`.
- [x] **3.4** Axios interceptor upgrades in [`src/services/api.ts`](../src/services/api.ts):
  - 10s timeout (kept).
  - Exponential backoff retry for idempotent calls (GET/HEAD/OPTIONS) on 5xx / 408 / 429 / network failures. Base delay 300ms, max 2 retries.
  - `cancellableRequest(config)` helper exporting `{ promise, cancel }` backed by AbortController, for screens that want to cancel on unmount.
- [x] **3.5** `startSession` and `completeSession` wrapped in `prisma.$transaction` so the session + UserStats updates are atomic. If one fails, neither commits.
- [x] **3.6** `/health` (kept) and new `/ready` endpoint that runs `SELECT 1` against Postgres. Returns 503 if the DB is unreachable. Both are excluded from pino-http auto-logging.
- [x] **3.7** `react-native-config` installed. `API_BASE_URL` now read from [`src/config/env.ts`](../src/config/env.ts) which pulls from `Config.API_BASE_URL` with a dev/prod fallback. `.env.example` committed at the repo root; `.env` is already gitignored.
  - **Native linking note:** RN 0.83 autolinks, but you'll need `pod install` (iOS) and a Gradle rebuild (Android) before `Config.API_BASE_URL` resolves at runtime. Until then the fallback URL kicks in.
- [x] **3.8** `pino` + `pino-http` wired through. All `console.*` calls across `server.ts`, `app.ts`, `errorHandler`, `interviewController`, and `geminiService` replaced with structured logger calls. Pino redacts auth headers, password fields, and `*Token` keys automatically. Dev mode pipes through `pino-pretty`.

**Tier 3 side effects:**
- Backend tests adjusted to expect the new validation envelope shape (3 tests updated). Added `backend/jest.setup.ts` to inject placeholder env vars + `LOG_LEVEL=silent` so tests don't spam pino output or trip the zod check.
- Mobile Jest setup updated with a `react-native-config` mock entry.
- All tests still green: **15 mobile + 28 backend = 43 tests passing.**

---

## Tier 4 — Resume-worthy features (pick at least one)

Each of these gives you a real talking point in interviews. Don't try to do all four — depth > breadth.

- [ ] **4.A Voice answers**
  - [ ] Add `react-native-audio-recorder-player` for mobile capture.
  - [ ] Upload audio to backend `POST /api/interview/:sessionId/voice-answer`.
  - [ ] Transcribe with Whisper API or Gemini audio. Write to existing `Answer.transcription` column.
  - [ ] Feed transcription into existing feedback flow.
- [ ] **4.B Resume PDF upload + parsing**
  - [ ] `ResumeUploadScreen` with `react-native-document-picker`.
  - [ ] Backend `POST /api/resume/upload` saves PDF to disk or S3.
  - [ ] `pdf-parse` extracts text → Gemini extracts structured `skills`, `projects`, `experience`.
  - [ ] Generate resume-tailored questions in interview setup.
- [ ] **4.C Streaming AI feedback (SSE)**
  - [ ] Backend streams Gemini tokens via Server-Sent Events.
  - [ ] Mobile consumes stream with `react-native-sse` and renders progressively.
  - [ ] Talking point: latency UX, backpressure.
- [ ] **4.D Redis cache layer**
  - [ ] Cache daily challenge question by date key.
  - [ ] Cache Gemini responses by `(category, difficulty, prompt-hash)`.
  - [ ] Track cache-hit ratio in logs. Talking point: cost savings.

---

## Tier 5 — DevOps & deployability

- [ ] **5.1** `Dockerfile` for backend (multi-stage, non-root user).
- [ ] **5.2** `docker-compose.yml` with backend + Postgres (+ Redis if Tier 4.D done).
- [ ] **5.3** GitHub Actions CI: lint, typecheck, tests, `prisma migrate diff` on PRs.
- [ ] **5.4** Deploy backend to Railway / Render / Fly.io. Put live URL in README.
- [ ] **5.5** Build mobile app for TestFlight (iOS) or Internal Testing (Android). Put install link in README.
- [ ] **5.6** Add Sentry to mobile + backend.
- [ ] **5.7** Swagger/OpenAPI docs via `swagger-jsdoc` + `swagger-ui-express` at `/docs`.

---

## Tier 6 — Mobile UX polish

- [ ] **6.1** Skeleton loaders instead of spinners on Home, Progress, Profile.
- [ ] **6.2** Top-level error boundary in `AppNavigator`.
- [ ] **6.3** Dark mode using the `styles/` folder structure.
- [ ] **6.4** Accessibility audit: `accessibilityLabel`, `accessibilityRole`, dynamic text sizing, screen-reader pass.
- [ ] **6.5** Empty states with illustrations and CTAs (no sessions yet, no resume yet, no daily challenge yet).
- [ ] **6.6** Haptic feedback on key actions (`react-native-haptic-feedback`).

---

## Suggested 4-Week Schedule

| Week | Focus |
|------|-------|
| 1 | Tier 1 (credibility) — tests, README rewrite, refresh tokens, clean logs. |
| 2 | Tier 4 — pick one feature (recommend voice OR resume parsing). |
| 3 | Tier 5 — Dockerize, CI, deploy, TestFlight, Sentry. |
| 4 | Tier 3 finishing + Tier 4 streaming/Redis + Swagger. Polish (Tier 6) as filler. |

---

## Progress Log

_Update as we complete items._

- 2026-05-12 — Plan created.
- 2026-05-12 — Tier 1 complete. 43 tests passing (15 mobile, 28 backend). README rewritten honestly. Refresh-token rotation added. Console logs replaced with dev-gated logger. Backend app factored into `app.ts` for testability.
- 2026-05-12 — Tier 2 complete. redux-persist removed (never wired). CompanyPrep, FeedbackDetail, ResumeInput screens wired into navigators (turns out they existed all along — the audit was wrong). Three Reanimated animations live: progress bar fill, score count-up, question card fade-in. Tests still green.
- 2026-05-12 — Tier 3 complete. Backend: zod env validation, pino + pino-http structured logging, typed `ApiError` envelope with `code`/`fields`, express-validator on all auth routes, `prisma.$transaction` on session start + complete, `/ready` DB-probe endpoint. Mobile: typed `ApiError` mirrored client-side, axios retry with exponential backoff for idempotent calls, `cancellableRequest` helper, react-native-config wired via `src/config/env.ts`. All 43 tests still green.
