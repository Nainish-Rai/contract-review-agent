import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
	getSiteUrl,
	siteDescription,
	siteKeywords,
	siteName,
	siteShortDescription,
	siteTagline,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import "./globals.css";

const sans = Geist({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: "variable",
	display: "swap",
});

const mono = Geist_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: "variable",
	display: "swap",
});

const siteUrl = getSiteUrl();
const ogImageUrl = new URL("/og.svg", siteUrl);

export const metadata: Metadata = {
	metadataBase: siteUrl,
	title: {
		default: `${siteName} — ${siteTagline}`,
		template: `%s | ${siteName}`,
	},
	description: siteDescription,
	applicationName: siteName,
	authors: [{ name: "Nainish Rai", url: "https://github.com/Nainish-Rai" }],
	creator: "Nainish Rai",
	publisher: "Nainish Rai",
	generator: "Next.js",
	category: "Legal Technology",
	keywords: [...siteKeywords],
	referrer: "origin-when-cross-origin",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: `${siteName} — ${siteTagline}`,
		description: siteShortDescription,
		url: "/",
		siteName,
		locale: "en_US",
		type: "website",
		images: [
			{
				url: ogImageUrl.toString(),
				width: 1200,
				height: 630,
				alt: `${siteName} — ${siteTagline}`,
				type: "image/svg+xml",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${siteName} — ${siteTagline}`,
		description: siteShortDescription,
		creator: "@nainishrai",
		images: [
			{
				url: ogImageUrl.toString(),
				alt: `${siteName} — ${siteTagline}`,
			},
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
	icons: {
		icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
	},
	other: {
		"application-name": siteName,
		"apple-mobile-web-app-title": siteName,
		"theme-color": "#000000",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	themeColor: "#000000",
	colorScheme: "light dark",
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
	return (
		<html className={cn(sans.variable, mono.variable)} lang="en">
			<body className="min-h-dvh antialiased">
				<TooltipProvider>{children}</TooltipProvider>
			</body>
		</html>
	);
}
