# Contract Review Agent

A template for reviewing contracts and surfacing practical business/legal risks before a user signs.

## Language

**Contract**:
A user-provided agreement that creates obligations, rights, payment, delivery, confidentiality, IP, employment, loan, lease, sale, service, equity, guarantee, or dispute terms.
_Avoid_: pleadings, legal research memos, policy documents, unrelated PDFs

**Contract Upload**:
A user-provided contract file submitted for review. V1 accepts PDF and DOCX files.
_Avoid_: scanned image-only PDFs, contract repositories, bulk review

**Review State**:
The structured intermediate record created after parsing a contract upload. It captures file metadata, inferred contract type, extracted clauses, gate findings, risks, and unresolved issues before the final report is generated.
_Avoid_: chat history, memory, database record

**Review Gate**:
A required check for a contract risk area: validity, parties/authority, clause coverage, consistency, and output quality.
_Avoid_: a single contract-type checklist

**Risk Report**:
The user-facing review output that summarizes the agreement, highlights risks, extracts important clauses, and suggests negotiation points.
_Avoid_: legal opinion, redline, signing recommendation

**Report Page**:
The single browser page that displays a completed risk report after a contract upload is reviewed.
_Avoid_: chat transcript, dashboard, document editor
