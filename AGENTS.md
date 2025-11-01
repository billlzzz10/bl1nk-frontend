# Repository Guidelines
This guide outlines how to contribute effectively to the bl1nk frontend while keeping the project stable.

## Project Structure & Module Organization
Code lives under `src/` with the Next.js App Router. Route handlers, layouts, and global styles sit in `src/app`, with feature areas such as `src/app/auth` and `src/app/workspace`. Shared UI primitives stay in `src/components`, stateful logic in `src/stores` (Zustand) and `src/hooks`, while HTTP integrations are isolated in `src/services`. Shared types belong in `src/types`; utilities live in `src/lib`. Co-locate assets with the modules that consume them instead of creating new catch-all folders.

## Build, Test, and Development Commands
- `npm install` - install dependencies when `package.json` changes.
- `npm run dev` - start the hot-reloading dev server at `http://localhost:3000`.
- `npm run lint` - run ESLint/Next checks; resolve findings before committing.
- `npm run build` - produce the production bundle used by CI and deployments.
- `npm run start` - serve the built bundle for local smoke tests.

## Coding Style & Naming Conventions
Write TypeScript function components and avoid `any`. Respect the prevailing two-space indentation and prefer single quotes in application code; let ESLint flag drift. Name components and hooks with `PascalCase` and `useCamelCase`, while shared utilities stay `camelCase`. Compose styles with Tailwind classes and reuse primitives from `src/components/ui` before adding new patterns. Import local code with the `@/` path alias to keep statements concise.

## Testing Guidelines
There is no automated suite yet, so document manual verification in each PR (routes exercised, API responses, UI screenshots). When adding tests, prefer React Testing Library for component coverage and Playwright for end-to-end flows that span auth and workspace paths. Mock network calls via helpers in `src/services/api.ts` to keep tests deterministic.

## Commit & Pull Request Guidelines
Use short, imperative commit subjects such as `Add workspace sidebar toggle`, and keep unrelated changes in separate commits. Confirm `npm run lint` and a local boot against an `.env.local` configured backend before pushing. Pull requests should include a summary, linked issue or task, UI snapshots for visual updates, and manual QA notes. Request review once rebased on the latest `main`.

## Security & Configuration Tips
Never commit secrets; derive `.env.local` from `.env.local.example`. Update `NEXT_PUBLIC_API_URL` and related variables per environment and call out new settings in your PR. Vet new dependencies for browser safety and ensure authentication changes stay aligned with the token handling in `src/services/api.ts`.
