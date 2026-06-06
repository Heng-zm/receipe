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

## Tailwind UI pass

The frontend now loads Tailwind CSS from the CDN with preflight disabled so the existing production JavaScript hooks keep working while the visible layout uses cleaner utility classes.

Key UI areas updated with Tailwind utilities:

- Top header and app badge
- Install/reconnect banners
- Channel sheet container
- Search input
- Channel list rows
- Public/private selector
- Invite/PIN fields
- Primary/secondary buttons
- Name sheet

The backend API remains unchanged and still runs separately on Render.
