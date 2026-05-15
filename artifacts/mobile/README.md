# GrimX — Coding IDE for Android

A full VS Code-like coding IDE for Android built with Expo and React Native. Features a 3D-animated Grim Reaper character, Monaco Editor via WebView, and a dramatic black / grey / shining-red theme.

---

## Screenshots

| Intro | Onboarding | IDE Editor |
|-------|------------|------------|
| Animated Grim Reaper rising with falling code particles | 3-slide horizontal walkthrough | Full VS Code layout with Monaco, Terminal, FileTree |

---

## Features

- **Animated Intro Screen** — Grim Reaper rising animation with falling code rain particles
- **Onboarding Flow** — 3-slide swipeable introduction + setup questions + permissions
- **Monaco Editor** — Full VS Code Monaco editor embedded via WebView (CDN) with syntax highlighting, IntelliSense, multi-language support
- **Activity Bar** — File Explorer, Search, Git, Extensions — all functional panels
- **File Tree** — Create, rename, delete files; persistent storage via AsyncStorage
- **Tab Bar** — Multi-file tabs with unsaved-change indicators
- **Integrated Terminal** — Simulated terminal panel
- **Command Palette** — `Ctrl+Shift+P`-style command launcher
- **Status Bar** — Language mode, cursor position, Git branch, encoding
- **Auto-Save** — Debounced 1.5 s after every keystroke
- **Dark Theme Always** — `#0d0d0d` background, `#1a1a1a` surfaces, `#CC0000` shining red accent

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo ~54, Expo Router v6 |
| Language | TypeScript 5.9, React 19 |
| Runtime | React Native 0.81 (New Architecture enabled) |
| Editor | Monaco Editor via WebView + CDN |
| Storage | `@react-native-async-storage/async-storage` |
| Animation | React Native Reanimated 4, `react-native-svg` |
| Fonts | Inter via `@expo-google-fonts/inter` |
| Build | EAS Build (Expo Application Services) |
| Package Manager | npm (for EAS), pnpm (for local dev in monorepo) |

---

## Project Structure

```
artifacts/mobile/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root layout — providers, fonts, splash
│   ├── index.tsx               # Redirect to intro or editor
│   ├── intro.tsx               # Animated intro (Grim Reaper + particles)
│   ├── onboarding.tsx          # 3-slide horizontal onboarding
│   ├── questions.tsx           # Setup wizard (language, theme, etc.)
│   ├── permissions.tsx         # Notification permissions screen
│   └── editor.tsx              # Main IDE screen
│
├── components/                 # Reusable UI components
│   ├── ActivityBar.tsx         # Left sidebar icons
│   ├── CommandPalette.tsx      # Floating command search
│   ├── EditorStatusBar.tsx     # Bottom status bar
│   ├── ErrorBoundary.tsx       # React error boundary wrapper
│   ├── ErrorFallback.tsx       # Error fallback UI
│   ├── FileTree.tsx            # Left panel file explorer
│   ├── GrimReaper.tsx          # Animated SVG Grim Reaper
│   ├── KeyboardAwareScrollViewCompat.tsx
│   ├── MonacoEditor.tsx        # Monaco WebView — generates full HTML string
│   ├── SearchPanel.tsx         # Global file search
│   ├── TabBar.tsx              # Open file tabs
│   └── TerminalPanel.tsx       # Integrated terminal
│
├── context/
│   ├── AppContext.tsx           # Settings, onboarding state
│   └── EditorContext.tsx       # Files, tabs, active panel
│
├── hooks/
│   └── useColors.ts            # Design token hook
│
├── constants/
│   └── colors.ts               # GrimX dark color palette
│
├── assets/
│   └── images/
│       └── icon.png            # App icon (used for splash + adaptive icon)
│
├── app.json                    # Expo app config
├── eas.json                    # EAS Build profiles
├── package.json                # npm dependencies (standalone for EAS)
├── package-lock.json           # npm lockfile (required by EAS)
├── .npmrc                      # legacy-peer-deps=true
├── tsconfig.json               # TypeScript config
├── babel.config.js             # Babel config (expo preset)
└── metro.config.js             # Metro bundler config
```

