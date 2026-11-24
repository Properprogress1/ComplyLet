# ComplyLet implementation progress

Updated 24 November 2026.

## Current phase

Phase 0 baseline documented. Phase 1 is in progress. The identity and organisation workspace slice passed its native verification. Phase 2 and tenant-owned business features remain gated.

## Completed

- Reviewed the complete master specification and moved it from `docs.md/` to the canonical `docs/` directory. Initialised the empty Git repository.
- Added persistent engineering instructions, product requirements, system and data diagrams, module map, database dictionary, STRIDE threat model, permission matrix, milestones and ADRs.
- Added a strict React and TypeScript web app, Vite and Tailwind foundations, a basic accessible workspace shell, Maven Wrapper, Java 21 Spring Boot application, PostgreSQL migration, and local services and CI definitions.
- Implemented OIDC authorization code with PKCE, server-side sessions, cookie and CSRF controls, verified-email API access, active membership discovery, workspace authorisation and audit event recording.
- Added distinct PostgreSQL roles, explicit grants, tenant-aware audit attribution and transaction-local actor and tenant scope enforced by RLS.

## In progress

- Complete the remaining identity lifecycle controls and verify the Docker-backed CI path.

## Pending and security concerns

- Complete and verify invitation, audited membership administration, session revocation and device visibility, MFA, registration and recovery email, auth endpoint rate limits, and login anomaly monitoring. Local Keycloak has registration, email verification, password reset and brute-force controls configured.
- Select production identity and revocable session storage, define the edge HTTPS security configuration, and verify operational controls. Local sessions are in memory.
- Finish the broader design system, shell and CI static analysis, security scans and SBOM. Add correlated logs and tracing before rollout.
- Branch and resource permissions, platform access controls and tenant-safe exports become executable gates before their corresponding routes exist. Initial audit records use append-only runtime grants. Signed checkpoints and retention workflows follow in Phase 4.
- Runtime database credentials and code issuing arbitrary SQL are trusted boundaries. Provision and rotate migration and runtime credentials separately for deployment.

## External dependencies and known gaps

- Use Java 21, Node.js and Corepack, Docker with Compose, PostgreSQL, Keycloak, and Mailpit locally. The production provider and deployment stack remain unprovisioned.
- Docker startup on this host is blocked by the missing QEMU dependency for Colima. Compose shape can be validated independently. Testcontainers remains the default database test path in CI.
- The managed JUnit Jupiter 6 runtime is a recorded deviation from the specification’s JUnit 5 line item. See [ADR 0002](adr/0002-supported-spring-stack.md).

## Verification results

| Command or scenario | Actual result |
|---|---|
| `CI=true make setup` | Passed. pnpm verified the frozen lockfile. |
| Maven Wrapper `verify`, Java 21.0.9, native PostgreSQL 16.14 | Passed 5 tests with zero failures, errors or skips. Flyway migrated a fresh database. Tests cover module boundaries, anonymous and unverified requests, active-role and issuer checks, foreign workspace rejection, CSRF, audit grants and scope cleanup after commit and rollback. The executable API JAR built successfully. |
| `corepack pnpm --filter @complylet/web test` | Passed 3 tests after fixing a timing-sensitive fixture in the combined run. The fixture now awaits the initial React updates before checking sign-in. |
| `corepack pnpm --filter @complylet/web build` | Strict type checking and the Vite build passed. Rollup reported dependency annotation warnings from Zod. |
| `corepack pnpm audit --audit-level high` | Completed. The npm registry reported no known vulnerabilities. |
| Compose configuration and Keycloak realm JSON validation | Passed. Full Compose startup and the Docker-backed Testcontainers path remain unverified because Colima requires QEMU on this host. |
| Playwright browser scenarios | Passed 2 tests on installed Chrome with standalone Keycloak 26.8.2 and native PostgreSQL. Verified real OIDC login and logout, the HttpOnly SameSite session cookie, workspace selection, foreign workspace rejection and missing-CSRF rejection. A concurrent build replaced the JAR during the first attempt. The passing run used an isolated copy of the final JAR. |

## Next recommended task

Finish the Phase 1 identity lifecycle and privileged membership management, then rerun the authentication and tenant isolation gates with the full local stack and CI before opening Phase 2.
