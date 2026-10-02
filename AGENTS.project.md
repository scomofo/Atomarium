# Project priorities

This file overrides legacy Grok template guidance and linked generic references
where they conflict with the user's instructions.

- Target desktop. Mobile features, redesigns, and mobile QA are not required
  unless explicitly requested. Preserve existing responsive behavior.
- There is no required port 8080 or 8081. Development defaults to 5173 and
  built preview to 4173, with automatic fallback to an available port.
- Configure development with `DEV_PORT` or `PORT`, preview with `PREVIEW_PORT`
  or `PORT`, or use `npm run dev -- --port 5300` / `npm run preview -- --port 5301`.
- Use the actual URL reported by Vite for QA. Pass it to browser smoke and auth
  checks, or set `DEV_URL`. The preview helper saves `.grok/preview.url`.
- Start through the existing npm environment wrapper. Startup and preview
  helpers must identify this repository's own processes; never kill another app
  or assume a port responding means this app is running.
