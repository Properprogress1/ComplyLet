# ComplyLet engineering readiness report

24 November 2026 · Phase 1 foundation

**Production launch and Phase 2 remain blocked.** The repository provides OIDC sign-in, account session management, active workspace membership discovery and selection, and append-only workspace audit attribution. Staging assets package this foundation for synthetic use.

## Release blockers

1. Close Phase 1 identity, authorisation and operational isolation gates. Require MFA and step-up, account lifecycle, shared and provider-side revocation, rate limiting, recovery, and deployment-equivalent tests.
2. Deliver the agreed product scope. Portfolio, regulatory, compliance, evidence, billing and administrative modules lack executable acceptance paths. No verified regulatory source set or rules publication workflow exists.
3. Establish approved infrastructure and operations. Production Terraform, private ingress and identities, patched images, monitoring, encrypted backup and PITR, rollback, privacy governance and incident response all require deployment evidence.
4. Complete independent assurance. Collect Docker-backed CI and staging results, backend and container security gates, accessibility evaluation, representative performance and disaster recovery results, and commercial test-mode acceptance.

## Specification coverage

This matrix follows the [master specification](../MASTER_SPECIFICATION.md). Each row groups closely related requirements and records the absence of executable acceptance evidence for planned modules.

| Specification | State and evidence | Outstanding acceptance |
|---|---|---|
| §§1–2 Objectives and product | Product and audience are defined. The application exposes workspace access. | Portfolio obligations, evidence, deadlines, responsibilities, unknown applicability and historical verification. |
| §3 Frontend | React, strict TypeScript, Vite, React Router, TanStack Query, Zod, Tailwind, pnpm, Vitest, Testing Library and Playwright. | Add feature-specific Zustand, React Hook Form, shadcn/Radix, TanStack Table, Recharts, Lucide and Storybook where applicable. |
| §3 Backend | Java 21, Spring MVC/Security, Boot/JPA infrastructure, Flyway, PostgreSQL, Modulith, JDBC, Jakarta validation, OpenAPI, Maven Wrapper, Testcontainers, Mockito and Micrometer foundations. JUnit 6 deviation recorded. | Domain persistence, justified Redis and Resilience4j, tracing and verified patched runtime. |
| §3 Infrastructure | Compose, GitHub Actions and staging gateway/image definitions. | AWS London Terraform, ECS, RDS, S3, SES, KMS, managed secrets, WAF, CloudFront, Route 53, CloudWatch and justified SQS. MinIO and other local alternatives follow their features. |
| §4 Architecture | Same-origin BFF, modular monolith, typed frontend state, transaction-scoped JDBC, module verification and ADRs. | Remaining domain boundaries, generated clients where practical, outbox and idempotent consumers. |
| §5 Repository structure | Apps, docs, infrastructure and CI exist. | Add Terraform, operating scripts and shared packages when needed. |
| §6 Multi-tenancy | Verified issuer/subject, active membership, tenant transaction context, queries, RLS, separate roles, tenant-aware audit relationships and pooled scope cleanup. | Verify branch, staff and landlord grants, tenant-scoped cache, documents, jobs, search, export and inference when corresponding modules exist. Arbitrary SQL and owner access remain trust boundaries. |
| §7 Identity and access | Code/PKCE, server sessions, verified email, CSRF, workspace switching, cookie-only tracking, application revocation and provider logout. Keycloak config enables registration, verification, reset and brute-force protection. | Confirm mail/recovery, MFA, step-up, invitation and membership administration, provider termination and shared sessions, rate limits, anomaly detection and platform roles. Verify Secure cookies at HTTPS ingress. |
| §§9–10 Billing and integrations | Stripe, entitlements, webhooks, reconciliation, PMS, address/EPC API, document AI, notification and government integrations are absent. | Build GBP minor-unit billing and lifecycle, signature/replay controls, reconciliation, tax, invoice and cancellation workflows. Verify licences and authorised test integrations. |
| §11 UI and accessibility | Responsive light/dark workspace and account flows with keyboard, feedback and axe tests. | Full navigation, branch and global search, notifications, profile, property tabs, reusable business states, manual assistive-technology audits and WCAG 2.2 AA evaluation. |
| §§12–13 Database and API | Three foundation tables, migrations V1/V2, constraints, restricted grants, DTOs, bounded cursor listing, method permissions and problem details. | Domain schema, version/temporal and integrity constraints, concurrency, idempotency, correlation IDs, retention and API contracts. |
| §14 Security | CSRF, cookie-only tracking, API headers, input validation, parameterised SQL, constrained runtime grants and threat model. Staging gateway headers configured. | Test TLS and browser headers at the ingress, encryption, secrets, rate limits and ASVS Level 2. Verify private file, quarantine, safe parsing, download and webhook controls as added. Complete governance and incident drills. |
| §15 Privacy | Minimal implemented identity and audit metadata. | Review GDPR roles, subprocessors, data flows and notices. Implement retention, lawful erasure, access/portability, restrictions and incident processes. |
| §16 Background work | Outbox, workers, scheduler, retries and DLQ absent. | Atomic enqueue, idempotency, tenant context, retry/replay, partial failure, locking and recovery. |
| §17 Monitoring | Health endpoint, framework and provider logs, workspace audit and revocation event. | Correlated logs, restricted metrics and traces, dashboards, alert delivery and incident response. |
| §18 Testing | Architecture, native PostgreSQL/API/RLS/Flyway tests, component tests, real OIDC Playwright and axe. | Docker-native CI, core coverage measurement, MFA/recovery, concurrency/idempotency, remaining journeys, manual accessibility, load and recovery tests. |
| §19 CI/CD | Pinned actions, read-only token, frozen dependencies, build/test/audit and Compose validation. | SAST, secret and container scanning gates, backend SCA, SBOMs, provenance, workload identity, deployment approvals and required checks. |
| §20 Infrastructure and DR | Local Compose and staging candidate. See native recovery evidence below. | Production Terraform, private networking, enforced encryption, PITR, lifecycle policies, IAM, monitoring and budgets. Exercise rollback and prove 15-minute RPO and four-hour RTO. |
| §21 Performance | Bounded workspace pagination and active membership index. | Representative load and concurrency, validated limits for 500 organisations and 250,000 properties, read/write P95, dashboard and import measurements. |
| §22 Marketing | Application sign-in only. | Public pages, pricing, demo, assessment, notices, consent, privacy and accessible SEO with review. |
| §23 Platform administration | Platform console and support access absent. | Expiring and audited support access, organisation/billing oversight, content review, security and operational administration. |
| §24 Documentation | Product, architecture, database, security, testing and API docs plus staging guide and launch checks. | Complete regulatory/AI governance, data retention, deployment, recovery and incident runbooks with named owners. |
| §25 Phases | Phase 0 documented and Phase 1 partial. Phases 2–8 gated, Phase 9 future planning. | Complete Phase 1 authentication, authorisation and isolation before Phase 2. Validate demand and authorised sources before expansion. |
| §§26–28 Engineering and acceptance | Persistent instructions, progress, scoped tests and reported evidence exist. | Close acceptance for each slice and obtain required approvals. |
| §29 Deliverables | Foundation only, with readiness report, existing build commands, limitations and staging prerequisites. | Complete product and operational deliverables and calculate cost from the approved deployment and workload. |

