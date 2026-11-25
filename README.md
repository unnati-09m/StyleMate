# StyleMate

A personal smart wardrobe assistant for iOS and Android, built with JavaScript, React Native, and Expo Router.

## What StyleMate will do

StyleMate helps people make better use of the clothes they already own. It will keep a photo wardrobe, use manually entered clothing attributes, create explainable rule-based outfit suggestions, and track favourite outfits and wear history.

## Current progress

- [x] Expo project configuration
- [x] Expo Router setup
- [x] Home, Wardrobe, Favourites, and History navigation
- [x] Initial screen layouts and empty states
- [ ] Add clothing photos and manual attributes
- [ ] Save wardrobe items locally
- [ ] Generate rule-based outfit suggestions
- [ ] Save favourite outfit combinations
- [ ] Record wear history

## Tech stack

- JavaScript
- React Native
- Expo SDK 58
- Expo Router
- Expo SQLite (for local persistence)
- Expo Image Picker (for clothing photos)

## Getting started

You need Node.js 22.13 or newer for Expo SDK 58.

Clone the repository and install dependencies:

```bash
git clone https://github.com/unnati-09m/StyleMate.git
cd StyleMate
npm install
```

Start the development server:

```bash
npx expo start
```

Press `i` to open the iOS simulator, or scan the QR code using Expo Go on a compatible device.

## Project structure

```text
app/
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

The project is being built in small, understandable steps. Each feature should remain easy to explain and test. Outfit recommendations use deterministic JavaScript rules; no cloud backend or AI model is required.
