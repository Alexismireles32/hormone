# 🔧 HormoIQ Troubleshooting Guide

---

## ✅ **ISSUE FIXED: "Cannot find module 'react-native-worklets'"**

### **Problem:**
```
ERROR: Cannot find module 'react-native-worklets/plugin'
Error code 500 on device
```

### **Root Cause:**
Missing `babel.config.js` file and `react-native-worklets-core` dependency.

### **Complete Solution Applied:**
```bash
# 1. Install missing dependency
npm install react-native-worklets-core

# 2. Update react-native-svg
npm install react-native-svg@15.12.1 --legacy-peer-deps

# 3. Create babel.config.js (CRITICAL!)
# File created with proper Reanimated plugin configuration

# 4. Clear ALL caches
rm -rf .expo
rm -rf node_modules/.cache
watchman watch-del-all

# 5. Restart with clean cache
npx expo start --clear
```

### **Status:** ✅ Fixed!

### **Key Fix:**
The missing `babel.config.js` file was preventing the Reanimated plugin from loading properly. This file is now created and configured correctly.

---

## 🚀 **How to Start the App (After Fix)**

### **1. Start the Development Server:**
```bash
cd /Users/alexismireles/Documents/Hormone/hormone
npm start
```

### **2. Test on Device:**
- **iOS:** Press `i` for simulator OR scan QR code with Camera app
- **Android:** Press `a` for emulator OR scan QR code with Expo Go app
- **Web:** Press `w` for browser (limited functionality)

### **3. First Time Setup on Device:**
The app will:
1. Show welcome screen
2. Ask for profile info (birth year, gender, goals)
3. Guide you to log first test
4. Show confetti celebration 🎉
5. Request notification permissions
6. Redirect to main app

---

## 🐛 **Common Issues & Fixes**

### **Issue: Metro Bundler Cache Error**
**Symptoms:** Old errors persisting, strange import issues

**Fix:**
```bash
rm -rf node_modules/.cache
npx expo start --clear
```

---

### **Issue: Port Already in Use**
**Symptoms:** "Port 8081 is running node..."

**Fix:**
Expo will ask if you want to use a different port. Choose "yes" or:
```bash
# Kill the process on port 8081
lsof -ti:8081 | xargs kill -9
npm start
```

---

### **Issue: TypeScript Errors**
**Symptoms:** Red squiggly lines in VS Code

**Fix:**
```bash
npx tsc --noEmit
```
Should show: 0 errors ✅

If errors persist, restart VS Code TypeScript server:
- `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows)
- Type: "TypeScript: Restart TS Server"

---

### **Issue: Supabase Connection Error**
**Symptoms:** "Failed to sync", "Network error"

**Check:**
1. Is internet connected?
2. Are `.env` variables set?
   ```bash
   cat .env
   ```
   Should show:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://rpvuahbzzpcmfajqtpdt.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. Test Supabase connection:
   - Open app
   - Go to "Tribe" tab (Settings)
   - Check connection status

**Fix:**
```bash
# Restart with clear cache
npx expo start --clear
```

---

### **Issue: Notifications Not Working**
**Symptoms:** No notification permission prompt, reminders not firing

**Check:**
1. Did you grant permission during onboarding?
2. Are notifications enabled in Tribe/Settings tab?

**Fix on iOS:**
- Settings → HormoIQ → Notifications → Allow Notifications

**Fix on Android:**
- Settings → Apps → HormoIQ → Notifications → Enable

**Test:**
```javascript
// In app/tribe.tsx, check:
const { notificationsEnabled, reminderTime } = useNotificationStore();
console.log('Notifications:', notificationsEnabled, reminderTime);
```

---

### **Issue: White Screen / Blank App**
**Symptoms:** App opens but shows nothing

**Possible causes:**
1. JavaScript error in onboarding
2. AsyncStorage issue
3. Navigation error

**Fix:**
```bash
# Clear app data and restart
npx expo start --clear

