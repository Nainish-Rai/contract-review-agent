import type { ClauseType, ReviewReport, Severity } from "./schema.js";

type Gate = {
  readonly type: ClauseType;
  readonly title: string;
  readonly patterns: readonly RegExp[];
  readonly missingSummary: string;
};

type RiskRule = {
  readonly title: string;
  readonly severity: Severity;
  readonly category: string;
  readonly patterns: readonly RegExp[];
  readonly explanation: string;
  readonly negotiationPoint: string;
};

const REVIEW_GATES = [
  "validity",
  "subject/authority",
  "clause coverage",
  "consistency",
  "output",
] as const;

const COMMON_GATES = [
  gate("parties_authority", "Parties and authority", [/between\b/i, /party|parties/i, /authorized/i, /signatory/i, /representative/i], "Parties, authority, or signing capacity are not clearly stated."),
  gate("contract_subject", "Subject matter", [/scope/i, /goods/i, /services/i, /work/i, /property/i, /deliverables?/i, /subject matter/i], "The contract subject or scope is not clearly described."),
  gate("price_payment", "Price and payment", [/payment/i, /fee/i, /price/i, /rent/i, /salary/i, /compensation/i, /invoice/i], "Price, fees, or payment mechanics are missing or unclear."),
  gate("delivery_acceptance", "Delivery and acceptance", [/deliver/i, /acceptance/i, /inspection/i, /handover/i, /completion/i, /milestone/i], "Delivery, completion, or acceptance mechanics are missing or unclear."),
  gate("breach_remedies", "Breach and remedies", [/breach/i, /default/i, /damages/i, /penalt/i, /liquidated/i, /remed/i], "Breach events and remedies are not clearly stated."),
  gate("termination", "Termination", [/terminat/i, /expire/i, /cancel/i, /rescind/i], "Termination rights and exit mechanics are missing or unclear."),
  gate("liability", "Liability", [/liability/i, /limitation of liability/i, /damages/i, /cap/i], "Liability allocation or caps are missing or unclear."),
  gate("warranties", "Representations and warranties", [/represent/i, /warrant/i, /covenant/i], "Representations, warranties, or core promises are missing or thin."),
  gate("confidentiality", "Confidentiality", [/confidential/i, /non-disclosure/i, /\bnda\b/i], "Confidentiality duties are missing or not clearly scoped."),
  gate("ip_ownership", "Intellectual property", [/intellectual property/i, /\bip\b/i, /copyright/i, /patent/i, /trademark/i, /work product/i], "IP ownership, license, or work-product rights are not clear."),
  gate("data_privacy", "Data and privacy", [/personal data/i, /privacy/i, /data protection/i, /gdpr/i, /ccpa/i, /customer data/i], "Data, privacy, or processing duties are not clearly addressed."),
  gate("compliance", "Compliance", [/comply/i, /law/i, /regulation/i, /permit/i, /license/i, /anti-bribery/i, /sanctions/i], "Compliance duties, permits, or regulatory constraints are missing or unclear."),
  gate("notices", "Notices", [/notice/i, /address for notice/i, /email notice/i, /deemed received/i], "Notice method, address, or effective receipt rules are missing."),
  gate("dispute_resolution", "Dispute resolution", [/dispute/i, /arbitration/i, /court/i, /jurisdiction/i, /venue/i], "Dispute forum or process is missing or unclear."),
  gate("governing_law", "Governing law", [/governing law/i, /governed by/i, /laws of/i], "Governing law is missing or unclear."),
  gate("attachments_consistency", "Attachments and consistency", [/appendix/i, /schedule/i, /exhibit/i, /attachment/i, /annex/i], "Referenced attachments or schedules may be missing or inconsistent."),
  gate("signatures", "Signatures and effective date", [/signature/i, /signed/i, /effective date/i, /seal/i, /counterpart/i], "Signature, seal, counterpart, or effective-date mechanics are missing or unclear."),
] as const satisfies readonly Gate[];

