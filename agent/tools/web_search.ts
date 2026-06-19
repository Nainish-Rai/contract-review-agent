import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Search the web for current information and return a few result links.",
  inputSchema: z.object({
    query: z.string().min(1),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
      }),
    ),
  }),
  async execute({ query }) {
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
    const html = await response.text();
    const results = [...html.matchAll(/<a rel="nofollow" class="result__a" href="([^"]+)">([\s\S]*?)<\/a>/g)]
      .slice(0, 5)
      .map((match) => ({
        title: stripTags(match[2] ?? ""),
        url: decodeDuckDuckGoUrl(match[1] ?? ""),
      }));

    return { results };
  },
});

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();
}

function decodeDuckDuckGoUrl(value: string): string {
  const url = value.replace(/&amp;/g, "&");
  return URL.canParse(url) ? new URL(url).searchParams.get("uddg") ?? url : url;
}
