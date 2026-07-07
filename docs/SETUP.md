# First-Time Setup Guide

Follow this guide top-to-bottom if you just cloned the repo and have never run the app before. By the end you'll have the backend API running locally and the mobile app running on an Android emulator (or your own phone).

**What you're setting up:**

| Part | Tech | Where it runs |
|---|---|---|
| Mobile app | React Native 0.83 (TypeScript) | Android emulator / physical device |
| Backend API | Node 20 + Express + Prisma | `http://localhost:3000` |
| Database | PostgreSQL 15+ | Local or cloud (Neon) |
| AI | Google Gemini API | Cloud (needs free API key) |

---

## Step 1 — Install Node.js (v20 or newer)

1. Download the **LTS** installer from <https://nodejs.org/en/download> and run it, **or** use a version manager (recommended):

   **macOS / Linux (nvm):**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   # restart your terminal, then:
   nvm install 20
   nvm use 20
   ```

   **Windows:** install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) or just use the nodejs.org installer.

2. Verify:
   ```bash
   node -v   # should print v20.x or higher
   npm -v
   ```

---

## Step 2 — Install JDK 17

React Native's Android build (Gradle 9 + Android Gradle Plugin) requires **JDK 17**. Don't use JDK 8 or 11 — the build will fail.

### macOS (Homebrew)

```bash
brew install --cask zulu@17
```

Then add `JAVA_HOME` to your shell profile (`~/.zshrc`):

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### Windows

1. Download **Eclipse Temurin 17 (LTS)** from <https://adoptium.net/temurin/releases/?version=17> (choose the `.msi` installer).
2. During install, enable **"Set JAVA_HOME variable"** and **"Add to PATH"**.

### Linux

```bash
sudo apt install openjdk-17-jdk   # Debian/Ubuntu
```

### Verify (all platforms)

```bash
java -version    # should say 17.x
echo $JAVA_HOME  # macOS/Linux — should point at the JDK 17 install
```

---

## Step 3 — Install Android Studio + SDK

1. Download Android Studio from <https://developer.android.com/studio> and install it.
2. On first launch, choose the **Standard** setup — this installs the latest Android SDK, emulator, and platform-tools.
3. Open **Settings → Languages & Frameworks → Android SDK** (on macOS: **Android Studio → Settings**) and make sure the following are checked, then click **Apply**:

   **SDK Platforms tab:**
   - ✅ **Android 16 (API Level 36)** — this project compiles against SDK 36

   **SDK Tools tab** (tick **"Show Package Details"** bottom-right):
   - ✅ **Android SDK Build-Tools 36.0.0**
   - ✅ **Android SDK Platform-Tools**
   - ✅ **Android Emulator**
   - ✅ **NDK (Side by side) → 27.1.12297006** (Gradle can also auto-download this on first build, but pre-installing avoids a long wait)

4. Note the **Android SDK Location** shown at the top of that settings page — you need it in the next step.

### Set ANDROID_HOME

**macOS / Linux** — add to `~/.zshrc` (or `~/.bashrc`):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk        # Linux: $HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then reload: `source ~/.zshrc`

**Windows** — in *System Properties → Environment Variables*, add a user variable:
- `ANDROID_HOME` = `C:\Users\<you>\AppData\Local\Android\Sdk`
- Append to `Path`: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\emulator`

### Verify

```bash
adb --version   # should print a version, not "command not found"
```

### Create an emulator (skip if using a physical phone)

1. In Android Studio: **Tools → Device Manager → Create Virtual Device**.
2. Pick a phone (e.g. **Pixel 8**), pick a system image with **API 36** (download it if prompted), and finish.
3. Press ▶ next to the device to make sure it boots.

### Or set up a physical phone

1. On the phone: **Settings → About phone → tap "Build number" 7 times** to enable Developer options.
2. In **Settings → Developer options**, enable **USB debugging**.
3. Plug the phone in via USB and accept the "Allow USB debugging?" prompt.
4. Verify: `adb devices` should list your device.

---

## Step 4 — Set up PostgreSQL

You need a Postgres database (v15+). Pick **one**:

### Option A — Cloud (Neon, easiest, no local install)

1. Sign up free at <https://neon.tech>, create a project.
2. Copy the connection string it gives you (looks like `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`). You'll paste it into `.env` in Step 6.

### Option B — Local install

- **macOS:** `brew install postgresql@16 && brew services start postgresql@16`
- **Windows:** installer from <https://www.postgresql.org/download/windows/> (remember the password you set for the `postgres` user)
- **Linux:** `sudo apt install postgresql`

Then create the database:

```bash
createdb interview_prep
# or via psql:  CREATE DATABASE interview_prep;
```