const RISK_RULES = [
  risk("Payment discretion risk", "high", "Price/payment", [/payment.*sole discretion/i, /withhold payment.*any reason/i, /non-refundable/i, /set.?off.*sole discretion/i], "Payment language may give one side broad discretion or remove practical recovery rights.", "Tie payment withholding, setoff, and refunds to objective breach or acceptance standards."),
  risk("Deemed acceptance risk", "medium", "Delivery/acceptance", [/deemed accepted/i, /acceptance.*sole discretion/i, /as-is/i, /without inspection/i], "Delivery or acceptance language may create acceptance without meaningful inspection or objection rights.", "Add objective acceptance criteria, inspection period, rejection process, and cure path."),
  risk("Broad indemnification", "high", "Liability/indemnity", [/indemn/i, /hold harmless/i], "Indemnity language may shift broad third-party or operational risk to one side.", "Make indemnity mutual where appropriate and limit it to defined third-party claims, breach, IP infringement, fraud, or misconduct."),
  risk("Unlimited liability", "critical", "Liability/indemnity", [/unlimited liability/i, /without limitation.*liability/i, /liability.*without.*limit/i], "The agreement may expose one side to uncapped losses.", "Add a liability cap and list only narrow, intentional carve-outs."),
  risk("One-sided termination rights", "high", "Termination/exit", [/terminate.*sole discretion/i, /without cause/i, /immediately terminate/i], "One party may be able to exit while the other remains locked into performance or cost.", "Make termination rights mutual or add notice, cure, transition, and refund mechanics."),
  risk("Unilateral change rights", "high", "Text consistency/change control", [/sole discretion/i, /modify.*terms/i, /change.*terms/i, /amend.*without/i], "One party may change terms, policies, scope, or fees without meaningful consent.", "Require written mutual amendment or a right to reject material adverse changes."),
  risk("Auto-renewal", "medium", "Termination/exit", [/auto.?renew/i, /automatically renew/i, /renewal term/i], "The contract may renew unless notice windows are tracked.", "Require advance renewal notice and a practical non-renewal window."),
  risk("Unclear dispute forum", "high", "Dispute resolution", [/non-exclusive jurisdiction/i, /any court/i, /venue.*sole discretion/i], "Dispute language may be incomplete or may send disputes to an unfavorable forum.", "Specify governing law, exclusive forum or arbitration seat, language, and interim relief."),
  risk("Confidentiality survival risk", "medium", "IP/confidentiality", [/confidential.*indefinite/i, /confidential.*perpetual/i, /no.*exception.*confidential/i], "Confidentiality duties may be overbroad or lack normal exclusions.", "Clarify scope, exclusions, duration, compelled disclosure, and return/destruction."),
  risk("IP assignment ambiguity", "high", "IP/confidentiality", [/work product.*owned by both/i, /intellectual property.*unclear/i, /license.*perpetual.*irrevocable/i], "IP or work-product ownership may not match the commercial intent.", "State ownership, license scope, pre-existing IP, improvements, and post-termination rights."),
  risk("Attachment inconsistency risk", "medium", "Definitions/attachments", [/appendix|schedule|exhibit|attachment|annex/i], "Referenced schedules or attachments can override or conflict with the body.", "Attach all referenced documents and add priority language for conflicts."),
] as const satisfies readonly RiskRule[];

const TYPE_HINTS = [
  { name: "Sales agreement", patterns: [/sale of goods/i, /purchase order/i, /\bseller\b/i, /\bbuyer\b/i] },
  { name: "Lease agreement", patterns: [/\blessor\b/i, /\blessee\b/i, /\blandlord\b/i, /\btenant\b/i, /lease/i, /rent/i] },
  { name: "Loan agreement", patterns: [/\blender\b/i, /\bborrower\b/i, /principal/i, /interest/i, /loan/i] },
  { name: "Employment agreement", patterns: [/employee/i, /employer/i, /salary/i, /non-compete/i, /termination of employment/i] },
  { name: "Construction agreement", patterns: [/construction/i, /contractor/i, /subcontractor/i, /works/i, /completion certificate/i] },
  { name: "Services agreement", patterns: [/services/i, /service provider/i, /statement of work/i, /\bSOW\b/i, /deliverables/i] },
  { name: "Equity or investment agreement", patterns: [/shares/i, /equity/i, /shareholder/i, /subscription/i, /valuation/i] },
  { name: "Guarantee or security agreement", patterns: [/guarantee/i, /surety/i, /collateral/i, /pledge/i, /mortgage/i, /security interest/i] },
  { name: "Technology or IP agreement", patterns: [/technology/i, /license/i, /software/i, /source code/i, /intellectual property/i] },
] as const;

const SEVERITY_SCORE: Record<Severity, number> = {
  critical: 30,
  high: 20,
  medium: 10,
  low: 5,
};

