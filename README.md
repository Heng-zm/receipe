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


## UI updates

- App title/logo text: `អាយកូម`.
- Channel create/join sheet supports `សាធារណៈ / Public` and `ឯកជន / Private`.
- Khmer-friendly Google font stack uses `Noto Sans Khmer` with a Google Sans-style fallback.