---

## Prerequisites

Make sure the following are installed on your machine before you begin.

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ (20 LTS recommended) | https://nodejs.org |
| npm | 10+ | bundled with Node |
| Expo CLI | latest | `npm install -g expo-cli` |
| EAS CLI | latest | `npm install -g eas-cli` |
| Git | any | https://git-scm.com |
| Android Studio | latest | https://developer.android.com/studio |
| Java (JDK) | 17 LTS | bundled with Android Studio |

> **Android Studio is required** even for APK-only builds. It provides the Android SDK, `adb`, and emulator tooling.

---

## Android SDK Setup

1. Open **Android Studio** → **SDK Manager** (top-right gear icon)
2. Under **SDK Platforms**, install:
   - Android 14 (API Level 34) ✅
   - Android 13 (API Level 33) ✅ *(optional but recommended)*
3. Under **SDK Tools**, make sure these are checked:
   - Android SDK Build-Tools 34 ✅
   - Android Emulator ✅
   - Android SDK Platform-Tools ✅
   - Intel x86 Emulator Accelerator (HAXM) ✅ *(Intel CPUs only)*

4. Set environment variables in `~/.bashrc` or `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

Then reload your shell:

```bash
source ~/.bashrc   # or source ~/.zshrc
```

5. Verify setup:

```bash
adb --version
sdkmanager --version
```

---

## Local Setup

### 1. Clone & Navigate

```bash
git clone <your-repo-url>
cd <repo-root>/artifacts/mobile
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is set automatically via `.npmrc` — you don't need to type it every time. Running plain `npm install` works too.

### 3. Login to Expo Account

An Expo account is required to use EAS Build.

```bash
# Create a free account at https://expo.dev if you don't have one
eas login
```

### 4. Configure EAS Project

```bash
eas build:configure
```

This links your local project to an Expo project on the cloud. It will generate/update `eas.json` if needed. Accept all defaults.

---

## Running on a Physical Android Device (USB)

### Step 1 — Enable Developer Mode on your phone

1. Go to **Settings → About Phone**
2. Tap **Build Number** 7 times rapidly
3. Go back to **Settings → Developer Options**
4. Enable **USB Debugging** ✅
5. *(Optional)* Enable **Install via USB** ✅

### Step 2 — Connect via USB

```bash
adb devices
```

You should see your device listed. Example output:
```
List of devices attached
RF8N123ABC45   device
```

If it shows `unauthorized`, unlock your phone and tap **Allow** on the USB debugging prompt.

### Step 3 — Run directly on device (Expo Go)

```bash
npx expo start --localhost
```

- Scan the QR code with the **Expo Go** app ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- App loads instantly over USB or LAN

> **Note:** Monaco Editor requires an internet connection — it loads from CDN (`cdn.jsdelivr.net`). Make sure your device has Wi-Fi or mobile data.

---

## Building the APK with EAS

EAS Build compiles a real Android APK in the cloud — no Android Studio compilation required on your machine.

### Preview APK (Recommended for testing)

```bash
cd artifacts/mobile
eas build --platform android --profile preview
```

- Builds a **signed APK** installable on any Android device
- No Play Store account needed
- Build runs on Expo's cloud servers (~5–15 minutes)
- You get a download link when it's done

### Development Build (with dev tools)

```bash
eas build --platform android --profile development
```

- Includes Expo dev client
- Supports hot reload + debugging over USB/LAN

### Production APK

```bash
eas build --platform android --profile production
```

- Optimized, minified, ready for distribution

---

## Installing the APK on Your Device

### Method 1 — Download link (easiest)

After EAS build completes, open the download URL on your phone's browser. Tap the `.apk` file to install it directly.

> You may need to allow **Install Unknown Apps** in Settings → Security.

### Method 2 — ADB install (USB)

```bash
# Download the APK from EAS, then:
adb install -r path/to/grimx.apk
```

### Method 3 — Share via QR code

EAS shows a QR code in the terminal after the build. Scan it on your Android device to download and install.

---

## Build Profiles Reference

Defined in `eas.json`:

