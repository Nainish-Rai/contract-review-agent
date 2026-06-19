import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
	const siteUrl = getSiteUrl();

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/eve/"],
			},
			{
				userAgent: [
					"GPTBot",
					"ClaudeBot",
					"Claude-Web",
					"PerplexityBot",
					"Google-Extended",
					"Applebot-Extended",
					"cohere-ai",
				],
				allow: "/",
				disallow: ["/api/", "/eve/"],
			},
		],
		sitemap: new URL("/sitemap.xml", siteUrl).toString(),
		host: siteUrl.toString(),
	};
}