### Core modules (§8)

| Module | Current implementation | Required acceptance |
|---|---|---|
| §8.1 Onboarding | Workspace selection and guidance. | Resumable agency and branch setup, invitations, subscription, import, coverage and completion. |
| §§8.2–8.4 Portfolio, landlords, tenancies | No entities, endpoints or pages. | Scoped CRUD/archive, search, bulk dry-run/idempotent CSV, address/UPRN, landlord ownership and evidence, tenancy lifecycle, communications and assigned-resource checks. |
| §§8.5–8.8 Rules, licensing, content and obligations | No source registry, rule engine, schemes, reviews or obligations. No published or verified regulatory dataset found. | Approve official sources and licensing, authorities and scheme boundaries. Independently approve rule versions and verify effective dates, historical and three-valued applicability, deadlines and workflow state. |
| §§8.9–8.10 Vault and extraction | No upload, scanner, vault or AI execution. | Tenant-aware storage, quarantine, scanning, versions, expiry, review, safe parser and AI inputs, human validation and manual fallback. |
| §§8.11–8.12 Passport and integrity | Workspace audit only, append-only for runtime with tenant-aware attribution. | Historical projections, selective revocable shares, canonical audit events, evidence hashes, tenant sequence, signed checkpoints and retention. |
| §§8.13–8.14 Proof-of-service and PRS readiness | No dispatch/receipt trail, readiness rules or export. | Preserve version/hash, delivery/provider events and manual evidence. Review regional readiness rules, deadlines, missing evidence and authorised submissions. |
| §§8.15–8.17 Dashboard, tasks and notifications | Workspace shell only. | Scoped metrics, unknown status, filters, idempotent assignments, review, due dates, reliable delivery, preferences and London time-zone tests. |
| §§8.18–8.20 Evidence packs, landlord portal and agency compliance | No exports, portal or agency controls. | Tenant-safe PDF/ZIP generation and download, scoped projections, property/field-level disclosure, retention and verified agency applicability. |

