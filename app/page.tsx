import { ContractReviewApp } from "@/app/_components/contract-review-app";
import {
	getSiteUrl,
	siteDescription,
	siteKeywords,
	siteName,
	siteShortDescription,
	siteTagline,
} from "@/lib/site";

export default function Page() {
	const siteUrl = getSiteUrl();
	const ogImageUrl = new URL("/og.svg", siteUrl).toString();
	const repoUrl = "https://github.com/Nainish-Rai/contract-review-agent";

	const webAppJsonLd = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"@id": new URL("/#app", siteUrl).toString(),
		name: siteName,
		url: siteUrl.toString(),
		description: siteDescription,
		applicationCategory: "BusinessApplication",
		applicationSubCategory: "Contract Review Software",
		operatingSystem: "Web",
		browserRequirements: "Requires JavaScript. Requires HTML5.",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		featureList: [
			"PDF contract text extraction",
			"DOCX contract text extraction",
			"Streaming AI risk review with visible tool calls",
			"Missing clause identification",
			"Unusual term detection",
			"Negotiation point suggestions",
			"Follow-up chat on the same Eve session",
			"Deploy to Vercel with one click",
		],
		image: [
			ogImageUrl,
			new URL("/screens/contract-review-followup.png", siteUrl).toString(),
		],
		screenshot: new URL(
			"/screens/contract-review-followup.png",
			siteUrl,
		).toString(),
		keywords: siteKeywords.join(", "),
		creator: {
			"@type": "Person",
			name: "Nainish Rai",
			url: "https://github.com/Nainish-Rai",
		},
		publisher: {
			"@type": "Organization",
			name: "Nainish Rai",
			url: "https://github.com/Nainish-Rai",
		},
		softwareRequirements: "Node.js 24+, npm 11+, ANTHROPIC_API_KEY",
		downloadUrl: `${repoUrl}/archive/refs/heads/main.zip`,
		softwareVersion: "1.0.0",
	};

	const softwareSourceCodeJsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareSourceCode",
		"@id": new URL("/#source", siteUrl).toString(),
		name: siteName,
		description: siteShortDescription,
		codeRepository: repoUrl,
		codeSampleType: "full",
		programmingLanguage: ["TypeScript", "JavaScript", "Markdown"],
		runtimePlatform: ["Next.js", "Vercel Eve", "Node.js"],
		license: "https://opensource.org/licenses/MIT",
		author: {
			"@type": "Person",
			name: "Nainish Rai",
			url: "https://github.com/Nainish-Rai",
		},
		keywords: siteKeywords.join(", "),
	};

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: siteUrl.toString(),
			},
			{
				"@type": "ListItem",
				position: 2,
				name: siteName,
				item: new URL("/#app", siteUrl).toString(),
			},
		],
	};

	const faqJsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: `What is ${siteName}?`,
				acceptedAnswer: {
					"@type": "Answer",
					text: `${siteName} is an open-source Vercel Eve template for an AI contract review agent. Upload a PDF or DOCX contract and the Eve agent streams a tool-call review covering plain-English summary, business risks, missing or unusual clauses, and suggested negotiation points.`,
				},
			},
			{
				"@type": "Question",
				name: "How do I deploy it?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Click the Deploy with Vercel button in the README, set the ANTHROPIC_API_KEY environment variable, and Vercel builds and runs both the Next.js web app and the Eve agent runtime from the same repository.",
				},
			},
			{
				"@type": "Question",
				name: "Is this legal advice?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "No. The template surfaces practical contract-review issues. It is not legal advice and should not be treated as a signing recommendation.",
				},
			},
			{
				"@type": "Question",
				name: "What contract types does it support?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Sales, lease, loan, construction, services, employment, equity, guarantee/security, technology/IP, NDA, MSA, vendor, and general agreements.",
				},
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(webAppJsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(softwareSourceCodeJsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			<span className="sr-only" aria-label={siteTagline}>
				{siteName} — {siteTagline}. {siteShortDescription}
			</span>
			<ContractReviewApp />
		</>
	);
}
