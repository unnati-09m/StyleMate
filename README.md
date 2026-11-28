# StyleMate

A personal smart wardrobe assistant for iOS and Android, built with JavaScript, React Native and Expo Router.

## What the app does

- Create and reopen a simple local profile
- Add clothing manually or select a photo from the camera/gallery
- Preview clothing photos before saving; copy selected images into the app Documents directory
- Filter your wardrobe by category
- Build deterministic outfit combinations from your own clothes
- Save favourite outfits and mark looks as worn
- Keep an outfit journal across app restarts
- Load a remote style-inspiration feed with loading, error and retry states
- Schedule an optional daily local outfit reminder at 8 PM and open Outfit Studio when tapped

## Tech stack

- JavaScript
- React Native
- Expo SDK 58
- Expo Router
- AsyncStorage with JSON serialization
- Expo Image Picker
- Expo FileSystem
- Expo Notifications (local notifications only)

## Getting started

Requires Node.js 22.13 or newer.

Clone the repository, run npm install, then run npx expo start.

Because notifications and native camera/gallery behaviour use native modules, test on a physical device or a compatible development build. Local notifications are supported in Expo Go; remote push notifications are not configured in this project.

## Project structure

app contains the welcome, login, signup, outfit studio, look details and tab screens.
constants contains sample clothing and theme values.
utils contains wardrobe storage, style storage, outfit rules and reminders.

## How outfit suggestions work

The outfit builder uses beginner-friendly JavaScript functions, arrays, objects, filter and find. It chooses a dress or a top-and-bottom pair that matches the selected occasion and season, and adds shoes/accessories when available. No AI model or cloud account is used for suggestions.

## Data and privacy note

Profile details, wardrobe entries, favourites and wear history are stored on the device using AsyncStorage. Selected photos are copied into the app's local Documents directory and their file references are stored with the clothing item. The inspiration feed uses DummyJSON as sample remote product data; it is not the user's wardrobe and is not saved as clothing.


## Editorial photography

The welcome, Home, login, sign-up, wardrobe, favourites, history and Outfit Studio screens use separate portrait editorial images from Pexels. The shared EditorialImage component keeps a consistent portrait frame, displays the full image without forced cropping, and shows a neutral fallback when an image cannot be reached. Photos are loaded over the internet, so the device needs connectivity to display them.
