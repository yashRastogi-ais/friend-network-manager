# Friend Network Manager

A professional social network friend management system built as a front-end web app.

Features:
- Friend list management
- Friend request acceptance and rejection
- Suggested connections
- Search and filter
- New group and event creation
- Real QR code generation for sharing a profile link
- Professional community-focused UI, not a dating-app style

## Run locally

1. Open `index.html` directly in a browser, or serve it with a static server.
2. If you want a local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Files
- `index.html` – app structure
- `styles.css` – layout and theme
- `app.js` – core logic and interaction logic

## Notes
This is a front-end demo with in-memory state and QR code generation via the QRCode library from jsDelivr.

To extend this project later, you can add a backend with Firebase, Supabase, or Node.js for real persistence and authentication.
