# XPEL Signature Generator

A guided, self-contained email signature builder for XPEL employees. Generates Outlook-compatible HTML signatures with embedded assets — no external dependencies at runtime.

## Features

- **3-step wizard** — fill in details, preview, then copy and install
- **Mobile signature support** — a 4th step generates a simplified, plain-text signature for Outlook Mobile (identical on iOS and Android), clearly marked with a "Sent via XPEL Mobile" closing line since Outlook Mobile doesn't reliably support the same rich HTML as desktop
- **Device-aware install instructions** — select Windows/Mac and Web-New-Outlook/Classic Desktop to see the exact steps for that combination, including the Mac-specific "Keep Source Formatting" paste step that fixes a common signature-distortion bug
- **Outlook-safe HTML** — table-based layout with base64-embedded images (logos, dividers, diamond watermark)
- **3-tier clipboard fallback** — modern Clipboard API → `execCommand` → manual-copy tab
- **No build step** — open `index.html` directly or serve from any static host

## Project structure

```
├── index.html   — page markup and wizard UI
├── style.css    — all visual styles (design tokens, layout, components)
├── assets.js    — base64-embedded image assets (XPEL logos, dividers, diamonds)
├── app.js       — wizard logic, signature generator, clipboard copy, form wiring
└── README.md
```

## Usage

### Local
Open `index.html` directly in a browser. No server required.

### GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set source to the `main` branch, root (`/`) folder.
4. GitHub Pages will serve `index.html` at `https://<org>.github.io/<repo>/`.

### Any static host
Upload all four files (`index.html`, `style.css`, `assets.js`, `app.js`) to the same directory on any static host (Netlify, Vercel, S3, etc.).

## Signature specs

| Property | Value |
|---|---|
| Total width | 600 px (the only HTML signature width — mobile uses plain text, no fixed width) |
| Card background | `#FFFFFD` (light only — dark mode option was removed) |
| Column layout | 30 · 145 · 30 · 1 · 30 · 239 · 125 = 600 px |
| Fonts (email) | Helvetica, Arial, sans-serif |
| Size | Compact only — the previous "Standard" size option was removed; compact is now the sole layout |
| Compatibility | Outlook desktop (Word renderer), Outlook Web, Apple Mail, Outlook Mobile (plain-text signature, iOS + Android) |

## Notes

- Job titles are automatically uppercased in the rendered signature.
- The phone field is optional; the line is omitted entirely when left blank.
- The mobile app callout ("Download the XPEL Mobile App Today" + Apple/Android links) renders as its own full-width row beneath the main signature block, left-aligned flush with the disclaimer text below it — not inside the name/contact column, so it no longer adds height to the primary card.
- Image assets are embedded as base64 data URIs so they survive copy-paste into Outlook without needing a hosted image server.
- Logo and diamond-watermark images carry explicit `width`/`height` HTML attributes (not just CSS) to prevent Outlook's Word renderer from mis-scaling them.
- Text line-heights use explicit pixel values with `mso-line-height-rule:exactly` for consistent spacing across Outlook desktop versions.
- Outlook Mobile signatures are entirely separate from desktop/web and don't sync automatically. Rather than trying to reproduce the desktop table/logo layout — which is unreliable to paste into Outlook Mobile's rich-text field — the Mobile step generates one simplified plain-text signature (name, title, contact, optional app-download links) shared by iOS and Android, ending with "Sent via XPEL Mobile" so it's clearly identifiable as a mobile reply.

## Brand

XPEL brand yellow: Pantone 1235 C / `#FDB521`  
Signature accent: `#FFB81C`
