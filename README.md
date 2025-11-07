# HormoIQ - Hormone Optimization Platform

> Your personal biologist that gets smarter every day.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📱 What is HormoIQ?

HormoIQ is an AI-powered hormone tracking and optimization platform that helps you:

- **Track** hormone levels (Cortisol, Testosterone, DHEA)
- **Analyze** patterns and correlations with sleep, exercise, and stress
- **Optimize** your biology with personalized daily protocols
- **Understand** your BioAge™ based on hormone health
- **Ask** your AI coach for insights and recommendations

## ✨ Key Features

### 📊 **ReadyScore™**
- Daily 0-100 score showing how ready you are for the day
- Factors in hormone levels, sleep quality, exercise, and stress
- Personalized protocols based on your score

### 🧬 **BioAge™**
- Calculate your biological age vs chronological age
- Based on hormone optimization and lifestyle factors
- Track improvements over time

### 🧪 **Smart Test Logging**
- 3-step flow: Select hormone → Enter value → Confirm
- Smart defaults based on time of day and patterns
- Anomaly detection for unusual values
- Context tags for sleep, exercise, stress, supplements

### 📈 **Track & Analyze**
- Visual trend charts for each hormone
- Grouped test history (Today, Yesterday, This Week, Older)
- Pattern recognition (5+ data points)
- Correlation analysis

### 🤖 **AI Coach (Ask Tab)**
- Context-aware responses using your data
- Personalized insights and recommendations
- Chat history persisted locally
- Suggested questions based on your current state

### ☁️ **Cloud Sync (Supabase)**
- **Automatic background sync** - Your data is always backed up
- **Multi-device support** - Access your data anywhere
- **Offline-first** - App works without internet, syncs when connected
- **Secure** - Row-level security ensures your data is private
- **Anonymous auth** - No email required, just tap "Enable Cloud Sync"

## 🗂️ Project Structure

```
hormone/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root layout with tabs
│   ├── index.tsx            # Home (ReadyScore)
│   ├── test/                # Test logging flow
│   │   ├── index.tsx        # Hormone selection
│   │   ├── input.tsx        # Test input form
│   │   └── confirm.tsx      # Confirmation screen
│   ├── track.tsx            # Track tab (history + charts)
│   ├── ask.tsx              # AI chat
│   └── tribe.tsx            # Settings & Sync
├── components/              # Reusable UI components
│   ├── AuthProvider.tsx     # Supabase auth wrapper
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── CircularProgress.tsx
│   ├── HormoneChart.tsx
│   └── BioAgeCard.tsx
├── stores/                  # Zustand state management
│   ├── testStore.ts         # Hormone test data + sync
│   ├── userStore.ts         # User profile
│   └── chatStore.ts         # AI chat history
├── services/                # Business logic
│   └── syncService.ts       # Supabase sync functions
├── lib/                     # Third-party configs
│   └── supabase.ts          # Supabase client
├── utils/                   # Helper functions
│   ├── readyScore.ts        # ReadyScore calculation
│   ├── bioAge.ts            # BioAge calculation
│   ├── intelligence.ts      # Patterns, anomalies, smart defaults
│   ├── dateUtils.ts         # Date formatting and grouping
│   └── haptics.ts           # Haptic feedback
├── constants/
│   └── theme.ts             # Design system (colors, spacing, typography)
├── types/
│   └── index.ts             # TypeScript interfaces and enums
├── supabase/
│   └── schema.sql           # Database schema
├── .env                     # Environment variables (Supabase keys)
├── SUPABASE_SETUP.md        # Supabase setup guide
└── phases.md                # Development phases (completed)
```

## 🔧 Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development toolchain and SDK
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based routing
- **Zustand** - Lightweight state management
- **AsyncStorage** - Local persistence
- **Supabase** - Backend as a service (auth, database, real-time)
- **Anthropic Claude** - AI chat (placeholder, API key required)
- **date-fns** - Date utilities
- **React Native SVG** - Charts and circular progress
- **Expo Haptics** - Tactile feedback

## ☁️ Supabase Setup

### 1. Run the SQL Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/schema.sql`
4. Paste and run the query

### 2. Enable Anonymous Sign-In

1. Go to **Authentication** → **Providers**
2. Enable **Anonymous Sign-In**
3. Save

### 3. Test the Integration

1. Open the app
2. Go to **Tribe** tab
3. Tap **Enable Cloud Sync**
4. Log a test
5. Check your Supabase dashboard to see the synced data

**Full setup guide:** See `SUPABASE_SETUP.md`

## 🎯 Development Phases (All Complete!)

