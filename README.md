# Termato Website

Marketing landing page for **Termato** — a free, self-hosted, AI-native terminal
and coding workspace.

Block-based terminal, a built-in Claude coding agent, live app previews, git
worktrees, and real-time multi-device sync — all running on your own machine.

## Stack

Plain static site — no build step, no dependencies.

- `index.html` — page structure
- `styles.css` — design system + responsive layout
- `script.js` — hero terminal animation, scroll reveals, nav, copy-to-clipboard
- `logo.svg` — Termato wordmark

## Run locally

Any static file server works:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` directly in a browser.

## Deploy

Drop the files on any static host (GitHub Pages, Netlify, Cloudflare Pages, S3,
etc.). There is nothing to build.
