import { defineTool } from "eve/tools";
import { z } from "zod";

const severitySchema = z.enum(["critical", "high", "medium", "low"]);
const categorySchema = z.enum([
  "Validity/compliance",
  "Transaction/performance",
  "Data/privacy/security",
  "Liability/indemnity",
  "Termination/renewal",
  "Dispute/text consistency",
  "Price/payment",
  "Delivery/acceptance",
  "IP/confidentiality",
  "Subject/authority",
  "Collateral/guarantee",
]);

export default defineTool({
  description:
    "Classify a contract issue across the six contract-review-pro risk dimensions before presenting it to the user.",
  inputSchema: z.object({
    issue: z.string().min(1).describe("The contract issue or clause concern to classify."),
    severity: severitySchema,
    category: categorySchema.optional(),
  }),
  outputSchema: z.object({
    category: categorySchema,
    dimensions: z.object({
      classification: z.string(),
      exposure: z.string(),
      likelihood: z.string(),
      avoidability: z.string(),
      businessTradeoff: z.string(),
      urgency: z.string(),
    }),
  }),
  execute({ issue, severity, category }) {
    const resolvedCategory = category ?? classify(issue);

    return {
      category: resolvedCategory,
      dimensions: {
        classification: resolvedCategory,
        exposure: issue,
        likelihood: severity === "critical" ? "high" : severity === "high" ? "medium-high" : "medium",
        avoidability: resolvedCategory === "Validity/compliance" ? "structural fix needed" : "negotiable by clause change",
        businessTradeoff: "Weigh deal value, leverage, alternatives, timing, switching cost, and whether the risk can be priced or insured.",
        urgency: severity === "critical" ? "immediate" : severity === "high" ? "near-term" : "monitor",
      },
    };
  },
});

function classify(issue: string): z.infer<typeof categorySchema> {
  const text = issue.toLowerCase();

  if (hasAny(text, ["privacy", "security", "data", "gdpr", "ccpa", "soc 2"])) return "Data/privacy/security";
  if (hasAny(text, ["liability", "indemn", "hold harmless", "cap"])) return "Liability/indemnity";
  if (hasAny(text, ["renew", "termination", "cancel", "notice"])) return "Termination/renewal";
  if (hasAny(text, ["payment", "price", "fee", "rent", "salary", "invoice", "tax"])) return "Price/payment";
  if (hasAny(text, ["deliver", "acceptance", "inspection", "milestone", "completion"])) return "Delivery/acceptance";
  if (hasAny(text, ["ip", "intellectual property", "confidential", "copyright", "patent", "license"])) return "IP/confidentiality";
  if (hasAny(text, ["party", "authority", "signature", "approval", "capacity"])) return "Subject/authority";
  if (hasAny(text, ["guarantee", "collateral", "security interest", "pledge", "mortgage"])) return "Collateral/guarantee";
  if (hasAny(text, ["governing law", "venue", "jurisdiction", "conflict", "inconsistent"])) return "Dispute/text consistency";
  if (hasAny(text, ["illegal", "authority", "invalid", "unenforceable", "compliance"])) return "Validity/compliance";
  return "Transaction/performance";
}

function hasAny(text: string, terms: readonly string[]): boolean {
  return terms.some((term) => text.includes(term));
}