# On device, delete and reinstall app via Expo Go
```

**Debug:**
Open debugger:
- Shake device (physical) or `Cmd + D` (iOS simulator) or `Cmd + M` (Android emulator)
- Select "Debug JS Remotely"
- Check Chrome DevTools console for errors

---

### **Issue: "Unable to resolve module" Errors**
**Symptoms:** Import errors, module not found

**Fix:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --clear
```

---

### **Issue: Animations Not Working**
**Symptoms:** Circular progress ring not animating, confetti not showing

**Check:**
1. Is `react-native-reanimated` installed?
   ```bash
   npm list react-native-reanimated
   ```
   Should show: `react-native-reanimated@4.2.2` or similar

2. Is `react-native-worklets-core` installed?
   ```bash
   npm list react-native-worklets-core
   ```
   Should show: `react-native-worklets-core@...` 

**Fix:**
```bash
npm install react-native-worklets-core
npx expo start --clear
```

---

### **Issue: Charts Not Displaying**
**Symptoms:** Empty chart area in Track tab

**Known Issue:** Victory Native has compatibility issues with Expo 54

**Current Status:** Using simplified placeholder charts (functional)

**Workaround:** Charts display test data with simplified line graphs

**Future Fix:** Will be addressed in Phase 13 (victory-native update or alternative)

---

### **Issue: AI Chat Not Responding**
**Symptoms:** Messages sent but no AI response

**Expected Behavior:** 
- Demo mode provides intelligent placeholder responses
- Should respond within 1 second

**Check:**
1. Is `chatStore` working?
2. Are test data available for context?

**Fix:**
```bash
# Check console for errors
# In debugger, check:
const messages = useChatStore((state) => state.messages);
const isLoading = useChatStore((state) => state.isLoading);
console.log('Messages:', messages, 'Loading:', isLoading);
```

---

### **Issue: App Crashes on First Test**
**Symptoms:** App closes when submitting first test during onboarding

**Check:**
1. Is Supabase configured?
2. Are test store actions working?

**Fix:**
```bash
# Check logs for error
# Restart with clear cache
npx expo start --clear
```

**Debug:**
Add console.log in `app/onboarding/first-test.tsx`:
```typescript
const handleSubmit = () => {
  console.log('Submitting test:', { selectedHormone, value });
  // ... rest of code
};
```

---

### **Issue: ReadyScore Not Calculating**
**Symptoms:** Shows "No Data" even with tests logged

**Check:**
1. Are tests being saved to store?
   ```javascript
   const tests = useTestStore((state) => state.tests);
   console.log('Tests:', tests.length, tests);
   ```

2. Is `calculateReadyScore` working?

**Fix:**
- Need at least 1 test within last 48 hours
- Ensure test timestamps are valid dates
- Check `utils/readyScore.ts` logic

---

### **Issue: BioAge Not Showing**
**Symptoms:** "No Data" in BioAge card

**Check:**
1. Is user profile set?
   ```javascript
   const profile = useUserStore((state) => state.profile);
   console.log('Profile:', profile);
   ```

2. Are there enough tests?
   - Minimum: 3 tests required for accurate calculation

**Fix:**
- Complete onboarding to set profile
- Log at least 3 tests
- Ensure birth year is valid (1900-2025)

---

## 📱 **Device-Specific Issues**

### **iOS Simulator:**
- ✅ Full functionality
- ✅ Notifications work
- ✅ Haptics simulated
- ⚠️ Camera/QR scan won't work (expected)

### **Android Emulator:**
- ✅ Full functionality
- ✅ Notifications work
- ✅ Most features
- ⚠️ Haptics may not feel accurate
- ⚠️ Camera/QR scan may not work

### **Physical Devices:**
- ✅ Best experience
- ✅ All features work
- ✅ Real haptics
- ✅ Real notifications

---

## 🧪 **Testing Checklist**

