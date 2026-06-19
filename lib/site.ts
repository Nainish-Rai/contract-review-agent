export const siteName = "Contract Review Agent";
export const siteTagline = "Vercel Eve template for AI contract review";

export const siteDescription =
	"Open-source Vercel Eve template for an AI contract review agent. Upload PDF or DOCX contracts and get a streamed risk review with visible tool calls, missing-clause detection, unusual-term flags, and negotiation points before signing. Built with Eve, Next.js, and AI SDK Elements.";

export const siteShortDescription =
	"AI contract review agent template on Vercel Eve. Streamed risk reports from PDF and DOCX uploads.";

export const siteKeywords: readonly string[] = [
	// Pillar: Vercel Eve template cluster
	"vercel eve template",
	"eve framework template",
	"vercel eve contract review",
	"eve agent template",
	"open source eve template",
	"vercel eve github",
	// Pillar: AI contract review cluster
	"ai contract review",
	"ai contract analysis",
	"contract review agent",
	"contract review ai agent",
	"ai contract review open source",
	"open source contract review",
	"contract risk assessment ai",
	"contract review tool",
	// Pillar: deploy / how-to cluster
	"deploy eve agent vercel",
	"vercel contract review app",
	"contract review app github",
	// Pillar: file-format cluster
	"pdf contract review ai",
	"docx contract analysis",
	"contract review pdf docx",
	// Pillar: legaltech / vertical
	"legaltech open source",
	"ai legal agent template",
	"legal ai agent",
	"contract automation",
	// Stack
	"nextjs",
	"vercel",
	"eve framework",
	"ai sdk",
	"ai agents",
];

export function getSiteUrl(): URL {
	const configuredUrl =
		process.env.NEXT_PUBLIC_SITE_URL ??
		process.env.VERCEL_PROJECT_PRODUCTION_URL ??
		process.env.VERCEL_URL ??
		"http://localhost:3000";
	const url = configuredUrl.startsWith("http")
		? configuredUrl
		: `https://${configuredUrl}`;

	return new URL(url);
}
