import { defineTool } from "eve/tools";
import { z } from "zod";

import { reviewContract } from "../../lib/contract-review/review.js";
import { reviewReportSchema } from "../../lib/contract-review/schema.js";

export default defineTool({
  description: "Review pasted contract text and return a structured general contract risk report.",
  inputSchema: z.object({
    contractText: z.string().min(200).describe("Extracted or pasted contract text."),
    fileName: z.string().default("pasted-contract.txt"),
  }),
  outputSchema: reviewReportSchema,
  execute({ contractText, fileName }) {
    return reviewContract({ fileName, fileType: "text", text: contractText });
  },
  toModelOutput(report) {
    return {
      type: "json",
      value: {
        summary: report.summary,
        overallRiskScore: report.overallRiskScore,
        risks: report.risks.map((riskItem) => ({
          title: riskItem.title,
          severity: riskItem.severity,
          negotiationPoint: riskItem.negotiationPoint,
        })),
        missingOrUnclearClauses: report.missingOrUnclearClauses,
        negotiationSuggestions: report.negotiationSuggestions,
      },
    };
  },
});
