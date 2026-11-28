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


## Mobile Application Development rubric coverage

| Criterion | Current implementation |
| --- | --- |
| Mobile fundamentals | React Native View, Text, Image, Pressable and TextInput; screen-safe-area handling; app foreground refresh |
| Screen architecture | Expo Router tabs and stack routes for Home, Wardrobe, Favourites, History, Outfit Studio and Look Details; look data is passed through route params |
| Remote data and persistence | DummyJSON inspiration feed with loading, error and retry states; AsyncStorage JSON persistence for profile, wardrobe, favourites and wear history; wardrobe uses FlatList |
| Interaction lifecycle | Outfit Studio exposes building, success and failed states; save and wear actions expose success, duplicate and failure feedback |
| Hardware and media | Camera and gallery permission requests, denial/revocation fallback, image preview, and selected-photo copies in the app Documents directory |
| Notifications and failures | Optional daily local reminder at 8 PM; notification tap opens Outfit Studio; duplicate foreground alerts are suppressed; failed feed requests can be retried |

## Final manual test before evaluation

Use a physical iPhone for the camera path. The iOS Simulator does not provide a real camera.

1. Create a profile, close/reopen the app, and confirm the Home screen opens. Log out, then log back in with the same email.
2. Open Wardrobe. Add one sample top and one sample bottom, then add a photo from the gallery. Confirm that the preview appears before saving.
3. Deny camera/gallery permission once. Confirm the app shows an explanation instead of crashing. Re-enable permission from iOS Settings and retry.
4. Close and reopen the app. Confirm all wardrobe entries and photos still appear.
5. Open Outfit Studio. Generate a Casual or College look from the top and bottom. Also try a filter that cannot be satisfied and confirm the failure explanation appears.
6. Open the generated look. Save it to Favourites, then mark it as worn. Confirm it appears on the Saved and History tabs. Remove it from Favourites and check History remains.
7. Turn off Wi-Fi/mobile data. Open Home and confirm the style feed displays an error and retry action, while local wardrobe features continue to work. Reconnect and retry.
8. Enable the 8 PM reminder after granting notifications permission. Confirm the reminder is scheduled, then tap it when it arrives and verify Outfit Studio opens. Turn the reminder off and confirm it is cancelled.
9. Background and foreground the app while on Home and Wardrobe. Confirm the app returns without losing saved data.

## Project scope and known limitations

- Profile creation/login is a lightweight local profile stored on the device. It is not secure server-backed authentication.
- The style feed is a sample remote catalogue supplied by DummyJSON. It is separate from the user's personal wardrobe and is not used to generate outfits.
- Outfit generation is deterministic JavaScript logic using the user's own saved wardrobe; it does not use AI or a cloud backend.
- Reminders are local notifications. Remote push notifications are not configured. Android remote push requires a development build and notification credentials; local notifications are supported in Expo Go.
- Editorial photos are loaded from Pexels over the internet. An offline fallback is shown if an editorial photo fails to load.
