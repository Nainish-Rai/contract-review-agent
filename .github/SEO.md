# SEO & Marketing — Contract Review Agent

This document records the SEO posture for the repo and the manual GitHub steps
that aren't reproducible from a single commit.

## Positioning (verbatim)

> **Template.** Fork it, customize it, and deploy your own contract review agent.
>
> Open-source Vercel Eve template for an AI contract review agent. Upload PDF
> or DOCX contracts and get a streamed risk review with visible tool calls,
> missing-clause detection, unusual-term flags, and negotiation points before
> signing.

Mirror copy of the homepage `metadata.title` and `metadata.description` lives in
[`lib/site.ts`](../lib/site.ts) — edit there when rebranding.

## Target keyword clusters

| Cluster | Pillar | Quick wins |
|---|---|---|
| Vercel Eve template | `eve framework template` | `vercel eve contract review`, `eve agent template`, `open source eve template` |
| AI contract review | `ai contract review open source` | `ai contract review`, `contract review agent`, `contract risk assessment ai` |
| Deploy / how-to | `deploy eve agent vercel` | `vercel contract review app`, `contract review app github` |
| File formats | `pdf contract review ai` | `docx contract analysis`, `contract review pdf docx` |
| Vertical / legaltech | `legaltech open source` | `ai legal agent template`, `legal ai agent` |

Full keyword brief: [`memory/research/keyword-research/2026-06-19-eve-contract-review.md`](../memory/research/keyword-research/2026-06-19-eve-contract-review.md).

## Where the SEO lives in this repo

| Surface | File | Purpose |
|---|---|---|
| Site name, tagline, description, keywords | [`lib/site.ts`](../lib/site.ts) | single source of truth |
| `<title>`, `<meta>`, OG, Twitter, robots, theme-color | [`app/layout.tsx`](../app/layout.tsx) | Next.js metadata API |
| JSON-LD (WebApplication, SoftwareSourceCode, FAQPage, Breadcrumb) | [`app/page.tsx`](../app/page.tsx) | structured data |
| Crawl directives | [`app/robots.ts`](../app/robots.ts) | disallow `/api/` and `/eve/` |
| Sitemap | [`app/sitemap.ts`](../app/sitemap.ts) | weekly, priority 1.0 |
| OG / banner / favicon | [`public/og.svg`](../public/og.svg), [`public/banner.svg`](../public/banner.svg), [`public/favicon.svg`](../public/favicon.svg) | social cards |
| Product screenshot | [`public/screens/contract-review-followup.png`](../public/screens/contract-review-followup.png) | README "See it in action" + JSON-LD `screenshot` field |
| GitHub repo metadata | [`package.json`](../package.json) | npm keywords, description |
| README hero | [`README.md`](../README.md) | H1, intro, deploy CTA |
| Domain language | [`CONTEXT.md`](../CONTEXT.md) | terminology |

## Manual GitHub steps

These cannot be set from a commit; the repo owner has to apply them in the
GitHub UI once.

### 1. About panel (top right of repo page)

- **Description**: `Open-source Vercel Eve template for an AI contract review agent. Upload PDF/DOCX contracts and stream a risk review before signing.`
- **Website**: production deploy URL (after first deploy)
- **Topics**: `vercel`, `eve`, `eve-framework`, `agent-template`, `ai-agents`, `ai-contract-review`, `contract-review`, `legaltech`, `legal-ai`, `nextjs`, `ai-sdk`, `open-source`

### 2. Social preview

GitHub uses `public/og.svg` when uploaded under *Settings → Social preview*.
Until then, the banner at the top of the README serves the same role on the
repo page.

### 3. Releases & visibility

- Tag `v1.0.0` once the first deploy succeeds.
- Enable *Releases* → *Latest* so the deploy badge links to the run.

## GEO (Generative Engine Optimization)

For AI citation, the README + docs pages must answer the high-volume question
shapes verbatim. See the GEO section of the keyword brief; current coverage:

| Question shape | Asset |
|---|---|
| "what is eve framework" | README intro paragraph |
| "how to build a contract review agent" | docs/EVE-WALKTHROUGH.md (TODO) |
| "best open source contract review tools 2026" | submit to awesome-* lists |

## Refresh cadence

- **Quarterly**: refresh keyword brief and re-rank clusters.
- **Per release**: bump `lastModified` in [`app/sitemap.ts`](../app/sitemap.ts).
- **Per change to positioning**: update `lib/site.ts`, `README.md`, and the GitHub
  About description together so the on-page, OG, and GitHub narratives stay in
  lockstep.
