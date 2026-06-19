# Contract Review Agent

This project uses the eve framework. Before writing code, always read the relevant guide in `node_modules/eve/docs/`.

## Project layout

- `agent/` — Eve agent (instructions, skills, tools)
- `app/` — Next.js web app + `app/api/` upload route
- `lib/` — site config (`lib/site.ts`), contract review logic, utils
- `public/` — banner, OG image, favicon
- `docs/` — SEO posture, architecture notes
- `memory/research/` — saved keyword research briefs

## Single source of truth for branding & SEO

When you change the repo's positioning, update **all** of these in one PR:

1. [`lib/site.ts`](./lib/site.ts) — `siteName`, `siteTagline`, `siteDescription`, `siteKeywords`
2. [`app/layout.tsx`](./app/layout.tsx) — `metadata` (title, OG, Twitter, robots)
3. [`app/page.tsx`](./app/page.tsx) — JSON-LD blocks (WebApplication, FAQ)
4. [`README.md`](./README.md) — H1, intro paragraph, deploy CTA
5. [`package.json`](./package.json) — `description`, `keywords`
6. [`docs/SEO.md`](./docs/SEO.md) — manual GitHub steps
7. GitHub repo *About* panel — description, topics, website

## SEO skills

The repo bundles the aaron-he-zhu/seo-geo-claude-skills at `.agents/skills/aaron-seo-geo/`.
Use them in this order when shipping a new feature or refresh:

1. `keyword-research` — update the brief in `memory/research/keyword-research/`
2. `meta-tags-optimizer` — update `app/layout.tsx` titles + descriptions
3. `schema-markup-generator` — extend `app/page.tsx` JSON-LD
4. `seo-content-writer` — draft README/docs prose
5. `on-page-seo-auditor` + `technical-seo-checker` — audit pass before PR