export function reviewContract(input: {
  readonly fileName: string;
  readonly fileType: ReviewReport["fileType"];
  readonly text: string;
}): ReviewReport {
  const contractType = detectContractType(input.text);
  const clauses: ReviewReport["clauses"] = COMMON_GATES.map((gateItem) => {
    const excerpt = findExcerpt(input.text, gateItem.patterns);
    return {
      type: gateItem.type,
      title: gateItem.title,
      summary: excerpt ? summarizeClause(gateItem.title) : gateItem.missingSummary,
      excerpt,
      status: excerpt ? "found" as const : "missing" as const,
    };
  });
  const detectedRisks = RISK_RULES.flatMap((rule) => riskIfMatched(input.text, rule));
  const risks: ReviewReport["risks"] = [
    ...detectedRisks,
    ...missingConditionalRisks(input.text, clauses, contractType),
  ];
  const missingOrUnclearClauses = clauses
    .filter((clause) => clause.status !== "found")
    .map((clause) => clause.title);

  return {
    fileName: input.fileName,
    fileType: input.fileType,
    methodology: {
      name: "contract-review-pro-adapted",
      reviewState: [
        `Contract type inferred as ${contractType}.`,
        `${input.text.length} characters of contract text reviewed.`,
        "Gates run in order: validity, subject/authority, clause coverage, consistency, output.",
      ],
      gates: [...REVIEW_GATES],
    },
    summary: buildSummary(contractType, clauses, risks),
    overallRiskScore: Math.min(
      100,
      risks.reduce((score, item) => score + SEVERITY_SCORE[item.severity], missingOrUnclearClauses.length * 3),
    ),
    risks,
    clauses,
    missingOrUnclearClauses,
    negotiationSuggestions: Array.from(new Set(risks.map((item) => item.negotiationPoint))).slice(0, 8),
    extractedTextLength: input.text.length,
  };
}

function gate(type: ClauseType, title: string, patterns: readonly RegExp[], missingSummary: string): Gate {
  return { type, title, patterns, missingSummary };
}

function risk(
  title: string,
  severity: Severity,
  category: string,
  patterns: readonly RegExp[],
  explanation: string,
  negotiationPoint: string,
): RiskRule {
  return { title, severity, category, patterns, explanation, negotiationPoint };
}

function riskIfMatched(text: string, rule: RiskRule): ReviewReport["risks"] {
  if (!hasAny(text, rule.patterns)) return [];
  const clauseReference = findExcerpt(text, rule.patterns);
  return [
    {
      title: rule.title,
      severity: rule.severity,
      category: rule.category,
      explanation: rule.explanation,
      ...(clauseReference ? { clauseReference } : {}),
      dimensions: riskDimensions(rule.severity, rule.category, rule.explanation),
      revisionMethod: rule.severity === "low" ? "direct_change" : "comment",
      negotiationPoint: rule.negotiationPoint,
    },
  ];
}

