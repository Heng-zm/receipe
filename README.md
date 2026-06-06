# Aikom Frontend

Static frontend for Vercel.

## Theme

The UI uses a clean black / white / blue palette only:

- Background: black
- Text: white
- Accent/actions/status: blue

No `web/env.js` is used. The frontend points to the Render backend from `frontend/index.html`.

## Deploy to Vercel

Deploy the `frontend/` folder.

No build command is required.

## English-only optimization

- All visible UI text is English only.
- Uses a fast system font stack instead of an external Google Fonts request.
- App name, manifest, channel sheet, errors, share text, and countdown labels are English.

- Added a lightweight network-first service worker (`sw.js`) so the PWA opens faster without keeping old deploys stuck.
