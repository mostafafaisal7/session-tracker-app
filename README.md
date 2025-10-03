# 📘 Session Tracker

A minimalist, offline-friendly Android app to track Claude AI Max session usage. Designed for focus and productivity, with a modern, fluid UI and interactive animations.

---

## ✨ Features

- ✅ **5-Hour Session Timer**  
  Follows Claude Max-style session logic (no pause, no reset). Starts countdown and auto-finishes.

- ✅ **Session Management**  
  - Track sessions used (default: 50/month)
  - See sessions left, average used/day, and remaining/day
  - Manual adjustment: Add used sessions or passed days

- ✅ **Notifications**  
  - 10-minute warning before a session ends
  - Optional local notifications only (no network required)

- ✅ **Interactive UI**  
  - Fluid and modern design  
  - Smooth animated transitions using Reanimated  
  - Interactive buttons and screen flow

- ✅ **Offline & Secure**  
  - All data stored locally via AsyncStorage  
  - No account, login, or network access required

---

## 📱 Screens

| Start Session | Dashboard View | Session End Alert |
|---------------|----------------|-------------------|
| *Add screenshots here* | *Optional UI preview* | *Optional* |

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (via Expo)
- **Language**: TypeScript
- **Storage**: AsyncStorage
- **Animation**: React Native Reanimated
- **Build Tool**: EAS Build (Expo)

---

## 📦 Installation & Build

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/session-tracker.git
cd session-tracker
npm install
# or
yarn install
eas login
eas build --platform android --profile production
💡 Future Ideas (Optional Add-ons)

You can extend the app with any of these optional offline features:

✅ Session notes (purpose, goal)

✅ Daily journal

✅ Task list for sessions

✅ Mood/energy tracker

✅ Session planner

🧑‍💻 Author

Mostafa Faisal
Made with ❤️ and caffeine