### **Before Sharing with Beta Testers:**
- [ ] Fresh install completes onboarding
- [ ] First test logs successfully
- [ ] Confetti shows on celebration
- [ ] Notification permission requested
- [ ] Can log additional tests (Test tab)
- [ ] ReadyScore updates correctly (Home tab)
- [ ] Track tab shows test history
- [ ] AI chat responds (Ask tab)
- [ ] Cloud sync works (Tribe tab)
- [ ] App works offline

### **Test on Multiple Platforms:**
- [ ] iOS Simulator (Cmd + I in terminal)
- [ ] Android Emulator (Cmd + A in terminal)
- [ ] Physical iPhone (scan QR)
- [ ] Physical Android (Expo Go + QR)

---

## 🔍 **Debugging Tools**

### **1. React Native Debugger:**
```bash
# Open debugger
# On device: Shake → "Debug JS Remotely"
# On simulator: Cmd + D (iOS) or Cmd + M (Android)
```

### **2. Metro Bundler Logs:**
Watch the terminal where `npm start` is running for errors

### **3. Expo DevTools:**
```bash
# Open in browser
# Visit: http://localhost:8083
# Shows logs, errors, and app state
```

### **4. Check AsyncStorage:**
```javascript
// Add to any component
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.getAllKeys().then(keys => {
  console.log('Storage keys:', keys);
  keys.forEach(key => {
    AsyncStorage.getItem(key).then(value => {
      console.log(key, ':', value);
    });
  });
});
```

### **5. Check Zustand Stores:**
```javascript
// In any component
const tests = useTestStore((state) => state.tests);
const profile = useUserStore((state) => state.profile);
const messages = useChatStore((state) => state.messages);
const isOnboarded = useOnboardingStore((state) => state.isOnboarded);

console.log({ tests, profile, messages, isOnboarded });
```

---

## 🆘 **Reset Everything (Nuclear Option)**

If all else fails:

```bash
# 1. Stop Expo server (Ctrl + C)

# 2. Clear all caches
rm -rf node_modules
rm -rf .expo
rm -rf node_modules/.cache
npm cache clean --force

# 3. Reinstall dependencies
npm install --legacy-peer-deps

# 4. Clear Metro bundler
npx expo start --clear

# 5. On device: Delete app and reinstall via Expo Go
```

---

## 📞 **Getting Help**

### **Check Logs First:**
1. Terminal where `npm start` is running
2. Device debugger (shake → debug)
3. Browser console (if using web)

### **Common Log Patterns:**

**✅ Good logs:**
```
✓ Bundling complete
✓ Fast refresh enabled
✓ Connected to device
```

**⚠️ Warning logs (usually safe to ignore):**
```
The following packages should be updated...
Require cycle warning...
```

**❌ Error logs (need fixing):**
```
ERROR: Cannot find module...
ERROR: Undefined is not an object...
ERROR: Network request failed...
```

---

## 🎯 **Quick Fixes Summary**

| Issue | Quick Fix |
|-------|-----------|
| Won't start | `npx expo start --clear` |
| Import errors | `rm -rf node_modules && npm install --legacy-peer-deps` |
| Cache issues | `rm -rf node_modules/.cache` |
| White screen | Check debugger console for JS errors |
| Supabase issues | Check `.env` file and internet connection |
| Notifications not working | Check device settings permissions |
| TypeScript errors | `npx tsc --noEmit` then restart VS Code |
| Port conflict | Choose different port or kill process |

---

## ✅ **Current Status After Fix**

### **What's Working:**
- ✅ App compiles without errors
- ✅ All dependencies installed correctly
- ✅ Metro bundler running
- ✅ Ready to test on device

### **Next Steps:**
1. Scan QR code on device
2. Complete onboarding flow
3. Test all tabs
4. Report any new issues

---

**Last Updated:** After fixing react-native-worklets dependency issue

**App Status:** ✅ Ready for testing!