- ✅ **Phase 1:** Foundation & Data Layer
- ✅ **Phase 2:** Test Flow (3-step logging)
- ✅ **Phase 3:** Track Tab (history + charts)
- ✅ **Phase 4:** ReadyScore (Home tab)
- ✅ **Phase 5:** BioAge calculation
- ✅ **Phase 6:** Basic Intelligence (anomalies, patterns, smart defaults)
- ✅ **Phase 7:** Polish (haptics, animations, micro-interactions)
- ✅ **Phase 8:** AI Integration (chat interface)
- ✅ **Phase 9:** Supabase Integration (cloud sync)

## 🧠 Intelligence Features

### Anomaly Detection
- Flags values >40% different from personal average
- Requires 3+ previous tests
- Prompts for confirmation before saving

### Pattern Recognition
- Day-of-week patterns (e.g., "Cortisol highest on Mondays")
- Sleep quality correlations
- Requires 5+ data points
- Statistical significance checks

### Smart Defaults
- Pre-fills form based on historical data
- Time-of-day based hormone selection
- Context tag suggestions from patterns

### ReadyScore Algorithm
```
Base: 50
+ Hormone optimization (cortisol, testosterone, DHEA)
+ Recovery indicators (sleep quality, stress level)
+ Trend bonus (improving vs declining)
- Penalties for poor sleep/high stress
= Score (0-100) → Label (Ready/Good/Moderate/Recovering)
```

### BioAge Algorithm
```
Start: Chronological age
± Hormone optimization score
± Trend factor (improving/declining)
± Consistency bonus (regular testing)
± Recovery indicators (sleep, stress)
= Biological age (clamped ±10 years)
```

## 📱 App Flow

### First Time User
1. Opens app → sees Home tab with ReadyScore 50 (no data)
2. Taps "Take Test Now"
3. Selects hormone (smart default based on time)
4. Enters value and context tags
5. Confirms → sees immediate insight
6. Returns to Home → ReadyScore updated
7. Goes to Track → sees BioAge (after 3+ tests)
8. Goes to Tribe → enables cloud sync (optional)

### Daily User
1. Opens app → sees ReadyScore with protocols
2. Reviews "Your Protocol for Today" recommendations
3. Logs morning cortisol test
4. App syncs in background to Supabase
5. Checks Track tab for trends
6. Asks AI coach a question
7. Gets personalized response based on their data

## 🔐 Security & Privacy

- **Local-first:** All data stored in AsyncStorage, works offline
- **Row-level security:** Users can only access their own data
- **Anonymous auth:** No email required for cloud sync
- **Encrypted:** Supabase handles encryption at rest and in transit
- **No tracking:** No analytics, no third-party trackers

## 🚀 Production Checklist

### Before Launch
- [ ] Add real Anthropic API key for AI chat
- [ ] Replace anonymous auth with email/password or social login
- [ ] Add user onboarding flow (collect profile info)
- [ ] Add data export (CSV/PDF)
- [ ] Add push notifications for reminders
- [ ] Add real-time sync (Supabase Realtime)
- [ ] Add error tracking (Sentry)
- [ ] Add analytics (Mixpanel/Amplitude)
- [ ] App Store assets (screenshots, description, keywords)
- [ ] Privacy policy & terms of service
- [ ] Submit to App Store & Google Play

### Nice to Have
- [ ] Dark mode support
- [ ] Biometric auth (Face ID/Touch ID)
- [ ] Apple Health / Google Fit integration
- [ ] Doctor report export
- [ ] Social features (Tribe tab)
- [ ] Premium features (advanced insights, coach access)

## 📝 Environment Variables

Create a `.env` file in the root:

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic (optional for AI chat)
EXPO_PUBLIC_ANTHROPIC_API_KEY=your-api-key
```

**Note:** `.env` is gitignored. The anon key is safe to commit if needed.

## 🐛 Troubleshooting

### "Sync failed" error
- Check internet connection
- Verify Supabase dashboard is accessible
- Ensure SQL schema was run successfully
- Enable anonymous sign-in in Supabase

### TypeScript errors
```bash
npx tsc --noEmit
```

### Clear cache and rebuild
```bash
rm -rf node_modules
npm install
npx expo start -c
```

### AsyncStorage issues
```bash
npx expo install @react-native-async-storage/async-storage
```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Supabase](https://supabase.com/docs)
- [Anthropic Claude](https://docs.anthropic.com/)

## 🤝 Contributing

This is a private MVP. See `.cursorrules` for coding standards.

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ by the HormoIQ team**

*This is a personal biologist that gets smarter every day.*
