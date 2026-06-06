# អាយកូម Frontend — Vercel

Static frontend only. No backend code and no `web/env.js`.

## Backend URL

Edit `index.html`:

```js
var DEFAULT_BACKEND_API_URL = 'https://walkietalk-server-4pmn.onrender.com';
```

The frontend derives all API paths from that one Render backend URL:

```txt
WebSocket -> DEFAULT_BACKEND_API_URL + /ws
Mapbox    -> DEFAULT_BACKEND_API_URL + /config/mapbox
Zones     -> DEFAULT_BACKEND_API_URL + /zones
Channels  -> DEFAULT_BACKEND_API_URL + /channels
Health    -> DEFAULT_BACKEND_API_URL + /health
```

## Vercel settings

Set Vercel project root to this `frontend/` folder.

No build command is required.

## UI update

The frontend has no `web/env.js`. Branding, manifest, and PWA title are **អាយកូម**. The channel sheet includes:

- Public/private selector
- Invite code/PIN inputs for private channels
- Channel search
- Khmer member count text `ចំនួនមនុស្ស`
- Empty channel countdown
- Auto reconnect and auto rejoin last channel

## UI safe-area layout update

- Frontend viewport now uses `viewport-fit=cover` for correct iPhone/Android safe-area handling.
- Main talk screen spacing was rebalanced for small phones, tall phones, and landscape.
- Channel sheet sizing, list height, buttons, and form spacing were standardized.
- Bottom navigation, toast, install prompt, map controls, and overlays now respect safe-area insets.
