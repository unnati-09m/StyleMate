# StyleMate

A personal smart wardrobe assistant for iOS and Android, built with JavaScript, React Native, and Expo Router.

## Project goal

StyleMate helps people make better use of the clothes they already own. It keeps a photo wardrobe, uses manually entered clothing attributes, creates explainable rule-based outfit suggestions, and tracks favourite outfits and wear history.

## Planned features

- Photo-based personal wardrobe
- Manually entered category, colour, occasion, and season
- Deterministic outfit suggestions using only wardrobe items
- Favourite outfit combinations
- Wear history
- Local-first data storage

## Tech stack

- JavaScript
- React Native
- Expo
- Expo Router
- Expo SQLite (planned for local persistence)
- Expo Image Picker (planned for clothing photos)

## Getting started

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

## Development approach

The application is being built in small, understandable steps. Each feature should remain easy to explain and test. No cloud backend or AI model is required for outfit recommendations.
