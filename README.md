# Hormone App

A minimal Expo app with TypeScript and Expo Router.

## Project Structure

```
app/
  _layout.tsx    # Root layout with bottom tab navigation
  index.tsx      # Home tab
  test.tsx       # Test tab
  ask.tsx        # Ask tab
  track.tsx      # Track tab
  tribe.tsx      # Tribe tab
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npm start
```

Then choose:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan the QR code with Expo Go app on your phone

## Features

- 🚀 Expo SDK 54
- 📱 Expo Router (file-based routing)
- 🎨 Minimal design (white background, black text)
- 📑 5 bottom tabs: Home, Test, Ask, Track, Tribe
- 📘 TypeScript support

## Development

The app uses Expo Router for navigation. Each file in the `app/` directory becomes a route:

- `app/index.tsx` → Home tab (/)
- `app/test.tsx` → Test tab (/test)
- `app/ask.tsx` → Ask tab (/ask)
- `app/track.tsx` → Track tab (/track)
- `app/tribe.tsx` → Tribe tab (/tribe)