| Profile | Output | Use Case |
|---------|--------|----------|
| `development` | Debug APK | Development with hot reload |
| `preview` | Release APK | QA testing / sharing with testers |
| `production` | Release APK | Final distribution |

---

## Running Locally (Web Preview)

For quick UI iteration without a physical device:

```bash
npx expo start --web
```

Opens the app in your browser. Monaco Editor works fully in web mode.

---

## Environment & App Config

| Key | Value |
|-----|-------|
| App Name | GrimX - Coding IDE |
| Bundle ID | `com.grimx.codingide` |
| Scheme | `grimx://` |
| Version | 1.0.0 (versionCode: 1) |
| Min Android API | 24 (Android 7.0) |
| Target Android API | 34 (Android 14) |
| New Architecture | Enabled |
| Orientation | Portrait only |

---

## Architecture Notes

### Monaco Editor
Monaco is loaded via WebView using the CDN:
```
https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/
```
`buildHTML()` in `MonacoEditor.tsx` generates the full HTML string injected into the WebView. Tab switching uses `key={activeTab}` to force a WebView remount — simpler and more reliable than bidirectional JS bridge sync.

### File Persistence
All files are stored in AsyncStorage under the key `@grimx_files`. Default files are merged with user changes on first load.

### Onboarding Flow
```
intro → onboarding → questions → permissions → editor
```
Controlled by `AsyncStorage` flag `@grimx_onboarding_complete`. Once set, the app redirects directly to the editor on every subsequent launch.

### GrimReaper Animation
- SVG internals rendered with `react-native-svg`
- Eye glow via `setInterval` (not Reanimated — SVG nodes can't use Reanimated)
- Float animation uses `Animated.View` wrapper

---

## Common Issues & Fixes

### `adb devices` shows nothing
- Make sure USB Debugging is enabled
- Try a different USB cable (some cables are charge-only)
- Run `adb kill-server && adb start-server`

### APK installs but shows blank screen
- Check that your device has internet access (Monaco loads from CDN)
- Try clearing the app data: Settings → Apps → GrimX → Clear Data

### EAS build fails: `pnpm install exited with non-zero`
- This project uses `"packageManager": "npm@10.5.0"` — EAS must pick up `package-lock.json`, not pnpm
- Make sure `package-lock.json` exists in `artifacts/mobile/`
- Regenerate it: `npm install --legacy-peer-deps --ignore-scripts`

### Metro bundler can't resolve a module
- Run `npx expo start --clear` to clear the Metro cache

### `expo-notifications` error on web
- Expected — push notifications are not supported on web platform; the warning is suppressed in production builds

---

## Scripts Reference

```bash
# Start dev server (web preview)
npm run web

# Start Expo dev server
npm run start

# Build preview APK via EAS
npm run build:android

# Type check
npm run typecheck
```

---

## Dependencies Overview

| Package | Purpose |
|---------|---------|
| `expo ~54` | Core Expo SDK |
| `expo-router ~6` | File-based navigation |
| `react-native 0.81` | React Native runtime |
| `react-native-reanimated ~4.1` | Smooth animations |
| `react-native-svg 15` | SVG rendering for Grim Reaper |
| `react-native-webview 13.15` | Monaco Editor embedding |
| `react-native-worklets 0.5.1` | Reanimated 4 worklets runtime |
| `react-native-gesture-handler ~2.28` | Swipe / gesture support |
| `react-native-screens ~4.16` | Native screen containers |
| `react-native-safe-area-context ~5.6` | Safe area insets |
| `react-native-keyboard-controller 1.18.5` | Keyboard avoiding behavior |
| `@react-native-async-storage/async-storage 2.2` | File & setting persistence |
| `expo-notifications ~0.32` | Push notification support |
| `expo-haptics ~15` | Tactile feedback |
| `expo-linear-gradient ~15` | Gradient backgrounds |
| `@expo-google-fonts/inter 0.4` | Inter font family |
| `@expo/vector-icons ^15` | Icon set |

---

## License

MIT — free to use, modify, and distribute.

---

*Built with Expo, React Native, and Monaco Editor.*