Your connection string will be: `postgresql://postgres:<your-password>@localhost:5432/interview_prep`

---

## Step 5 — Get a Google Gemini API key

1. Go to <https://aistudio.google.com/apikey> and sign in with a Google account.
2. Click **Create API key** and copy it. (Free tier is fine for development.)

---

## Step 6 — Set up the backend

From the repo root:

```bash
cd backend
npm install
cp .env.example .env        # Windows (cmd): copy .env.example .env
```

Open `backend/.env` and fill in:

```env
DATABASE_URL="postgresql://..."        # from Step 4
JWT_SECRET="any-long-random-string"
REFRESH_TOKEN_SECRET="another-long-random-string"
GEMINI_API_KEY="..."                   # from Step 5
PORT=3000
```

> Tip: generate random secrets with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

Then create the database tables and seed data:

```bash
npx prisma migrate dev      # creates tables (also runs prisma generate)
npx prisma db seed          # optional: seed sample data
```

Start the API:

```bash
npm run dev
```

You should see the server listening on port 3000. Leave this terminal running.

---

## Step 7 — Set up the mobile app

Open a **new terminal** at the repo root:

```bash
npm install
cp .env.example .env        # Windows (cmd): copy .env.example .env
```

Open the root `.env` and set `API_BASE_URL` so the app can reach your backend:

| Where the app runs | Value |
|---|---|
| Android **emulator** | `http://10.0.2.2:3000/api` (`10.0.2.2` is the emulator's alias for your computer's localhost) |
| **Physical phone** (same Wi-Fi as your computer) | `http://<your-computer-LAN-IP>:3000/api` — find your IP with `ipconfig getifaddr en0` (macOS) or `ipconfig` (Windows) |

> ⚠️ `react-native-config` bakes `.env` values in at **build time**. If you change `.env` later, rebuild the app (`npm run android` again), don't just reload JS.

---

## Step 8 — Run the app 🚀

With the backend still running in the other terminal:

```bash
# Terminal A (repo root) — start Metro, the JS bundler
npm start

# Terminal B (repo root) — build & install the app
npm run android
```

The first build downloads Gradle 9 and all Android dependencies — expect **5–15 minutes**. Later builds take under a minute.

When it finishes, the app opens on your emulator/phone. Register a new account and you're in.

### iOS (macOS only, optional)

```bash
sudo gem install cocoapods    # if you don't have CocoaPods
cd ios && pod install && cd ..
npm run ios
```

Requires Xcode from the Mac App Store (open it once first to install its components).

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Unable to locate a Java Runtime` / `Unsupported class file major version` | JDK missing or wrong version — redo Step 2, confirm `java -version` says 17. |
| `Could not initialize class org.gradle.toolchains.foojay.DistributionsKt` / `NoSuchFieldError ... IBM_SEMERU` | No JDK 17 on the machine, so Gradle tried to auto-download one and its downloader plugin crashed. Install JDK 17 (Step 2), point `JAVA_HOME` at it, then run `cd android && ./gradlew --stop` and rebuild. Note: Android Studio's bundled Java (JBR 21) does **not** count — the build needs exactly 17. |
| `SDK location not found` | `ANDROID_HOME` not set (Step 3), or create `android/local.properties` with `sdk.dir=/path/to/Android/sdk`. |
| `Failed to install the app... no connected devices` | Start the emulator first (Device Manager ▶), or check `adb devices` shows your phone. |
| App shows **Network Error** on login/register | Backend not running, or `API_BASE_URL` is wrong for your device type (Step 7). Remember to rebuild after editing `.env`. |
| `P1001: Can't reach database server` from Prisma | Postgres isn't running / `DATABASE_URL` wrong. For Neon, make sure the string includes `?sslmode=require`. |
| Build hangs downloading NDK | Pre-install NDK 27.1.12297006 via SDK Manager (Step 3). |
| Metro cache weirdness after dependency changes | `npm start -- --reset-cache` |
| Gradle acting corrupted | `cd android && ./gradlew clean` (Windows: `gradlew.bat clean`) |

---

## Quick reference — everything at a glance

```bash
# prerequisites: Node 20+, JDK 17, Android Studio (SDK 36), Postgres, Gemini key

# backend
cd backend && npm install
cp .env.example .env         # fill in DATABASE_URL, secrets, GEMINI_API_KEY
npx prisma migrate dev && npx prisma db seed
npm run dev                  # → http://localhost:3000

# mobile (new terminal, repo root)
npm install
cp .env.example .env         # set API_BASE_URL (10.0.2.2 for emulator)
npm start                    # terminal A
npm run android              # terminal B
```
