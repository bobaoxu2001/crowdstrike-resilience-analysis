# AGENTS.md

## Cursor Cloud specific instructions

This repository is a single static, self-contained web page: `index.html`. It has
no backend, package manager, build step, automated tests, or linter. All CSS is
inline in the `<head>`; there is no JavaScript and no external/CDN assets.

### Running the site (dev)

Serve the file with any static HTTP server from the repo root, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`. The page also renders standalone via
`file:///workspace/index.html` (no server strictly required).

### Notes

- There is nothing to install; the update script is intentionally a no-op.
- There are no lint/test/build commands. "Testing" means rendering `index.html`
  and verifying the content/in-page anchor navigation (`#intro`, `#bia`,
  `#rootcause`, `#risk`, `#cap`, `#erm`, `#analysis`, `#why`).
