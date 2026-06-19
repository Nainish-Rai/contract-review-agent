import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Decide whether a contract issue should be handled as a direct change or as a comment, following contract-review-pro revision routing.",
  inputSchema: z.object({
    issueSummary: z.string().min(1),
    directChangePossible: z.boolean().default(false),
    businessJudgmentNeeded: z.boolean().default(true),
    likelyAccepted: z.boolean().default(false),
    multipleOptions: z.boolean().default(false),
    factsNeedVerification: z.boolean().default(false),
  }),
  outputSchema: z.object({
    revisionMethod: z.enum(["direct_change", "comment"]),
    reason: z.string(),
    selfCheck: z.array(z.string()),
  }),
  execute(input) {
    const shouldComment =
      input.businessJudgmentNeeded || input.multipleOptions || input.factsNeedVerification || !input.likelyAccepted;

    if (input.directChangePossible && !shouldComment) {
      return {
        revisionMethod: "direct_change" as const,
        reason: "Objective, low-dispute correction with a likely acceptable replacement.",
        selfCheck: [
          "Can the issue be fixed with clear wording?",
          "Is the change low-dispute and not mainly commercial judgment?",
          "Would the counterparty likely accept it without extra context?",
        ],
      };
    }

    return {
      revisionMethod: "comment" as const,
      reason:
        "Use a comment because the issue requires business judgment, factual verification, multiple options, or negotiation context.",
      selfCheck: [
        "Explain why the issue matters.",
        "Name the business tradeoff.",
        "Give a practical negotiation ask.",
      ],
    };
  },
});