function missingConditionalRisks(
  text: string,
  clauses: ReviewReport["clauses"],
  contractType: string,
): ReviewReport["risks"] {
  const risks: ReviewReport["risks"] = [];
  const missing = new Set(clauses.filter((clause) => clause.status === "missing").map((clause) => clause.type));

  if (missing.has("contract_subject")) {
    risks.push(missingRisk("Missing or vague subject matter", "critical", "Validity/compliance", "The contract may not identify what is being bought, sold, leased, licensed, built, or performed.", "Define the subject matter with enough specificity to make performance objectively measurable."));
  }
  if (missing.has("parties_authority")) {
    risks.push(missingRisk("Party or authority gap", "high", "Subject/authority", "The agreement may not clearly establish the contracting parties or signing authority.", "Confirm legal names, capacity, authority, signatures, and required approvals."));
  }
  if (missing.has("price_payment")) {
    risks.push(missingRisk("Missing price or payment terms", "high", "Price/payment", "Payment disputes are likely if amount, timing, tax, invoice, or account terms are absent.", "Add a complete payment clause with amount, currency, due dates, tax, invoice, and account controls."));
  }
  if (missing.has("breach_remedies")) {
    risks.push(missingRisk("Missing breach remedies", "high", "Breach/remedies", "The contract may say what parties must do without saying what happens if they do not perform.", "Add breach events, cure periods, damages, specific remedies, and recovery of enforcement costs."));
  }
  if (missing.has("termination")) {
    risks.push(missingRisk("Missing termination mechanics", "high", "Termination/exit", "The parties may lack a clear exit path if performance fails or business needs change.", "Add termination for breach, cure periods, optional convenience termination where appropriate, and post-termination duties."));
  }
  if (missing.has("dispute_resolution") || missing.has("governing_law")) {
    risks.push(missingRisk("Missing dispute framework", "medium", "Dispute resolution", "Disputes may become slower and more expensive without law, forum, and service mechanics.", "Add governing law, forum or arbitration, language, injunctive relief, and notice/service rules."));
  }

  if (contractType === "Lease agreement" && hasAny(text, [/lease/i]) && !hasAny(text, [/repair|maintenance|return|surrender/i])) {
    risks.push(missingRisk("Lease operations missing", "medium", "Property/use", "Lease text may not cover repairs, maintenance, permitted use, or return condition.", "Add use restrictions, maintenance allocation, repair process, and surrender condition."));
  }
  if (contractType === "Loan agreement" && !hasAny(text, [/maturity|repayment|interest|default/i])) {
    risks.push(missingRisk("Loan economics incomplete", "high", "Price/payment", "Loan terms need principal, interest, maturity, repayment, and default mechanics to be enforceable in practice.", "Add principal, interest, repayment schedule, default interest, acceleration, and security if applicable."));
  }
  if (contractType === "Employment agreement" && hasAny(text, [/non-compete|noncompete|restrictive covenant/i])) {
    risks.push(missingRisk("Restrictive covenant needs review", "high", "Compliance", "Non-compete or similar restrictions can be unenforceable if overbroad or unsupported by required consideration.", "Narrow duration, geography, scope, consideration, and survival language."));
  }
  if (contractType === "Guarantee or security agreement" && !hasAny(text, [/registration|filing|perfection|guarantee period|security interest/i])) {
    risks.push(missingRisk("Security perfection gap", "high", "Collateral/guarantee", "Collateral or guarantee rights may be hard to enforce without perfection, filing, priority, or guarantee-period mechanics.", "Add registration or filing duties, priority language, collateral description, guarantee period, and enforcement costs."));
  }

  return risks;
}

function missingRisk(
  title: string,
  severity: Severity,
  category: string,
  explanation: string,
  negotiationPoint: string,
): ReviewReport["risks"][number] {
  return {
    title,
    severity,
    category,
    explanation,
    dimensions: riskDimensions(severity, category, explanation),
    revisionMethod: severity === "low" ? "direct_change" : "comment",
    negotiationPoint,
  };
}

function detectContractType(text: string): string {
  const hit = TYPE_HINTS.find((type) => hasAny(text, type.patterns));
  return hit?.name ?? "General contract";
}

function riskDimensions(severity: Severity, category: string, exposure: string): ReviewReport["risks"][number]["dimensions"] {
  return {
    classification: category,
    exposure,
    likelihood: severity === "critical" ? "high" : severity === "high" ? "medium-high" : "medium",
    avoidability: category === "Validity/compliance" ? "structural fix or factual verification needed" : "usually negotiable by clause change",
    businessTradeoff: "Weigh leverage, deal value, switching cost, urgency, and whether the risk can be priced or insured.",
    urgency: severity === "critical" ? "immediate" : severity === "high" ? "near-term" : "monitor",
  };
}

function hasAny(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function findExcerpt(text: string, patterns: readonly RegExp[]): string {
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (!match) continue;
    const start = Math.max(0, match.index - 180);
    const end = Math.min(text.length, match.index + 420);
    return text.slice(start, end).replace(/\s+/g, " ").trim();
  }
  return "";
}

function summarizeClause(title: string): string {
  return `${title} language was found. Review the excerpt for scope, mutuality, timing, conditions, and remedies.`;
}

function buildSummary(contractType: string, clauses: ReviewReport["clauses"], risks: ReviewReport["risks"]): string[] {
  const foundCount = clauses.filter((clause) => clause.status === "found").length;
  const criticalCount = risks.filter((item) => item.severity === "critical").length;
  const highCount = risks.filter((item) => item.severity === "high").length;

  return [
    `This appears to be a ${contractType}. ${foundCount} of ${clauses.length} general review gates were found in the extracted text.`,
    criticalCount > 0
      ? `${criticalCount} critical issue needs attention before signing.`
      : "No critical issue was detected by the rule engine.",
    highCount > 0
      ? `${highCount} high-severity issue should be negotiated, clarified, or fact-checked.`
      : "No high-severity issue was detected by the rule engine.",
  ];
}
