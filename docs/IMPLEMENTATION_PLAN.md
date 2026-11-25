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

Within Phase 1, self-service browser session visibility and application session revocation use the existing server sessions. Next, verify provider-backed MFA and step-up before adding invitation and privileged membership writes. Verify provider-side revocation, shared session storage, recovery email, rate limits and login anomaly monitoring before marking the identity lifecycle complete.

Phase 1 assessment controls and release evidence are tracked in the [security assessment](security/ASSESSMENT.md) and [production readiness checklist](security/PRODUCTION_READINESS.md). Retest the bound RLS scope and explicit API grants with every tenant module.

The Phase 1 React shell establishes responsive light and dark page surfaces, keyboard navigation, and state patterns for the existing account and workspace flows. Add business navigation and screens with their authorised endpoints in the scheduled phases.

The [staging candidate](../infrastructure/environments/staging/README.md) packages the verified foundation for synthetic use. The [engineering readiness report](operations/ENGINEERING_READINESS_REPORT.md) maps outstanding scope and release evidence to the master specification.

Verify that deployed staging ingress removes `Server` and `X-Powered-By` from static, proxied and gateway error responses.

Phase 1 registration uses Keycloak verification and SMTP. Apply the [email configuration](EMAIL_CONFIGURATION.md) and verify the provider, resend limits and real delivery before opening registration on a public deployment. See [ADR 0004](adr/0004-keycloak-verification-and-email-transport.md).
