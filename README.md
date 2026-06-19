# Contract Review Agent

[![License: MIT](https://img.shields.io/github/license/Nainish-Rai/contract-review-agent?color=black)](https://github.com/Nainish-Rai/contract-review-agent/blob/main/LICENSE)
[![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)

**Template.** Fork it, customize it, and deploy your own contract review agent.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNainish-Rai%2Fcontract-review-agent&env=ANTHROPIC_API_KEY&envDescription=ANTHROPIC_API_KEY%3A%20Anthropic-compatible%20model%20credential%20used%20by%20the%20Eve%20agent&project-name=contract-review-agent&repository-name=contract-review-agent)

---

Open-source contract review agent template. PDF and DOCX uploads, real text extraction, visible Eve tool calls, streamed reasoning, and practical risk reports.

## Features

### Contract Uploads

Upload PDF or DOCX contracts from the web app. Files are parsed per request and are not persisted by the template.

### Streaming Agent Review

The Eve agent streams its review with visible tool calls, so users can see the methodology instead of getting a static black-box report.

### Risk Report

Each review focuses on plain-English summary, business risks, missing or unclear clauses, unusual terms, and suggested negotiation points.

### General Contract Methodology

The agent uses validity-first gates, clause coverage checks, consistency review, six risk dimensions, and revision routing adapted from Contract Review Pro.

### Follow-up Chat

After the first review, users can keep chatting with the same Eve session from a floating prompt input.

## Architecture

```text
PDF / DOCX upload
        │
        ▼
Next.js upload API
        │
        ▼
PDF / DOCX parser
        │
        ▼
Eve agent session
        │
        ▼
Contract review tools + methodology skill
        │
        ▼
Streaming risk report
```

On Vercel, `vercel.json` defines two services: `web` for the Next.js app and `eve` for the Eve agent runtime.

## Quick Start

**Requirements:** Node.js 24+, npm

```bash
git clone https://github.com/Nainish-Rai/contract-review-agent.git
cd contract-review-agent

npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Next.js and upload a `.pdf` or `.docx` contract.

**Required environment variables:**

```bash
ANTHROPIC_API_KEY=...
```

Optional:

```bash
ANTHROPIC_MODEL=claude-sonnet-4.6
```

## Customization

- Change `agent/instructions.md` to adjust the agent identity and guardrails.
- Edit `agent/skills/contract-review-methodology.md` to tune the review workflow.
- Add or change tools in `agent/tools/` for new review checks.
- Update `lib/contract-review/review.ts` for deterministic risk rules.
- Adjust `app/_components/contract-review-app.tsx` for the upload and review UI.

## Development

```bash
npm run dev        # Start Next.js with Eve
npm run typecheck  # TypeScript check
npm run build      # Production build
```

See [AGENTS.md](./AGENTS.md) for notes aimed at AI coding assistants.

## Built With

- [Eve](https://eve.dev) — Durable agent framework
- [Next.js](https://nextjs.org) — React framework
- [AI SDK Elements](https://elements.ai-sdk.dev) — Agent UI primitives
- [shadcn/ui](https://ui.shadcn.com) — UI component patterns
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) — PDF text extraction
- [Mammoth](https://www.npmjs.com/package/mammoth) — DOCX text extraction
- [Vercel](https://vercel.com) — Deployment

## Legal Disclaimer

This template surfaces practical contract-review issues. It is not legal advice and should not be treated as a signing recommendation.

## License

[MIT](./LICENSE)
