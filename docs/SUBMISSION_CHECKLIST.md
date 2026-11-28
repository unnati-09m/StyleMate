# StyleMate — Final Submission Checklist

Use this checklist to prepare the app for the Mobile Application Development evaluation. The rubric grades observed behaviour and code, so complete the on-device checks rather than relying only on this document.

## 1. Native UI and app state
- [ ] Home, Wardrobe, Saved, History, Welcome, Login and Signup render with no clipped content.
- [ ] Visible copy is rendered using React Native Text.
- [ ] All app actions use native Pressable or navigation links with native touch targets.
- [ ] Background the app and reopen it from Home and Wardrobe. Confirm it does not crash and saved data is intact.

## 2. Navigation
- [ ] Create a local profile and confirm it opens the tab navigator.
- [ ] Move between Home, Wardrobe, Saved and History.
- [ ] Open Outfit Studio from Home.
- [ ] Generate a look and open Look Details.
- [ ] Use the back button or iOS back gesture and confirm it returns to the previous screen.
- [ ] Tap a saved look or history entry and confirm the correct look details open.
- [ ] Log out, confirm the prompt, and check that the app returns to Welcome without deleting wardrobe data.

## 3. Data, remote integration and persistence
- [ ] Add clothing from the sample list and from the photo library.
- [ ] Confirm wardrobe items appear in a FlatList and category filters work.
- [ ] Close/reopen the app and confirm wardrobe, saved looks, history and profile remain.
- [ ] With an internet connection, confirm the Home inspiration feed loads.
- [ ] Disable the internet connection, confirm the feed shows an error and retry action, then reconnect and retry.

## 4. Interaction/action lifecycle
- [ ] Generate an outfit and observe the building state followed by success.
- [ ] Try an impossible outfit filter and confirm a useful failure explanation.
- [ ] Save a look and confirm success/duplicate feedback.
- [ ] Mark a look as worn and confirm it appears in History.
- [ ] Try marking the same look as worn twice on the same local day and confirm duplicates are prevented.

## 5. Permissions and media
- [ ] On a physical iPhone, request camera permission, take a photo, review its preview and save it.
- [ ] Request photo-library permission, choose a photo, review its preview and save it.
- [ ] Deny permission and confirm the app explains the fallback.
- [ ] Revoke permission in Settings and confirm the app does not crash.
- [ ] Confirm a selected photo is copied to the app Documents directory and remains visible after restart.
- [ ] Confirm remote sample images are represented as remote references, not mistaken for local saved files.

## 6. Notifications and failures
- [ ] Enable the daily reminder and grant notification permission.
- [ ] Verify the local reminder is scheduled for 8:00 PM.
- [ ] Tap the reminder and confirm Outfit Studio opens.
- [ ] While already viewing Outfit Studio, confirm the app does not create a redundant foreground alert for that same content.
- [ ] Disable the reminder and confirm it is cancelled.
- [ ] Confirm the style-feed retry and outfit-generation failure paths remain usable.

## Build and dependency checks

Run these from the repository root after pulling the latest main branch:

~~~~bash
npm install
npx expo install --check
npx expo-doctor
~~~~

If Expo reports version mismatches, align packages with the installed SDK:

~~~~bash
npx expo install --fix
npx expo-doctor
~~~~

Then restart the bundler:

~~~~bash
npx expo start --tunnel -c
~~~~

Do not upgrade to a different Expo SDK major version as part of the final test without checking the corresponding SDK release notes first.

## Honest scope notes for the evaluator

- The profile is a local profile, not server-backed authentication.
- The Home style feed is sample remote product data from DummyJSON; the personal wardrobe stays local.
- Outfit recommendations are deterministic JavaScript rules, not AI-generated.
- Notifications are local reminders. Remote push is not configured.
- Camera permission and camera capture should be demonstrated on a physical device; the iOS Simulator does not have a real camera.
