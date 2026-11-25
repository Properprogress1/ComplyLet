# ComplyLet implementation progress

Updated 25 November 2026.

## Current phase

Phase 0 baseline documented. Phase 1 is in progress. The identity and organisation workspace foundation has been verified against native PostgreSQL. Self-service browser session management is implemented for the single-process application. Phase 2 and tenant-owned business features remain gated.

## Completed

- Configured the staging gateway to strip `Server` and `X-Powered-By` from normal responses and gateway errors. Added an HTTPS response header smoke check for staging.

- Reviewed the complete master specification and moved it from `docs.md/` to the canonical `docs/` directory. Initialised the empty Git repository.
- Added persistent engineering instructions, product requirements, system and data diagrams, module map, database dictionary, STRIDE threat model, permission matrix, milestones and ADRs.
- Added a strict React and TypeScript web app, Vite and Tailwind foundations, a basic accessible workspace shell, Maven Wrapper, Java 21 Spring Boot application, PostgreSQL migration, and local services and CI definitions.
- Implemented OIDC authorization code with PKCE, server-side sessions, cookie and CSRF controls, verified-email API access, active membership discovery, workspace authorisation and audit event recording.
- Added distinct PostgreSQL roles, explicit grants, tenant-aware audit attribution and transaction-local actor and tenant scope enforced by RLS.

- Added verified-account browser session visibility and self-service revocation, with CSRF enforcement and security event logging. This uses the existing server-side session lifecycle and adds no Flyway migration. See [ADR 0003](adr/0003-browser-session-revocation.md).

## In progress

- Verify provider-backed MFA and step-up for privileged team changes, and verify the Docker-backed CI path.

## Pending and security concerns

- Complete and verify invitation, audited membership administration, provider-side session termination, MFA, registration and recovery email, auth endpoint rate limits, and login anomaly monitoring. Local Keycloak has registration, email verification, password reset and brute-force controls configured.
- Select production identity and revocable session storage, define the edge HTTPS security configuration, and verify operational controls. Local sessions are in memory. Application revocation denies subsequent requests with the old session. A live provider SSO session can still issue a fresh application session.
- Finish the broader design system, shell and CI static analysis, security scans and SBOM. Add correlated logs and tracing before rollout.
- Branch and resource permissions, platform access controls and tenant-safe exports become executable gates before their corresponding routes exist. Initial audit records use append-only runtime grants. Signed checkpoints and retention workflows follow in Phase 4.
- Runtime database credentials and code issuing arbitrary SQL are trusted boundaries. Provision and rotate migration and runtime credentials separately for deployment.

## External dependencies and known gaps

- Use Java 21, Node.js and Corepack, Docker with Compose, PostgreSQL, Keycloak, and Mailpit locally. The production provider and deployment stack remain unprovisioned.
- Docker startup on this host is blocked by the missing QEMU dependency for Colima. Compose shape can be validated independently. Testcontainers remains the default database test path in CI.
- The managed JUnit Jupiter 6 runtime is a recorded deviation from the specification’s JUnit 5 line item. See [ADR 0002](adr/0002-supported-spring-stack.md).

## Foundation baseline verification

| Command or scenario | Actual result |
|---|---|
| `CI=true make setup` | Passed. pnpm verified the frozen lockfile. |
| Maven Wrapper `verify`, Java 21.0.9, native PostgreSQL 16.14 | Passed 5 tests with zero failures, errors or skips. Flyway migrated a fresh database. Tests cover module boundaries, anonymous and unverified requests, active-role and issuer checks, foreign workspace rejection, CSRF, audit grants and scope cleanup after commit and rollback. The executable API JAR built successfully. |
| `corepack pnpm --filter @complylet/web test` | Passed 3 tests after fixing a timing-sensitive fixture in the combined run. The fixture now awaits the initial React updates before checking sign-in. |
| `corepack pnpm --filter @complylet/web build` | Strict type checking and the Vite build passed. Rollup reported dependency annotation warnings from Zod. |
| `corepack pnpm audit --audit-level high` | Completed. The npm registry reported no known vulnerabilities. |
| Compose configuration and Keycloak realm JSON validation | Passed. Full Compose startup and the Docker-backed Testcontainers path remain unverified because Colima requires QEMU on this host. |
| Playwright browser scenarios | Passed 2 tests on installed Chrome with standalone Keycloak 26.8.2 and native PostgreSQL. Verified real OIDC login and logout, the HttpOnly SameSite session cookie, workspace selection, foreign workspace rejection and missing-CSRF rejection. A concurrent build replaced the JAR during the first attempt. The passing run used an isolated copy of the final JAR. |

