import { defineTool } from "eve/tools";
import { z } from "zod";

const clauseTypeSchema = z.enum([
  "auto_renewal",
  "attachments_consistency",
  "breach_remedies",
  "collateral_guarantee",
  "confidentiality",
  "compliance",
  "contract_subject",
  "data_ownership",
  "data_privacy",
  "delivery_acceptance",
  "dispute_resolution",
  "employment_terms",
  "force_majeure",
  "governing_law",
  "indemnity",
  "ip_ownership",
  "liability",
  "notices",
  "parties_authority",
  "payment",
  "price_payment",
  "property_rights",
  "security",
  "signatures",
  "sla",
  "termination",
  "unilateral_changes",
  "warranties",
]);
const axisSchema = z.object({
  score: z.number().int().min(0).max(2),
  finding: z.string(),
});

export default defineTool({
  description:
    "Review one contract clause using the contract-review-pro positive, negative, and remedy/enforcement methodology.",
  inputSchema: z.object({
    clauseType: clauseTypeSchema,
    clauseText: z.string().min(1),
  }),
  outputSchema: z.object({
    clauseType: clauseTypeSchema,
    positive: axisSchema,
    negative: axisSchema,
    remedyEnforcement: axisSchema,
    overallScore: z.number().int().min(0).max(6),
    level: z.enum(["thin", "workable", "strong"]),
  }),
  execute({ clauseType, clauseText }) {
    const text = clauseText.toLowerCase();
    const positive = scoreAxis(text, {
      strong: ["shall", "must", "will", "right to", "obligation", "standard", "service level", "owns", "responsible for"],
      partial: ["may", "reasonable", "commercially reasonable", "policy"],
      strongFinding: "Clause states concrete rights, obligations, or standards.",
      partialFinding: "Clause gives some direction but may leave discretion or vague standards.",
      weakFinding: "Clause does not clearly state the core right, obligation, or standard.",
    });
    const negative = scoreAxis(text, {
      strong: ["except", "excluding", "sole discretion", "unilateral", "without liability", "non-refundable", "auto-renew", "waives"],
      partial: ["limitation", "subject to", "unless", "provided that"],
      strongFinding: "Clause contains meaningful carve-outs, burdens, or vendor-favorable limits to review.",
      partialFinding: "Clause has qualifiers that may matter commercially.",
      weakFinding: "No obvious carve-out or negative burden was detected in this excerpt.",
    });
    const remedyEnforcement = scoreAxis(text, {
      strong: ["remedy", "refund", "credit", "terminate", "injunction", "indemnify", "cure", "delete", "return"],
      partial: ["notice", "breach", "liability", "damages", "support"],
      strongFinding: "Clause includes an enforcement path or concrete remedy.",
      partialFinding: "Clause references breach or notice but the remedy may need clarification.",
      weakFinding: "Clause does not clearly say what happens if the obligation is breached.",
    });
    const overallScore = positive.score + negative.score + remedyEnforcement.score;

    return {
      clauseType,
      positive,
      negative,
      remedyEnforcement,
      overallScore,
      level: overallScore >= 5 ? "strong" : overallScore >= 3 ? "workable" : "thin",
    };
  },
});

function scoreAxis(
  text: string,
  config: {
    readonly strong: readonly string[];
    readonly partial: readonly string[];
    readonly strongFinding: string;
    readonly partialFinding: string;
    readonly weakFinding: string;
  },
): z.infer<typeof axisSchema> {
  if (hasAny(text, config.strong)) return { score: 2, finding: config.strongFinding };
  if (hasAny(text, config.partial)) return { score: 1, finding: config.partialFinding };
  return { score: 0, finding: config.weakFinding };
}

function hasAny(text: string, terms: readonly string[]): boolean {
  return terms.some((term) => text.includes(term));
}
