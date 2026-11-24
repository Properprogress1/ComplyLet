# Implementation plan

| Phase | Milestone and gate |
|---|---|
| 0 | Requirements, modular architecture, security model, database design, permissions and open decisions. |
| 1 | Monorepo, local stack, CI, accessible shell, OIDC lifecycle and memberships, scoped permissions, audit and tenant isolation. Require real provider login and PostgreSQL verification before Phase 2. |
| 2 | Resumable onboarding, branches, properties, landlords, tenancies, address abstraction, search and idempotent CSV import. Verify branch/resource authorisation. |
| 3 | Versioned official sources, scheme coverage, rule review and publication, historical applicability, deadline tests and obligations. Require human source approval. |
| 4 | Private upload, quarantine, extraction review, vault, evidence, hash chain and signed checkpoints, Compliance Passport. Verify document tenant isolation and integrity. |
| 5 | Tasks, dashboard, notifications, proof-of-service, PRS readiness, sharing and evidence packs. Verify retries, selective disclosure and revocation. |
| 6 | Stripe, entitlements, billing reconciliation, public website, assessment and platform operations. Verify billing in test mode before paid pilots. |
| 7 | Landlord portal, advanced branches, authorised PMS integration, agency compliance, analytics, source monitoring and council expansion. |
| 8 | Security, accessibility, load and restore exercises, Terraform validation, dashboards and incident readiness. Approval required before deployment. |
| 9 | Document expansion cases for regulatory API, insurers, institutions, new jurisdictions and housing workflows. Validate demand and sources before implementation. |

Phase 1 negative tests cover anonymous access, unverified identity, inactive membership, cross-tenant and unknown workspace responses, wrong-tenant audit writes, inability to update or delete audit rows, and transaction context cleanup. Add isolation tests for each new resource, search and export path before shipping it.
