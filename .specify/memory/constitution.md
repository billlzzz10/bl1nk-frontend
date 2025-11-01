# bl1nk Frontend Constitution

## Core Principles

### I. Quality-Driven Delivery
Every change must leave the codebase cleaner than it was found. Refactor opportunistically, delete dead code, and prefer clarity over cleverness so that future contributors can reason about the system quickly.

### II. Testable by Design
Features ship with a validation story. Prioritize automated coverage (unit, integration, or Playwright) and, when automation is not yet practical, record reproducible manual steps. Tests describe intent, isolate external services, and gate regressions.

### III. Consistent User Experience
UI changes uphold the established UX language—Tailwind scales, component variants, spacing rhythm, and accessibility best practices. New interactions feel native to the workspace, operate smoothly across viewports, and surface helpful feedback on latency or failure.

### IV. Performance Awareness
Code paths that touch rendering, network requests, or state updates must be profiled or reasoned about for responsiveness. Aim for sub-100 ms perceived interactions, avoid unnecessary rerenders, and prefer streaming or pagination when moving large payloads.

### V. Observability & Transparency
Errors, edge cases, and API contracts are exposed through consistent logging, error boundaries, and actionable UX messaging. When integrating with the backend, document assumptions and surface failure modes to users and operators alike.

## Delivery Standards
- Story work starts with an acceptance checklist that includes UX, quality, and performance expectations.
- Environment variables and configuration toggles are documented before merges; new secrets never leave local files.
- Accessibility is non-negotiable: keyboard navigation, ARIA attributes, and color contrast are validated on every UI change.

## Workflow & Review
- Pull requests must highlight testing evidence (screenshots, recordings, console output) and benchmark notes when performance is touched.
- Code reviews focus on correctness, resilience, and user impact. Reviewers block on missing tests, inconsistent UX, or observable regressions.
- Main remains deployable; feature branches rebase frequently, and hot fixes include postmortem notes in follow-up tasks.

## Governance
This constitution supersedes conflicting informal practices. Amendments require team consensus, updated documentation, and a version bump recorded here.

**Version**: 1.0.0 | **Ratified**: 2025-10-21 | **Last Amended**: 2025-10-21
