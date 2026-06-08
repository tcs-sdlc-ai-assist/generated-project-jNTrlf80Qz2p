# Contributing

Thanks for opening a PR.

## Setup

```bash
npm install
npm run dev
```

## Before submitting

- [ ] `npm run build` passes locally
- [ ] `npm run lint` passes (or no new warnings)
- [ ] No new console errors in the browser
- [ ] Manual smoke test of affected pages
- [ ] Updated `README.md` if behaviour changed

## Style

- Follow the conventions in `.nexus/design.md` (auto-generated house style).
- Use named imports for utilities; default exports for page components.
- Keep page files free of `<Navbar/>`/`<Footer/>` — layout owns chrome.

## Commits

Conventional commits preferred: `feat(scope):`, `fix(scope):`,
`refactor(scope):`, `docs:`, `chore:`.
