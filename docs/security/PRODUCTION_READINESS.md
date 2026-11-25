# Production security readiness

24 November 2026 · Release blocked. Phase 2 gate closed.

- [x] Review the implemented repository surface against the master specification and record findings and unresolved controls.
- [x] Verify Flyway’s V1-to-V2 upgrade and bootstrap from an empty native PostgreSQL database. Verify actor-scoped discovery, bound tenant visibility, append-only runtime audit grants and transaction cleanup.
- [x] Verify explicit API grants, verified-email access to optional OpenAPI, and baseline API security and no-store headers in the local suite.
- [x] Verify local real-provider sign-in, sign-out, cross-workspace denial, CSRF and session revocation including repeat and foreign target handling.
- [x] Verify the Maven archive checksum on a fresh download and complete the npm registry advisory check. The separate backend, container and CI release controls remain open below.
- [x] Rehearse a native PostgreSQL logical restore and verify migration history, unscoped RLS and audit privileges on restored synthetic data.
- [x] Validate the staging Compose shape and smoke-test native Caddy routing, TLS, headers and private endpoint blocking.
- [ ] Complete Phase 1 identity lifecycle, including real-provider MFA, step-up for privileged writes, invitation and membership administration, recovery mail, rate limits and login anomaly monitoring.
- [ ] Verify shared revocable BFF sessions across instances and provider-side termination. Verify fixed lifetimes, cookie-only tracking and production cookie flags.
- [ ] Verify the complete Docker-backed CI path, separately provisioned runtime and migration identities, audited deployment permissions and backup restore.
- [ ] Record the deployed JVM versions and image digests. Require supported patched builds, dependency and image vulnerability scanning, secret scanning, static analysis, SBOMs and verified artifact provenance.
- [ ] Verify TLS, HSTS and security headers on the actual frontend ingress, enforce same-origin routing, private network paths, secret rotation, encrypted backups and environment separation.
- [ ] Add independently verifiable audit integrity, protected security event forwarding, privacy retention controls, incident response procedures and alert exercises.
- [ ] Pass the feature-specific security gates for document access, billing, asynchronous processing and regulatory publication before enabling those modules.
- [ ] Complete the ASVS Level 2 verification programme and get explicit production deployment approval.

See [assessment and verification evidence](ASSESSMENT.md).

## Product and operational sign-off

| Owner | Required launch evidence |
|---|---|
| Product and QA | All agreed launch features meet their acceptance criteria. Complete portfolio/onboarding, regulatory workflows, evidence, exports, marketing and platform administration for the agreed scope. Record functional coverage, performance and accessibility evaluations. |
| Regulatory reviewers | Source licensing and official provenance, council coverage, independent publication approval, correct effective dates and deterministic historical and unknown-applicability tests. |
| Privacy and legal | Approved notices, retention and erasure, processing and subprocessor agreements, privacy rights handling and incident duties. |
| Commercial and finance | Stripe test-mode verification of pricing, GBP amounts, taxes, invoices, signed and replay-safe webhooks, reconciliation, entitlements and cancellations. Approve cost assumptions and paid activation separately. |
| Platform operations | Approve infrastructure and image digests, Terraform plan, environment isolation, routing, keys and alerts. Validate measured P95 and capacity, backup retention, encrypted PITR, RTO/RPO, rollback and incident response. |
| Security and release manager | Close release-blocking findings, attach CI and independent control evidence, confirm staging smoke tests, record owners and obtain explicit launch approval. |

No owner sign-off, production rollout or paid activation has been recorded. See the [engineering readiness report](../operations/ENGINEERING_READINESS_REPORT.md) and [staging configuration](../../infrastructure/environments/staging/README.md).
