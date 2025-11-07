# Supabase Setup Guide for HormoIQ

## ✅ Quick Setup (5 minutes)

### Step 1: Run the SQL Schema

1. Go to your Supabase Dashboard: https://rpvuahbzzpcmfajqtpdt.supabase.co
2. Click on the **SQL Editor** tab in the left sidebar
3. Create a new query
4. Copy the entire contents of `supabase/schema.sql`
5. Paste it into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

You should see: `Success. No rows returned`

### Step 2: Enable Anonymous Sign-In

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Find **Anonymous Sign-In**
3. Toggle it **ON**
4. Click **Save**

### Step 3: Verify Setup

Run the app and:
1. Go to the **Tribe** tab
2. Click **Enable Cloud Sync**
3. You should see "✅ Connected to Cloud"
4. Log a test on the Test tab
5. Go back to Tribe and click **Sync Now**
6. Check your Supabase dashboard → **Table Editor** → `tests` table
7. You should see your test data!

---

## 🔍 What Was Set Up

### Database Tables

#### `profiles`
- Stores user profiles (name, birth year, gender, goals)
- One profile per user (linked to Supabase auth)
- Automatically created when a user signs in

#### `tests`
- Stores all hormone test results
- Links to user via `user_id`
- Includes full context (sleep, exercise, stress, supplements)

### Security (Row Level Security)
- Users can ONLY see their own data
- All queries are automatically filtered by user ID
- No way to access other users' data

### Automatic Features
- Profile auto-created on first sign-in
- Timestamps auto-updated
- Indexes for fast queries

---

## 🚀 How It Works in the App

### Automatic Background Sync
When a user logs a test:
1. Saved to local AsyncStorage immediately (optimistic UI)
2. Synced to Supabase in background
3. If sync fails, retries automatically with exponential backoff
4. User never waits - app feels instant

### Manual Sync
Users can manually sync from the Tribe tab:
- Fetches any tests from other devices
- Uploads any tests not yet synced
- Merges data intelligently (no duplicates)

### Offline Support
- App works 100% offline
- Data persists locally in AsyncStorage
- Syncs automatically when connection returns

---

## 🔐 Environment Variables (Already Set)

Your `.env` file contains:
```
EXPO_PUBLIC_SUPABASE_URL=https://rpvuahbzzpcmfajqtpdt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are safe to commit - the anon key is public and protected by Row Level Security.

---

## 📊 Monitoring Your Data

### View All Tests
1. Dashboard → **Table Editor**
2. Select `tests` table
3. See all hormone tests from all users

### View Profiles
1. Dashboard → **Table Editor**
2. Select `profiles` table
3. See user profiles

### Check Auth Users
1. Dashboard → **Authentication** → **Users**
2. See all signed-in users (anonymous users will show as "Anonymous")

---

## 🛠️ Troubleshooting

### "Failed to sync" error
1. Check your internet connection
2. Verify Supabase dashboard is accessible
3. Check the SQL schema was run successfully
4. Ensure anonymous sign-in is enabled

### Tests not appearing in Supabase
1. Make sure you clicked "Enable Cloud Sync" in Tribe tab
2. Check you're logged in (should show ✅ Connected to Cloud)
3. Try clicking "Sync Now" manually
4. Check browser console for errors

### "Row Level Security" error
- This means the SQL schema didn't run properly
- Re-run the entire `schema.sql` file
- Make sure you're logged in to Supabase dashboard

---

## 🎯 Next Steps

### For Production
1. **Add Email/Password Auth**: Replace anonymous with real accounts
2. **Add Social Login**: Google, Apple, etc.
3. **Profile Completion**: Collect actual name, goals during onboarding
4. **Real-time Sync**: Use Supabase Realtime for instant updates
5. **Export Data**: Let users export their tests to CSV/PDF

### Advanced Features
- **Multi-device notifications**: "You logged a test on your iPhone"
- **Data insights**: Server-side analysis of all users' aggregated data
- **Backup/restore**: Cloud backup with point-in-time recovery
- **Sharing**: Let users share specific tests or trends with doctors

---

## 📝 Schema Changes

If you need to modify the schema later:

1. Write a new migration SQL file
2. Test it in SQL Editor
3. Update `lib/supabase.ts` types if needed
4. Update `syncService.ts` if columns changed

---

## ✅ You're All Set!

Your app now has:
- ✅ Cloud backup
- ✅ Multi-device sync
- ✅ Secure data storage
- ✅ Offline-first architecture
- ✅ Automatic retries
- ✅ Row-level security

**The app works offline and syncs in the background. Users don't need to think about it!**

