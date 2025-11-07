# 🚀 Quick Build Commands Reference

---

## 🎯 **WHEN YOU'RE READY TO BUILD:**

### **1. Test on Your Device (Development Build)**
```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

**Wait:** 10-20 minutes  
**Result:** Download link to install on your device

---

### **2. Share with Beta Testers (Preview Build)**
```bash
# Both platforms
eas build --profile preview --platform all
```

**Result:**
- TestFlight link (iOS)
- Internal Testing link (Android)

---

### **3. Submit to App Stores (Production Build)**
```bash
# Build
eas build --profile production --platform all

# Then submit
eas submit --platform ios
eas submit --platform android
```

**Requirements:**
- Apple Developer Account ($99/year)
- Google Play Developer Account ($25 one-time)

---

## 📊 **Useful Commands:**

```bash
# Check build status
eas build:list

# View project info
eas project:info

# Check credentials
eas credentials

# View on dashboard
eas build:view
```

---

## 🌐 **Your Dashboard:**
https://expo.dev/accounts/alexismrls/projects/hormone

---

**That's it! You're ready to build!** 🎉

