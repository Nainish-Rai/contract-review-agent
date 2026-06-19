import { z } from "zod";

export const severitySchema = z.enum(["critical", "high", "medium", "low"]);

export const clauseTypeSchema = z.enum([
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

export const riskSchema = z.object({
  title: z.string(),
  severity: severitySchema,
  category: z.string(),
  explanation: z.string(),
  clauseReference: z.string().optional(),
  dimensions: z.object({
    classification: z.string(),
    exposure: z.string(),
    likelihood: z.string(),
    avoidability: z.string(),
    businessTradeoff: z.string(),
    urgency: z.string(),
  }),
  revisionMethod: z.enum(["direct_change", "comment"]),
  negotiationPoint: z.string(),
});

export const clauseSchema = z.object({
  type: clauseTypeSchema,
  title: z.string(),
  summary: z.string(),
  excerpt: z.string(),
  status: z.enum(["found", "missing", "unclear"]),
});

export const reviewReportSchema = z.object({
  fileName: z.string(),
  fileType: z.enum(["pdf", "docx", "text"]),
  methodology: z.object({
    name: z.literal("contract-review-pro-adapted"),
    reviewState: z.array(z.string()),
    gates: z.array(z.string()),
  }),
  summary: z.array(z.string()),
  overallRiskScore: z.number().int().min(0).max(100),
  risks: z.array(riskSchema),
  clauses: z.array(clauseSchema),
  missingOrUnclearClauses: z.array(z.string()),
  negotiationSuggestions: z.array(z.string()),
  extractedTextLength: z.number().int().min(0),
});

export type ClauseType = z.infer<typeof clauseTypeSchema>;
export type ReviewReport = z.infer<typeof reviewReportSchema>;
export type Severity = z.infer<typeof severitySchema>;
