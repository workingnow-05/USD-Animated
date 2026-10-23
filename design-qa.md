# USD Seat to San Diego — Design QA

## Source

- Reference: `screencapture-files-instinct-5uuni8zxx96r-your-seat-to-san-diego-2026-10-22-16_30_27.png`
- Prototype: local Vite preview on port 5174

## Checks

- Inter is used globally for page typography.
- Reference section order is represented: hero, why USD, six reasons, day-to-day photo strip, degree outcomes, alumni, people behind the program, Dean video callout, cost/visa FAQ, and final boarding-pass CTA.
- Desktop and narrow/mobile layouts use responsive grids and stacked sections.
- Name and program values persist through onboarding, flight state, landing page, and final boarding pass.
- GSAP flight transition renders a proper plane asset with cloud movement, runway reveal, curved route treatment, takeoff, banking, and arrival pulse.
- FAQ controls expose active states.
- Primary CTA and navigation anchors are functional.
- `prefers-reduced-motion` fallback is present.
- `npm run build` passes.

## Final result: passed

Remaining follow-up: replace Unsplash imagery and placeholder alumni/faculty copy with final USD-approved assets and exact production content when available.