## Human and environment dependencies

- Product and regulatory reviewers must agree release scope, initial council coverage, official source rights and independent approval of each rule version. Privacy/legal reviewers must approve notices, processing, retention and subprocessors.
- Platform and identity operators need approved environment accounts, isolated OIDC and mail, runtime/migration identities, certificates, networking, encrypted recovery, alerting and an owned incident process. Budget approval needs actual region, volumes, availability and retention assumptions. No billable service was provisioned and no infrastructure cost estimate was obtained.
- Security, QA, accessibility and commercial owners must sign off their gates. Staging rollout, production, paid services and Stripe activation remain subject to explicit approval.

See the [staging guide](../../infrastructure/environments/staging/README.md) and [production launch checklist](../security/PRODUCTION_READINESS.md).

## Verification evidence

| Check | Actual result |
|---|---|
| Full repository test and production build command | Passed with Java 21.0.9 using the interim JVM mitigation and disposable PostgreSQL 16.14. Eight backend tests and six frontend tests passed. Flyway applied both migrations to an empty database. The API JAR, strict TypeScript and Vite build succeeded. The existing Rollup/Zod annotation warning remains. |
| Browser rerun constraints | The initial API startup exceeded the local readiness window. With a longer startup allowance, the Vite-backed run passed real sign-in, accessibility and cross-workspace denial. The three-login revocation scenario hit its 60-second test budget after recording the revocation. Its scenario-level budget is now 150 seconds. Security assertions and locator timeouts remain in place. The static-bundle run hit browser scenario deadlines in its first two tests. A prior timed-out test also left an additional legitimate session, which invalidated the next test’s fixed session-count assumption. The revocation test now identifies the sessions it created and checks account isolation without assuming the whole account is otherwise idle. The isolated rerun passed with real Keycloak and native PostgreSQL. The three scenarios passed across separate local runs. A single clean deployment-equivalent browser run remains a release gate. |
| Synthetic recovery drill | PostgreSQL custom-format dump restored into a separate native database. Source and restore both had 2 organisations, 6 memberships, 1 audit event and 2 successful Flyway migrations. The unscoped runtime role saw zero organisations and lacked audit DELETE permission. This exercised a logical restore with existing cluster roles. Deployment must separately reconcile roles and database-level grants, and exercise encrypted backup, PITR and timed recovery. |
| npm dependency advisory scan | npm reported no known vulnerabilities for the frontend lockfile. |
| Repository secret scan | Gitleaks 8.30.1 returned no findings for Git history and the current non-ignored source. Ignored environment files and deployment secret stores were outside the scan. |
| Static infrastructure checks | Development and staging Compose configuration validation, Keycloak realm JSON, CI YAML parsing and git diff whitespace validation passed. Caddy 2.11.9 validated the staging routing configuration with an ephemeral test certificate. |
| Native HTTPS gateway smoke | Passed with the staging Caddy routing and a temporary test certificate. The built web shell, CSP and HSTS returned over verified TLS. The API proxy returned 401 with no-store for an anonymous session request, and health and OpenAPI returned 404 at ingress. Container paths and OIDC through a deployed HTTPS ingress remain unverified. |
| Unavailable infrastructure and security checks | Docker daemon unavailable and no production Terraform exists. Image builds/scans, Docker Testcontainers, deployed staging, production Terraform plan, SAST gates and deployed SBOM/provenance remain open. Deployments and paid services were not activated. |
| Java dependency advisory scan | The rebuilt production JAR contains 112 nested dependency JARs. Package metadata and Maven resolution identified 111 coordinates, and the remaining Spring Boot tooling coordinate was checked separately. OSV returned no advisories for those exact coordinates. This excludes the JVM, operating system, unbundled build tools and containers. |
| Local performance sample | 100 read-only workspace discovery transactions, 1 client, 2 synthetic organisations on native PostgreSQL. P50 was 3.167 ms and P95 was 18.088 ms. This is a database-only smoke measurement, without HTTP, a representative dataset or concurrent tenants. Production latency and capacity targets remain unverified. |

The advisory checks used the [npm security registry](https://registry.npmjs.org/) and [OSV API](https://google.github.io/osv.dev/api/). Configuration was checked with [Caddy validation](https://caddyserver.com/docs/command-line).
