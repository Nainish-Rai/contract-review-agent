import { anthropic } from "@ai-sdk/anthropic";
import { defineAgent } from "eve";

export default defineAgent({
  model: anthropic(process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4.6"),
  modelContextWindowTokens: 1_000_000,
});
