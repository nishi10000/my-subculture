# Subculture Timeline Memo

## Goal
- Build a public GitHub Pages site that archives subculture memories
- Timeline style with release dates (day-level granularity)
- Mobile-friendly vertical flow, oldest first
- Simple, modern, database-like aesthetic
- Images displayed inline without lightbox

## Spec (confirmed)
- Date granularity: YYYY-MM-DD
- Order: oldest to newest
- Entry fields: date / tag / title / memory / image (optional) / link (optional)
- Layout: vertical timeline, date on left, card on right
- Visibility: public
- Images: use `image` when available; if omitted and `link` is an Amazon URL, the app auto-renders the Amazon cover image.

## Current Implementation
- Repo: https://github.com/nishi10000/my-subculture
- Pages URL: https://nishi10000.github.io/my-subculture/
- Files:
  - index.html (template)
  - styles.css (timeline UI)
  - script.js (loads data.json + renders)
  - data.json (sample entries)
- Sample data:
  - 1999-02-12 / Super Smash Bros. / Game
  - 2004-11-18 / Sonic Adventure 2 Soundtrack / Music
  - 2016-07-15 / July Release Playlist / Playlist

## Next SOW candidates
1) Replace data.json with real entries
2) Add images/ and update image paths
3) Adjust tags, spacing, typography
4) Optional year separators or filters
5) Fix mobile width overflow (still broken on small screens)
