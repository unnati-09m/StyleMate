# StyleMate

A personal smart wardrobe assistant for iOS and Android, built with JavaScript, React Native, and Expo Router.

## Current progress

- [x] Expo project configuration and Expo Router
- [x] Four-tab navigation: Home, Wardrobe, Favourites, History
- [x] Initial screen layouts and empty states
- [x] Welcome screen
- [x] Local profile creation and email-based profile access
- [x] Manual clothing attributes and wardrobe item management\n- [ ] Clothing photo picker
- [x] Local wardrobe persistence with AsyncStorage
- [ ] Rule-based outfit suggestions
- [ ] Favourite outfit persistence
- [ ] Wear history persistence

## Important note about profiles

The current create-profile flow stores a name and email locally on the device using AsyncStorage. It is a lightweight local profile for this offline-first student project, not a secure online account or server-backed authentication system.

## Tech stack

- JavaScript
- React Native
- Expo SDK 58
- Expo Router
- AsyncStorage for the initial local profile
- Expo SQLite planned for wardrobe, favourites, and wear history
- Expo Image Picker planned for clothing photos

## Getting started

Requires Node.js 22.13 or newer.

```bash
git clone https://github.com/unnati-09m/StyleMate.git
cd StyleMate
npm install
npx expo start
```

Press `i` to open the iOS simulator, or scan the QR code using Expo Go on a compatible device.

## Project structure

```text
app/
  _layout.js
  index.js
  welcome.js
  signup.js
  login.js
  (auth)/
    _layout.js
  (tabs)/
    _layout.js
    index.js
    wardrobe.js
    favourites.js
    history.js
constants/
  theme.js
```

## Development approach

The app is built in small, understandable steps. Outfit recommendations will use deterministic JavaScript rules based only on clothes the user has added. No cloud backend or AI model is required.