## Session management verification

| Command or scenario | Actual result |
|---|---|
| `make test` with Java 21.0.9 and disposable native PostgreSQL 16.14 | Passed 6 backend tests and 3 frontend tests. Flyway applied the foundation migration to an empty database. The executable API JAR, strict TypeScript check and web production build passed. Rollup reported existing Zod annotation warnings. |
| `make e2e` with installed Chrome, standalone Keycloak 26.8.2 and native PostgreSQL | All 3 scenarios passed. Confirmed OIDC login and logout, workspace isolation, session visibility, CSRF enforcement, foreign and unknown target equivalence, self-revocation rejection, and protected-route denial after remote revocation. The API emitted one revocation log event. |
| Standalone Compose configuration validation, Keycloak realm JSON validation and `git diff --check` | Passed. Full Compose startup and Docker Testcontainers remain unverified because the Docker daemon is unavailable on this host. |

## Security assessment

Reviewed the implemented application, database, dependency and infrastructure surface. Added tenant-bound RLS through Flyway V2, explicit API route grants, verified OpenAPI access, cookie-only session tracking, consistent repeat revocation, and build and CI hardening. Verified the V1-to-V2 upgrade, 8 backend tests, 3 frontend tests and the production builds. All 3 Playwright scenarios passed with embedded Tomcat 11.0.29, standalone Keycloak and native PostgreSQL. Docker-backed CI, patched production JVMs and the remaining release controls are open. See the [prioritised findings](security/ASSESSMENT.md) and [production readiness checklist](security/PRODUCTION_READINESS.md). Phase 2 remains gated.

## Workspace frontend design

Refined the existing sign-in, workspace selection, browser sessions and unavailable-page experiences with shared responsive light and dark panels and controls. Added role labels, visible and announced selection, bidirectional cursor navigation, keyboard bypass and clearer loading, empty, retry and access-denied states. The same OIDC and workspace/session APIs remain in use. The portfolio dashboard, property workspace, Compliance Passport, certificate vault, regulatory intelligence, onboarding, evidence packs and billing still depend on later gated modules.

Six frontend component tests and the strict TypeScript and Vite build passed. All three Playwright scenarios passed on Chrome against standalone Keycloak and native PostgreSQL. The browser run verified keyboard skip and disclosure navigation, 320 CSS-pixel reflow, and no axe violations in the scanned sign-in, selected workspace and dark-mode account states. The npm registry reported no known advisories for the updated lockfile.

## Production readiness assessment

Mapped the master specification to current functionality and release evidence. Added a foundation staging configuration with HTTPS ingress, runtime-only credentials, private API routing and CI validation of the Compose shape. Verified the native foundation suite, logical database restore and native HTTPS gateway smoke. The three browser scenarios passed across separate runs after correcting a shared-session fixture assumption. A full deployment-equivalent run is pending. Security and infrastructure evidence is recorded in the [engineering readiness report](operations/ENGINEERING_READINESS_REPORT.md). The [production launch checklist](security/PRODUCTION_READINESS.md) records the remaining owner decisions and verification gates. No environment or paid integration was activated. Phase 2 remains gated.

## Email verification

Retained Keycloak as the identity and verification authority. The local realm and Compose now load a ComplyLet email and login theme, a 30-minute verification link, a 60-second native resend cooldown and the native verified email-change action. Registration verifies the address before allowing password setup. Spring continues to enforce the trusted OIDC verification claim and separate tenant membership checks.

Verification passed on the isolated local stack with Keycloak 26.8.2, Mailpit, native PostgreSQL and Chrome. Maven verify passed 8 tests, Vitest passed 6 tests, and Playwright passed all 4 scenarios. The new browser scenario covers registration, multipart mail, 30-minute token configuration, immediate resend rejection, scanner-style access without a registration cookie, password setup after verification, invalid-link rejection, link replay and access without organisation membership. The web build, both Compose configuration checks and whitespace validation passed.

[Email configuration](EMAIL_CONFIGURATION.md) documents separate Mailpit and outbound SMTP settings, Resend, future SES migration, DNS, vault-backed credentials and acceptance tests. No outbound sender or provider has been provisioned. Real-delivery acceptance, per-IP and hourly per-email limits, recovery and email-change verification, broader abuse tests and application notification outbox and webhook work remain open. The Phase 2 gate remains closed.

## Next recommended task

Implement and verify MFA and step-up authentication, then use it to gate invitations and audited membership administration. Rerun the authentication, authorisation and isolation gates with the full stack and CI before opening Phase 2.
