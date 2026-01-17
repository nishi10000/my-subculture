# AGENTS.md

## Project overview
- Static GitHub Pages site for a subculture timeline.
- Timeline entries are rendered client-side from `data.json`.
- Layout: vertical timeline with date on the left and a card on the right.

## Key files
- `index.html`: page shell and template for entries.
- `styles.css`: timeline styling, CSS variables, responsive tweaks.
- `script.js`: fetches `data.json`, formats dates, and injects entries.
- `data.json`: array of entries (oldest to newest).
- `images/`: local assets referenced by `data.json`.

## Data format
Each entry in `data.json` uses:
- `date`: `YYYY-MM-DD` (used for display; keep valid dates).
- `title`: string.
- `tag`: string (optional; defaults to "Memory").
- `memory`: string.
- `image`: relative path (optional), e.g. `images/example.jpg`.

## Expected behavior
- Entries appear in the order listed in `data.json` (oldest first).
- If `image` is present, an inline `img` is rendered in the card.
- If `data.json` fails to load, an error message appears in the timeline.

## Local workflow
- No build tooling; open `index.html` directly or via a static server.
- For new images, add files under `images/` and reference with a relative path.

## Style notes
- Color palette and spacing live in CSS variables in `styles.css`.
- Keep the vertical timeline layout (date column + card column).
