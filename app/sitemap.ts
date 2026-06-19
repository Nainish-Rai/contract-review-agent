import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = getSiteUrl();
	const lastModified = new Date();

	return [
		{
			url: siteUrl.toString(),
			lastModified,
			changeFrequency: "weekly",
			priority: 1.0,
		},
		{
			url: new URL("/#app", siteUrl).toString(),
			lastModified,
			changeFrequency: "weekly",
			priority: 0.9,
		},
	];
}
