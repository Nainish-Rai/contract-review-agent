import { defineTool } from "eve/tools";
import { z } from "zod";

const reviewDepthSchema = z.enum(["quick", "standard", "deep"]);

const gates = ["validity", "subject/authority", "clause coverage", "consistency", "output"] as const;

const focus = [
  "parties and authority",
  "subject matter",
  "price and payment",
  "delivery and acceptance",
  "breach and remedies",
  "termination",
  "liability",
  "indemnity",
  "confidentiality",
  "intellectual property",
  "compliance",
  "notices",
  "dispute resolution",
  "governing law and venue",
  "attachments and signatures",
] as const;

export default defineTool({
  description:
    "Build the contract review state before analyzing a contract. Mirrors the contract-review-pro session setup methodology.",
  inputSchema: z.object({
    contractText: z.string().min(1).describe("Extracted or pasted contract text."),
    fileName: z.string().default("contract.txt"),
    reviewDepth: reviewDepthSchema.default("standard"),
    representedSide: z.string().optional().describe("The side the user cares about, if known."),
  }),
  outputSchema: z.object({
    fileName: z.string(),
    reviewDepth: reviewDepthSchema,
    textLength: z.number().int().min(0),
    clientProfile: z.string(),
    gates: z.array(z.string()),
    focus: z.array(z.string()),
    riskLevels: z.array(z.string()),
    riskDimensions: z.array(z.string()),
  }),
  execute({ contractText, fileName, representedSide, reviewDepth }) {
    return {
      fileName,
      reviewDepth,
      textLength: contractText.length,
      clientProfile: representedSide
        ? `User is reviewing from the perspective of: ${representedSide}.`
        : "User wants a practical pre-signature contract risk review.",
      gates: [...gates],
      focus: [...focus],
      riskLevels: ["critical", "high", "medium", "low"],
      riskDimensions: ["classification", "exposure", "likelihood", "avoidability", "business tradeoff", "urgency"],
    };
  },
});
