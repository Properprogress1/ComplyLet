# Security architecture and STRIDE threat model

Browser, identity provider, API and database are separate trust boundaries. Assets include credentials and tokens at the provider and server, session cookies in the browser, tenant memberships and audit events in PostgreSQL, and future customer evidence in private object storage.

| Threat | Control | Verification |
|---|---|---|
| Spoofing | OIDC authorization code and provider-validated identity, server-side session, verified email | Provider browser login, invalid or anonymous sessions |
| Session misuse | Verified users can inspect and revoke their other application sessions. Every request checks revocation before protected processing. | Real-provider browser test covers foreign targets, CSRF and denial when the revoked cookie is reused. |
| Tampering | CSRF and validated UUIDs, backend policy, parameterised SQL, database constraints | Missing CSRF, forbidden writes and wrong-tenant writes |
| Repudiation | Record workspace selection with tenant, actor and database timestamp | Successful selection and audit privilege test |
| Information disclosure | Actor-scoped discovery, tenant-bound RLS reads, generic errors and no-store API responses | Unknown and foreign workspace responses match, pooled connection cleanup |
| Denial of service | Provider brute-force protection, timeouts and bounded membership listings | Load and rate-limit verification remain pending |
| Elevation of privilege | Distinct runtime and migration roles, deny-by-default endpoints and explicit grants | Runtime role flags, role tests and database privilege tests |

Production gates include shared revocable sessions, enforced MFA, security-event forwarding, rate limits, operational access controls, secret rotation, ASVS Level 2 review and incident response. A future file pipeline requires quarantine and scanning before authorised download. Sensitive actions require step-up and audit. Existing audit events have append-only runtime privileges. Hash chaining and signed checkpoints belong to Phase 4.

See [the security assessment](ASSESSMENT.md) for findings and [production readiness](PRODUCTION_READINESS.md) for release criteria.
