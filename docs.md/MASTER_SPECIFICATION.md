# MASTER DEVELOPMENT PROMPT — COMPLYLET

## 1. Role and responsibilities

Act as a principal software architect, senior full-stack engineer, application security engineer, DevSecOps engineer, database architect, SaaS product designer and quality assurance engineer.

Your responsibility is to design, implement, test, document and prepare ComplyLet for production deployment.

Build a commercially viable, secure, scalable, maintainable, multi-tenant B2B SaaS application.

This is not a demonstration project, hackathon prototype or proof of concept. Every implemented feature must be functional, appropriately secured, tested and suitable for its intended production use.

Prioritise:

- Security by design.
- Clean software architecture.
- Data integrity and correctness.
- Excellent user experience.
- Maintainability and extensibility.
- Regulatory traceability.
- Tenant isolation.
- Operational reliability.
- Automated testing.
- Cost-efficient infrastructure.
- Accessibility.
- Production readiness.

Do not introduce unnecessary architectural complexity.

Do not use mock functionality in production execution paths.

Do not fabricate regulatory information, government APIs, integrations, compliance certifications or successful test results.

---

## 2. Product definition

**Product name:** ComplyLet (working name, subject to trademark clearance).

**Product category:** PropTech, RegTech and B2B SaaS.

**Initial jurisdiction:** England.

**Initial target markets:** London and Greater Manchester.

**Primary customers:** Independent letting agencies managing between 50 and 500 residential rental properties.

**Positioning:** The audit-ready compliance record for independent letting agents.

**Tagline:** Know your obligations. Prove your compliance. Protect your portfolio.

### Product mission

Help letting agencies identify applicable regulatory obligations, monitor compliance activities, manage statutory documentation and maintain reliable evidence records.

### Product vision

Become the trusted regulatory intelligence and evidence infrastructure for the UK private rented sector.

### Core product principles

Every property must have a clear record of:

1. Applicable regulatory obligations.
2. Supporting regulatory sources.
3. Required actions.
4. Responsible individuals.
5. Relevant deadlines.
6. Supporting evidence.
7. Verification status.
8. Historical changes.
9. Outstanding compliance concerns.
10. Evidence of completed actions.

ComplyLet provides regulatory information and evidence management. It does not guarantee legal compliance, replace qualified legal advice or issue government-approved compliance certificates.

---

## 3. Mandatory technology stack

### Frontend

Use:

- React.
- TypeScript with strict mode enabled.
- Vite.
- React Router.
- TanStack Query for server state.
- Zustand for limited client-side application state.
- React Hook Form.
- Zod for runtime validation.
- Tailwind CSS.
- shadcn/ui and accessible Radix UI primitives.
- TanStack Table.
- Recharts for analytics.
- Lucide icons.
- Vitest.
- React Testing Library.
- Playwright for end-to-end testing.
- Storybook for reusable UI components where beneficial.
- pnpm with a committed lockfile.

Use current, stable, mutually compatible dependency versions. Verify compatibility rather than blindly installing the latest versions.

Do not use JavaScript for application source files when TypeScript is appropriate.

Avoid `any`, unsafe type assertions and unnecessary global state.

### Backend

Use:

- Java 21 LTS.
- A supported, stable Spring Boot release compatible with Java 21.
- Spring MVC.
- Spring Security.
- Spring Data JPA.
- Hibernate.
- Spring Modulith.
- Jakarta Bean Validation.
- PostgreSQL.
- Flyway for database migrations.
- Redis for justified caching, rate limiting and temporary state.
- Maven with Maven Wrapper.
- OpenAPI documentation.
- JUnit 5.
- Mockito.
- Testcontainers.
- ArchUnit.
- Resilience4j for appropriate external service resilience.
- Micrometer and OpenTelemetry.

Use explicit transaction boundaries and reliable domain event handling.

### Infrastructure

Use:

- Docker.
- Docker Compose for local development.
- AWS London region as the preferred initial production deployment region.
- Amazon ECS Fargate.
- Amazon RDS PostgreSQL.
- Amazon S3.
- Amazon SES.
- AWS Secrets Manager.
- AWS KMS.
- AWS WAF.
- Amazon CloudFront.
- Amazon Route 53.
- Amazon CloudWatch.
- Amazon SQS where asynchronous infrastructure is justified.
- Terraform.
- GitHub Actions.

Keep infrastructure cost-efficient for an early-stage SaaS business.

Do not introduce Kubernetes, Kafka, Elasticsearch or distributed microservices unless a documented requirement justifies them.

Provide local development alternatives for external cloud services, including MinIO and Mailpit where appropriate.

---

## 4. Software architecture

Implement a domain-driven modular monolith using clean architecture principles.

Each business module must have clearly defined responsibilities, interfaces, persistence ownership and dependency boundaries.

Use a pragmatic combination of:

- Domain-driven design.
- Hexagonal architecture.
- Clean architecture.
- SOLID principles.
- Dependency inversion.
- Application services.
- Repository abstractions where useful.
- Domain events.
- Transactional outbox.
- Idempotent background processing.

Avoid excessive abstraction, generic repository frameworks, unnecessary interfaces and anemic architecture where richer domain behaviour is appropriate.

### Backend module boundaries

Create the following business modules:

- Identity and access management.
- Organisations and multi-tenancy.
- Agency and branch management.
- Property portfolio management.
- Landlord management.
- Tenancy management.
- Regulatory intelligence.
- Licensing intelligence.
- Compliance obligations.
- Document management.
- Certificate management.
- Evidence management.
- Property Compliance Passport.
- Proof-of-service.
- PRS registration readiness.
- Tasks and workflow management.
- Notifications.
- Reporting and evidence exports.
- Billing and subscriptions.
- Integrations.
- Platform administration.
- Audit and security monitoring.

Each module should expose a deliberate public interface and prevent unrelated modules from directly accessing its internal repositories.

Use Spring Modulith and ArchUnit tests to enforce module boundaries.

Use synchronous calls for operations requiring immediate consistency. Use asynchronous domain events for notifications, document processing, reporting and other appropriate background workflows.

Document architectural decisions using ADRs.

### Frontend architecture

Use a feature-oriented architecture with clear separation between:

- Application configuration.
- Routing.
- Authentication.
- Shared UI components.
- Business features.
- API clients.
- Validation schemas.
- Domain types.
- Hooks.
- Utilities.
- Error handling.
- Test infrastructure.

Generate typed API clients from the backend OpenAPI specification where practical.

Do not duplicate business rules in the frontend. Frontend validation improves usability; backend validation remains authoritative.

---

## 5. Repository structure

Create a monorepo with the following structure, adapting it where justified:

```text
complylet/
├── AGENTS.md
├── README.md
├── SECURITY.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── .editorconfig
├── .gitignore
├── .env.example
├── Makefile
├── docker-compose.yml
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── ui/
│   ├── api-client/
│   └── shared-config/
├── infrastructure/
│   ├── terraform/
│   ├── docker/
│   └── environments/
├── docs/
│   ├── product/
│   ├── architecture/
│   ├── adr/
│   ├── security/
│   ├── compliance/
│   ├── api/
│   ├── operations/
│   └── testing/
├── scripts/
├── tests/
│   └── e2e/
└── .github/
    └── workflows/
```

Do not create empty packages or unnecessary infrastructure solely to match this structure.

---

## 6. Multi-tenant SaaS architecture

Multi-tenancy is a fundamental requirement, not an optional feature.

Each letting agency represents an organisation tenant.

An organisation can contain:

- Multiple branches.
- Multiple users.
- Multiple landlords.
- Multiple properties.
- Multiple tenancies.
- Documents.
- Compliance obligations.
- Evidence records.
- Subscription information.

Use a shared PostgreSQL database with tenant-scoped records and defence-in-depth tenant isolation.

### Mandatory tenant isolation controls

- Every tenant-owned entity must contain an organisation identifier.
- Derive tenant context from authenticated and authorised membership.
- Never trust an organisation identifier supplied by the frontend without validating membership.
- Enforce tenant boundaries in application services and persistence queries.
- Implement PostgreSQL row-level security for appropriate tenant-owned tables.
- Use transaction-scoped database tenant context.
- Ensure runtime database roles cannot bypass row-level security.
- Use separate migration and runtime database roles.
- Apply tenant-aware unique constraints and foreign keys.
- Prevent cross-tenant relationships at the database level.
- Include tenant context in cache keys.
- Include tenant context in background jobs.
- Validate tenant context during asynchronous event processing.
- Prevent cross-tenant document access.
- Prevent cross-tenant exports and search results.
- Prevent connection pool tenant-context leakage.
- Prevent tenant data leakage through error responses, logs or analytics.

Implement explicit integration tests demonstrating that one organisation cannot access, modify, delete, export or infer another organisation's data.

---

## 7. Authentication and authorisation

Implement secure identity management using a standards-based OpenID Connect provider.

Use a backend-for-frontend authentication architecture where appropriate.

The React application must not store sensitive access tokens or refresh tokens in localStorage or sessionStorage.

Use secure, HttpOnly, appropriately configured SameSite cookies for browser sessions.

### Authentication features

- Account registration.
- Email verification.
- Secure login.
- Logout.
- Password reset through the identity provider.
- Multi-factor authentication.
- Session management.
- Session revocation.
- Device and session visibility.
- Account invitation.
- Organisation membership management.
- Organisation switching.
- Suspicious login detection.
- Authentication event logging.
- Account recovery.
- Rate-limited authentication endpoints.

Use an established identity provider rather than implementing custom password authentication or cryptographic protocols unnecessarily.

Provide a local development identity provider configuration.

### Roles

Implement:

- Platform Administrator.
- Organisation Owner.
- Organisation Administrator.
- Compliance Manager.
- Branch Manager.
- Property Manager.
- Compliance Reviewer.
- Read-only Auditor.
- Landlord Viewer.

Use role-based access control combined with resource-level and branch-level authorisation.

Create a documented permission matrix.

Enforce permissions at the backend for every protected operation.

Frontend route protection and hidden buttons are not security boundaries.

Require additional verification for sensitive operations, including privileged account changes, API key management and sensitive bulk exports.

Platform administrator access to customer data must be restricted, justified, time-limited where appropriate and comprehensively audited.

---

## 8. Core product modules

### 8.1 Organisation onboarding

Implement a guided onboarding experience:

- Create an organisation.
- Enter agency information.
- Configure branches.
- Invite team members.
- Select a subscription.
- Import a property portfolio.
- Identify supported council areas.
- Review initial compliance concerns.
- Complete onboarding.

Support progress persistence and resumable onboarding.

Provide meaningful empty states and clear next actions.

### 8.2 Property portfolio management

Implement:

- Property creation.
- Property editing.
- Property archiving.
- Property search.
- Advanced filters.
- Bulk property operations.
- CSV portfolio import.
- CSV validation preview.
- Duplicate detection.
- Import error reporting.
- Address lookup.
- UPRN support where available.
- Council and local authority mapping.
- Property type classification.
- Occupancy information.
- HMO characteristics.
- Landlord assignment.
- Branch assignment.
- Property manager assignment.
- Tenancy history.
- Property activity timeline.

CSV imports must support dry-run validation, idempotency, asynchronous processing for large files and clear reporting.

Use legitimate, appropriately licensed address data providers.

Do not assume that a postcode uniquely identifies a property or determines licensing applicability.

### 8.3 Landlord management

Implement:

- Individual and corporate landlord profiles.
- Contact details.
- Associated properties.
- Ownership and management relationships.
- Responsibility allocation.
- Document records.
- Landlord communications.
- Landlord portal invitations.
- Activity history.

Support multiple landlords associated with a property where appropriate.

Collect only necessary personal information.

### 8.4 Tenancy management

Implement:

- Tenancy creation.
- Tenant associations.
- Tenancy start and end dates.
- Tenancy status.
- Occupancy information.
- Deposit protection evidence.
- Prescribed information records.
- Right-to-rent evidence tracking.
- Statutory document delivery.
- Rent increase notice records.
- Tenancy history.
- Relevant communications.
- Document acknowledgements.

Do not implement tenant referencing, rent collection, accounting or automated eviction decision-making.

Ensure tenancy workflows support versioned regulatory requirements and transitional provisions.

### 8.5 Regulatory intelligence engine

This is a core intellectual property asset.

Build a configurable, deterministic, version-controlled regulatory rules engine.

Each regulatory rule must support:

- Unique rule identifier.
- Rule title.
- Description.
- Jurisdiction.
- Local authority.
- Geographical applicability.
- Property characteristics.
- Occupancy conditions.
- Effective date.
- Expiry or repeal date.
- Transitional provisions.
- Exceptions.
- Required evidence.
- Responsible party.
- Deadline calculation.
- Official source URL.
- Source publication date.
- Last verification date.
- Rule version.
- Review status.
- Reviewer identity.
- Approval timestamp.
- Change history.

Support structured, declarative applicability conditions rather than arbitrary executable code.

Use three-valued applicability evaluation:

- Applicable.
- Not applicable.
- Unknown or insufficient information.

Never classify a property as compliant when required applicability information is missing.

Support historical evaluations using the rules effective on a specified date.

Provide a rule explanation showing why an obligation applies or does not apply.

Implement deterministic deadline calculations and comprehensive boundary-date tests.

Never allow AI-generated regulatory content to become authoritative without human approval.

### 8.6 Licensing intelligence

Support:

- Mandatory HMO licensing.
- Additional licensing.
- Selective licensing.
- Licence conditions.
- Licensing exemptions.
- Scheme commencement and expiry.
- Property-level applicability.
- Local authority licensing schemes.
- Geographical boundaries.
- Licence application records.
- Licence renewal tracking.

Treat Article 4 planning restrictions as a separate planning assessment, not as a licensing requirement.

Use PostGIS where justified for geographical applicability.

Support address-level or polygon-based scheme coverage where reliable data is available.

Do not assume an entire council area is covered by a scheme.

Begin with a limited set of verified councils selected according to customer demand.

Unsupported or unverified council coverage must be clearly identified.

Never fabricate licensing scheme data.

### 8.7 Regulatory content administration

Build a dedicated administration interface for authorised regulatory researchers and reviewers.

Support:

- Draft rules.
- Source document attachment.
- Regulatory research notes.
- Review queues.
- Rule comparison.
- Approval and rejection.
- Publication.
- Scheduled activation.
- Superseding rules.
- Rule withdrawal.
- Historical versions.
- Impact assessment.
- Affected property identification.

Require separation between rule authorship and approval for production regulatory content.

Implement regulatory source monitoring using approved sources, scheduled change detection and human review.

Respect source access conditions, copyright, licensing and rate limits.

Changes detected automatically must create review tasks, not silently modify published rules.

### 8.8 Compliance obligation engine

Convert applicable regulatory rules into property-specific obligations.

Each obligation must include:

- Property or tenancy association.
- Regulatory rule version.
- Applicability status.
- Evidence requirements.
- Responsible party.
- Assigned user.
- Due date.
- Priority.
- Workflow status.
- Verification status.
- Supporting evidence.
- Review history.
- Resolution history.

Keep applicability, evidence status, deadline status and compliance assessment separate.

Do not collapse these dimensions into a misleading single boolean.

Support states such as:

- Unknown applicability.
- Not applicable.
- Evidence missing.
- Evidence submitted.
- Review required.
- Evidence accepted.
- Evidence rejected.
- Due soon.
- Overdue.
- Action completed.
- Superseded.

Use a deterministic state machine for permitted workflow transitions.

Prevent invalid transitions and unauthorised approvals.

### 8.9 Intelligent certificate vault

Support:

- Gas safety records.
- Electrical installation condition reports.
- Energy performance certificates.
- Property licences.
- Fire safety documentation.
- Smoke and carbon monoxide alarm records.
- Insurance documents.
- Other configurable evidence types.

Implement:

- Secure document upload.
- Document categorisation.
- Document versioning.
- Document metadata.
- Expiry tracking.
- Review workflows.
- Duplicate detection.
- Property association.
- Document search.
- Certificate renewal reminders.
- Email-to-document ingestion.
- Bulk document processing.

Use private object storage with short-lived authorised access URLs.

Never expose document buckets publicly.

### 8.10 AI-assisted document extraction

Implement a provider-agnostic document extraction service.

Support extraction of:

- Property address.
- Document type.
- Certificate reference.
- Issue date.
- Expiry date.
- Inspection date.
- Relevant certificate outcomes.
- Issuing organisation.
- Other configured metadata.

Treat uploaded document content as untrusted data.

Protect against document-based prompt injection.

Require structured output validated against explicit schemas.

Use confidence thresholds and human review.

Preserve original documents and extraction history.

AI extraction must never automatically determine legal compliance or publish authoritative regulatory rules.

Avoid transmitting unnecessary personal information to external AI providers.

Provide a configurable manual processing fallback.

### 8.11 Property Compliance Passport

Build the flagship feature.

Every property must have a continuously updated digital compliance passport containing:

- Property profile.
- Applicable regulatory obligations.
- Supporting source references.
- Certificate records.
- Licensing records.
- Tenancy compliance evidence.
- Registration readiness.
- Outstanding actions.
- Responsible individuals.
- Verification history.
- Historical changes.
- Evidence integrity information.

Support current and historical passport views.

Support secure, read-only, expiring and revocable sharing.

Allow selective disclosure so landlords and external reviewers only see authorised information.

Do not expose tenant identity documents or unrelated personal information through shared passports.

Label the passport clearly as an evidence record, not an official government compliance certificate.

### 8.12 Evidence integrity and audit ledger

Implement a tamper-evident audit and evidence system without requiring a public blockchain.

Use:

- SHA-256 document hashes.
- Canonical event serialisation.
- Append-only audit events.
- Tenant-scoped event sequences.
- Previous-event hashes.
- Cryptographic integrity verification.
- Periodic signed checkpoints using managed keys.
- Protected checkpoint storage.
- Trusted server timestamps.
- Actor attribution.
- Event correlation identifiers.

Address concurrent event creation and transaction consistency.

Audit events must record:

- Event identifier.
- Organisation identifier.
- Actor identifier.
- Event type.
- Resource identifier.
- Timestamp.
- Previous event hash.
- Current event hash.
- Relevant non-sensitive metadata.

Avoid storing raw personal information, credentials or sensitive document contents in immutable audit records.

Implement lawful retention, deletion and redaction workflows for personal data without misleadingly claiming that deleted evidence remains available.

Clearly document the difference between tamper-evident and tamper-proof records.

Provide integrity verification tests and an authorised verification interface.

### 8.13 Proof-of-service

Implement evidence tracking for statutory and tenancy-related communications.

Support:

- Document selection.
- Recipient selection.
- Delivery channel.
- Document version.
- Document hash.
- Dispatch timestamp.
- Provider message identifier.
- Delivery status.
- Failure status.
- Recipient acknowledgement.
- Supporting manual evidence.
- Retry history.
- Communication timeline.

Distinguish between:

- Created.
- Queued.
- Sent.
- Provider accepted.
- Delivered.
- Failed.
- Acknowledged.
- Manually evidenced.

Do not claim that an email delivery event or acknowledgement automatically establishes legally effective service.

Preserve the relevant document version associated with each communication.

### 8.14 PRS registration readiness

Implement a configurable readiness module for the government's private rented sector registration requirements.

Support:

- Registration information checklists.
- Landlord information readiness.
- Property information readiness.
- Required evidence.
- Regional deadlines.
- Missing information detection.
- Registration reference recording.
- Bulk data preparation.
- Export functionality.
- Registration status tracking.

Only implement direct government submissions when an official, authorised integration is available.

Do not fabricate government API endpoints.

Do not hardcode speculative regulatory dates.

All requirements must be sourced, versioned and reviewed.

### 8.15 Compliance dashboard

Build an actionable portfolio-wide dashboard.

Display:

- Total managed properties.
- Properties requiring urgent attention.
- Outstanding obligations.
- Upcoming deadlines.
- Missing evidence.
- Expired certificates.
- Licensing review requirements.
- Unknown regulatory applicability.
- Registration readiness.
- Evidence completeness.
- Assigned tasks.
- Recent regulatory changes.
- Recent activity.

Provide filters by:

- Branch.
- Council.
- Property manager.
- Landlord.
- Property type.
- Obligation category.
- Urgency.
- Evidence status.
- Date range.

Clearly distinguish evidence completeness from actual legal compliance.

Avoid unsupported compliance scores or speculative financial penalty estimates.

Show statutory consequences only where supported by verified regulatory sources.

### 8.16 Tasks and workflow management

Implement:

- Task creation.
- Automatic task generation.
- Assignment.
- Due dates.
- Priority.
- Comments.
- Supporting evidence.
- Reminders.
- Escalations.
- Review and approval.
- Completion history.
- Reopening.
- Bulk assignment.

Ensure automatic task creation is idempotent.

Support configurable escalation policies.

### 8.17 Notification engine

Support:

- In-app notifications.
- Email notifications.
- Notification preferences.
- Daily and weekly digests.
- Deadline reminders.
- Certificate expiry alerts.
- Regulatory change alerts.
- Task assignments.
- Escalation notifications.

Use durable asynchronous processing.

Implement retries, exponential backoff, deduplication and dead-letter handling.

Use the Europe/London timezone for applicable business deadlines while storing timestamps consistently in UTC.

Correctly handle daylight saving changes.

Prevent notification flooding.

### 8.18 Evidence pack generation

Implement PDF and ZIP evidence exports.

Support:

- Single-property exports.
- Selected-property exports.
- Portfolio exports.
- Historical date-based exports.
- Custom date ranges.
- Selective disclosure.
- Redacted exports.
- Evidence manifests.
- Regulatory source references.
- Document hashes.
- Audit history.
- Integrity verification information.

Generate large exports asynchronously.

Use authorised, short-lived download links.

Protect against archive path traversal, excessive resource consumption and unauthorised data disclosure.

Record export activity in the audit trail.

### 8.19 Landlord portal

Implement a separate, restricted landlord experience.

Landlords can view:

- Their authorised properties.
- Evidence status.
- Upcoming obligations.
- Outstanding actions.
- Relevant documents.
- Shared compliance passports.
- Agency updates.

Landlords must not access other landlords' information, internal agency notes, unrelated tenant information or administrative functions.

### 8.20 Agency-level compliance

Implement configurable obligations for the agency itself, including applicable:

- Client money protection requirements.
- Redress scheme membership.
- Data protection responsibilities.
- AML obligations.
- Insurance records.
- Staff training.
- Internal policies.

Applicability must be determined by verified rules and agency characteristics.

Do not assume every obligation applies to every agency.

---

## 9. Billing and subscriptions

Use Stripe Billing through official, supported integration mechanisms.

Implement the following proposed plans:

### Core

- £1 per property per month.
- Minimum £99 per month.
- Regulatory intelligence.
- Compliance passports.
- Certificate vault.
- Tenancy evidence.
- PRS readiness.
- Standard evidence packs.
- Notifications.

### Professional

- £1.50 per property per month.
- Minimum £249 per month.
- Core functionality.
- PMS integrations.
- Landlord portal.
- Multi-branch management.
- Advanced reporting.
- Agency-level compliance.
- Priority support.

### Enterprise

- Custom pricing starting from £499 per month.
- Negotiated capabilities and support.

### Additional revenue

- Assisted onboarding: £495–£1,500.
- Regulatory data API: future offering.
- Annual subscription discount: approximately two months free.

### Billing requirements

- Secure hosted checkout.
- Customer billing portal.
- Monthly and annual subscriptions.
- Property-based subscription quantities.
- Plan entitlements.
- Upgrade and downgrade workflows.
- Invoice history.
- Payment failure handling.
- Grace periods.
- Subscription cancellation.
- Tax and VAT configuration.
- Webhook signature verification.
- Webhook replay protection.
- Idempotent webhook processing.
- Billing reconciliation.
- Auditable billing quantity calculations.

Use integer minor currency units or appropriate decimal monetary types.

Never use floating-point arithmetic for money.

Never store raw card information.

Enforce subscription entitlements at the backend.

Do not delete customer compliance records automatically because a payment fails.

Provide appropriate restricted access, export and retention policies following cancellation.

Use Stripe test mode during development.

---

## 10. External integrations

Design an integration framework supporting future connections to:

- Reapit.
- Alto.
- Street.co.uk.
- Arthur.
- Address lookup providers.
- EPC data sources.
- Email providers.
- Document extraction providers.
- Approved government services.

Implement provider interfaces, configuration, credential management, synchronisation status, retries, error handling and audit records.

Use only official, documented and authorised APIs.

Do not invent endpoints or claim that an integration works without valid credentials and verification.

Prioritise CSV import and export before expensive integrations.

---

## 11. User interface and design system

Build a premium, modern, professional B2B SaaS interface.

The application should feel trustworthy, efficient and suitable for a regulated property business.

Avoid generic AI-generated dashboard aesthetics, excessive gradients, decorative animations and unnecessary visual clutter.

### Visual direction

Use:

- Deep navy and slate tones.
- Restrained teal or emerald accents.
- Neutral backgrounds.
- Clear typography.
- Consistent spacing.
- Accessible status colours.
- Subtle borders.
- Carefully designed tables.
- Professional charts.
- Responsive layouts.
- Light and dark themes.

Use colour alongside text and icons rather than as the only indicator of status.

### Application shell

Implement:

- Collapsible sidebar.
- Organisation switcher.
- Branch selector.
- Global search.
- Notification centre.
- User profile menu.
- Breadcrumbs.
- Contextual page actions.
- Responsive mobile navigation.

### Primary navigation

- Overview.
- Properties.
- Landlords.
- Tenancies.
- Compliance.
- Licensing.
- Certificates.
- Documents.
- Tasks.
- Regulatory Updates.
- Evidence Packs.
- Reports.
- Integrations.
- Team.
- Billing.
- Settings.

Provide separate platform administration navigation.

### Property detail interface

Create a property workspace with tabs for:

- Overview.
- Compliance Passport.
- Obligations.
- Licensing.
- Certificates.
- Documents.
- Tenancies.
- Communications.
- Tasks.
- Audit History.

### User experience requirements

Every relevant screen must include:

- Loading states.
- Skeleton states.
- Empty states.
- Error states.
- Permission-denied states.
- Success feedback.
- Accessible validation messages.
- Confirmation dialogs for consequential operations.
- Pagination.
- Search and filtering.
- Responsive behaviour.
- Keyboard navigation.

Meet WCAG 2.2 AA accessibility requirements as a design and testing target.

Use semantic HTML and accessible component primitives.

Use British English throughout.

Use GBP currency formatting and UK date conventions.

---

## 12. Database architecture

Design a normalised PostgreSQL schema.

Create appropriate entities for:

- Organisations.
- Branches.
- Users.
- Memberships.
- Roles.
- Permissions.
- Properties.
- Property addresses.
- Landlords.
- Property ownership relationships.
- Tenancies.
- Tenants.
- Regulatory jurisdictions.
- Local authorities.
- Regulatory sources.
- Regulatory rules.
- Rule versions.
- Licensing schemes.
- Licensing boundaries.
- Property licences.
- Compliance obligations.
- Obligation assessments.
- Documents.
- Document versions.
- Certificates.
- Evidence records.
- Evidence reviews.
- Compliance passports.
- Shared access grants.
- Communications.
- Delivery events.
- Tasks.
- Notifications.
- Audit events.
- Audit checkpoints.
- Export jobs.
- Subscriptions.
- Billing events.
- Integration connections.
- Synchronisation jobs.
- Outbox events.
- Idempotency records.

Use UUID identifiers where appropriate.

Implement:

- Foreign key constraints.
- Tenant-aware relationships.
- Unique constraints.
- Check constraints.
- Appropriate indexes.
- Optimistic locking.
- Explicit transaction boundaries.
- Version history.
- Consistent timestamps.
- Lawful retention policies.

Avoid storing business-critical relational information in unstructured JSON without justification.

Use JSONB for genuinely flexible metadata or structured rule definitions where appropriate.

Use Flyway for every schema change.

Never enable automatic destructive schema updates in production.

Provide an entity relationship diagram and data dictionary.

---

## 13. API design

Implement RESTful APIs under `/api/v1`.

Use consistent resource naming, pagination, filtering and sorting.

Use RFC 9457 Problem Details for structured error responses.

Generate OpenAPI documentation.

Include correlation identifiers.

Implement appropriate HTTP status codes.

Use request DTOs and response DTOs rather than exposing persistence entities directly.

Validate all inputs.

Prevent mass assignment.

Support idempotency keys for operations where duplicate execution could create inconsistent state.

Use optimistic concurrency controls for conflicting updates where appropriate.

Document API permissions, request schemas, response schemas and error conditions.

Never expose internal stack traces or database errors to clients.

---

## 14. Mandatory security requirements

Security is a release-blocking requirement.

Use OWASP ASVS Level 2 as the minimum verification target, with stronger controls for sensitive document handling, administrative operations and tenant isolation.

Use OWASP Top 10 and OWASP API Security Top 10 as supporting guidance.

Do not claim certification or compliance solely because controls have been implemented.

### Application security

Implement protections against:

- Broken access control.
- Insecure direct object references.
- Cross-tenant access.
- SQL injection.
- Cross-site scripting.
- Cross-site request forgery.
- Server-side request forgery.
- Path traversal.
- Mass assignment.
- Authentication bypass.
- Session fixation.
- Session hijacking.
- Open redirects.
- Unsafe deserialisation.
- Unrestricted resource consumption.
- Malicious file uploads.
- Webhook forgery.
- Sensitive information disclosure.
- Dependency vulnerabilities.
- Race conditions.
- Replay attacks.
- Business logic abuse.

### Browser security

Configure:

- Content Security Policy.
- Strict Transport Security in production.
- X-Content-Type-Options.
- Referrer-Policy.
- Permissions-Policy.
- Frame protection.
- Restrictive CORS.
- Secure cookies.
- CSRF protection for cookie-authenticated requests.

Avoid unsafe inline scripts and unnecessarily permissive CSP rules.

### File upload security

Implement:

- File size limits.
- Allowed file types.
- Content-based file validation.
- File extension validation.
- Malware scanning.
- Quarantine storage.
- Safe document parsing.
- Resource limits.
- Randomised object identifiers.
- Authorised download access.
- Document processing isolation.

Do not make uploaded files available until required security checks complete.

Protect against archive bombs, malformed documents and embedded active content.

### Data protection

Implement:

- TLS in transit.
- Encryption at rest.
- Managed encryption keys.
- Secrets management.
- Restricted database access.
- Private storage.
- Sensitive field protection where justified.
- Data minimisation.
- Access logging.
- Data retention.
- Secure deletion.
- Backup encryption.
- Environment separation.

Never log credentials, session tokens, raw identity documents, unnecessary personal data or complete sensitive request bodies.

### API protection

Implement:

- Request size limits.
- Rate limiting.
- Per-tenant quotas where appropriate.
- Pagination limits.
- Timeouts.
- Idempotency.
- Webhook signature verification.
- Replay protection.
- External service circuit breakers.
- Safe error responses.

### Security governance

Create:

- Threat model.
- Data flow diagrams.
- Asset inventory.
- Security control matrix.
- Security testing plan.
- Vulnerability disclosure policy.
- Incident response plan.
- Privileged access policy.
- Secrets rotation policy.
- Dependency update policy.
- Security release checklist.

Use STRIDE or an equivalent structured threat-modelling methodology.

---

## 15. UK GDPR and regulatory safeguards

Design the platform to support UK GDPR and Data Protection Act obligations.

Implement technical capabilities supporting:

- Data access requests.
- Data export.
- Rectification.
- Erasure where legally applicable.
- Processing restriction.
- Retention schedules.
- Legal holds.
- Data processing records.
- Subprocessor transparency.
- Personal data incident management.

Document controller and processor responsibilities.

Identify personal data categories and their purposes.

Collect the minimum information necessary.

Keep sensitive personal information out of immutable audit events.

Document data flows to external providers.

Do not use customer documents for AI model training without an appropriate lawful basis and contractual authorisation.

Prepare documentation for professional legal and data protection review.

Support Cyber Essentials readiness, but do not claim certification.

---

## 16. Background jobs and reliability

Use durable background processing for:

- CSV imports.
- Document scanning.
- AI extraction.
- Regulatory source monitoring.
- Rule impact evaluation.
- Notification delivery.
- Evidence pack generation.
- Billing reconciliation.
- Integration synchronisation.
- Retention processing.

Implement:

- Transactional outbox.
- Idempotent consumers.
- Retry policies.
- Exponential backoff.
- Dead-letter handling.
- Job status tracking.
- Correlation identifiers.
- Concurrency controls.
- Failure recovery.
- Scheduled job locking.

Ensure interrupted operations can recover safely.

Do not claim exactly-once delivery where infrastructure provides at-least-once semantics.

Prevent duplicate side effects through idempotent processing.

---

## 17. Observability

Implement production-grade observability.

Use structured logging, distributed tracing, metrics and health checks.

Monitor:

- Request latency.
- Error rates.
- Authentication failures.
- Authorisation failures.
- Database performance.
- Background job failures.
- Queue depth.
- Document processing failures.
- Notification delivery failures.
- Billing webhook failures.
- Integration failures.
- Regulatory source monitoring failures.
- Storage usage.
- Application availability.

Use OpenTelemetry and Micrometer.

Create operational dashboards and alert definitions.

Avoid high-cardinality labels containing personal information or property addresses.

Expose only appropriate health information publicly.

Protect detailed operational endpoints.

---

## 18. Testing strategy

Testing is mandatory for every implemented module.

### Backend testing

Implement:

- Unit tests.
- Domain behaviour tests.
- Integration tests.
- Repository tests.
- API tests.
- Transaction tests.
- Concurrency tests.
- Authorisation tests.
- Tenant isolation tests.
- Migration tests.
- Idempotency tests.
- Architecture tests.
- Regulatory rule boundary tests.
- Audit integrity tests.

Use Testcontainers with real PostgreSQL and relevant supporting services.

Do not rely exclusively on mocked repositories or in-memory databases.

### Frontend testing

Implement:

- Component tests.
- Form validation tests.
- Routing tests.
- Permission-based rendering tests.
- Accessibility tests.
- API integration tests.
- Error handling tests.
- Responsive layout tests.

### End-to-end testing

Use Playwright to test:

1. Organisation onboarding.
2. User invitation.
3. Authentication and MFA flows where supported.
4. Property import.
5. Property creation.
6. Regulatory applicability assessment.
7. Certificate upload and review.
8. Compliance obligation generation.
9. Task assignment.
10. Proof-of-service recording.
11. Compliance Passport generation.
12. Secure passport sharing.
13. Evidence pack generation.
14. Subscription checkout in test mode.
15. Cross-tenant access rejection.
16. Landlord portal restrictions.
17. Regulatory rule publication.
18. Audit integrity verification.

### Quality gates

Target at least 80% meaningful coverage for core business logic.

Require comprehensive behavioural coverage for security-critical and financial workflows.

Do not write superficial tests merely to increase coverage percentages.

All required tests must pass before a milestone is considered complete.

---

## 19. DevSecOps and CI/CD

Create GitHub Actions workflows for:

- Dependency installation.
- Frontend linting.
- Backend linting and static analysis.
- Type checking.
- Unit testing.
- Integration testing.
- Architecture testing.
- End-to-end testing.
- Production builds.
- Dependency vulnerability scanning.
- Secret scanning.
- Container scanning.
- Infrastructure validation.
- Software bill of materials generation.

Use appropriate tools such as:

- CodeQL.
- Semgrep.
- Gitleaks.
- Trivy.
- Dependabot.
- OWASP ZAP for authorised test environments.

Pin CI dependencies appropriately.

Use least-privilege workflow permissions.

Use short-lived cloud credentials through workload identity federation where available.

Never commit production secrets.

Block releases containing unresolved critical vulnerabilities and require documented review of other material findings.

Create separate development, staging and production environments.

Production deployments require explicit approval.

Do not provision billable infrastructure, publish a production deployment or activate paid external services without authorisation.

---

## 20. Infrastructure and disaster recovery

Use Terraform modules to define infrastructure.

Implement:

- Private database networking.
- Restricted security groups.
- HTTPS.
- Application load balancing.
- Managed secrets.
- Encrypted storage.
- Database backups.
- Point-in-time recovery.
- Object storage lifecycle policies.
- Monitoring.
- Budget alerts.
- Environment isolation.
- Least-privilege IAM policies.

Define initial recovery targets:

- RPO: 15 minutes or better where feasible.
- RTO: four hours or better where feasible.

Treat these as targets until verified through recovery exercises.

Document backup restoration procedures.

Test recovery before production launch.

Provide rollback and migration recovery strategies.

Avoid destructive production infrastructure operations.

---

## 21. Performance and scalability

Design for incremental growth.

Initial performance targets:

- Support at least 500 organisations.
- Support at least 250,000 property records.
- Support large document portfolios.
- Support concurrent agency users.
- Maintain responsive portfolio dashboards.
- Process large imports asynchronously.

Aim for:

- P95 under 300 milliseconds for ordinary database-backed read endpoints under defined test conditions.
- P95 under 500 milliseconds for ordinary write endpoints under defined test conditions.
- Fast initial dashboard rendering.
- Efficient pagination.
- Indexed filtering.
- Controlled background job concurrency.

External AI processing, file transfers and large reports are excluded from ordinary request latency targets.

Validate performance through repeatable load testing.

Do not claim scalability targets have been achieved without measurement.

Avoid N+1 queries, unbounded queries, unnecessary database round trips and excessive frontend re-rendering.

---

## 22. Public marketing website

Build a modern public-facing website alongside the authenticated application.

Include:

- Homepage.
- Product overview.
- Features.
- Property Compliance Passport explanation.
- Licensing intelligence explanation.
- Pricing.
- Security and trust.
- Frequently asked questions.
- Contact.
- Request a demonstration.
- Free portfolio assessment.
- Privacy notice.
- Terms of service.
- Cookie information.
- Login.
- Registration or pilot application.

Position ComplyLet as a compliance infrastructure platform, not a general property management system.

Use accurate marketing language.

Do not fabricate testimonials, customer logos, regulatory endorsements, partnerships, security certifications or performance statistics.

Implement appropriate SEO metadata and accessible responsive layouts.

The free portfolio assessment must have clear privacy information, limited data collection and secure upload handling.

---

## 23. Platform administration

Create a restricted internal administration console.

Support:

- Organisation management.
- Subscription visibility.
- Regulatory content administration.
- Council coverage management.
- Rule review and publication.
- System health.
- Background job monitoring.
- Integration monitoring.
- Security event review.
- Support workflows.
- Feature flag management.
- Usage monitoring.

Do not implement unrestricted customer impersonation.

Any exceptional support access must be explicitly authorised, narrowly scoped and audited.

---

## 24. Documentation requirements

Create and maintain:

- Product requirements document.
- System architecture document.
- Entity relationship diagram.
- Database data dictionary.
- API documentation.
- Permission matrix.
- Threat model.
- Security architecture.
- Regulatory data governance policy.
- AI processing policy.
- Testing strategy.
- Deployment guide.
- Local development guide.
- Incident response guide.
- Backup and recovery guide.
- Operational runbooks.
- Architecture decision records.
- Known limitations.
- Production readiness checklist.

Documentation must reflect actual implementation.

Update documentation whenever relevant behaviour changes.

---

## 25. Implementation phases

Implement the application incrementally.

Do not attempt to generate the entire application in one unreviewed operation.

### Phase 0 — Discovery and architecture

- Inspect the existing repository.
- Identify existing code and dependencies.
- Preserve valid existing functionality.
- Produce the product requirements document.
- Produce architecture diagrams.
- Define module boundaries.
- Design the database.
- Define the security architecture.
- Create the threat model.
- Create the permission matrix.
- Establish the implementation backlog.
- Document assumptions and unresolved decisions.

### Phase 1 — Engineering foundation

- Initialise the monorepo.
- Configure React and TypeScript.
- Configure Spring Boot.
- Configure PostgreSQL and Flyway.
- Configure local development services.
- Establish coding standards.
- Establish testing infrastructure.
- Establish CI pipelines.
- Implement the design system.
- Implement the application shell.
- Implement identity and authentication.
- Implement organisation membership.
- Implement tenant isolation.
- Implement authorisation.
- Implement initial audit infrastructure.

Tenant isolation tests must pass before building tenant-owned business modules.

### Phase 2 — Property portfolio

- Organisation onboarding.
- Branch management.
- Property management.
- Landlord management.
- Tenancy management.
- Address lookup abstraction.
- CSV import.
- Property workspace.
- Portfolio search and filtering.

### Phase 3 — Regulatory intelligence

- Regulatory data model.
- Rule versioning.
- Regulatory content administration.
- Licensing intelligence.
- Geographical applicability.
- Deterministic rule evaluation.
- Historical rule evaluation.
- Compliance obligation generation.
- Responsibility allocation.
- Regulatory impact assessment.

Use clearly labelled synthetic fixtures for development and tests.

Only verified and approved regulatory data may be published in production.

### Phase 4 — Documents and evidence

- Secure document upload.
- Malware scanning.
- Certificate vault.
- AI extraction abstraction.
- Document review.
- Certificate expiry monitoring.
- Evidence records.
- Evidence integrity.
- Audit ledger.
- Signed checkpoints.
- Compliance Passport.

### Phase 5 — Operational workflows

- Task management.
- Notifications.
- Escalations.
- Compliance dashboard.
- Proof-of-service.
- PRS registration readiness.
- Evidence pack generation.
- Secure passport sharing.

### Phase 6 — Commercial readiness

- Stripe Billing.
- Subscription plans.
- Entitlement enforcement.
- Billing reconciliation.
- Customer billing portal.
- Public marketing website.
- Free portfolio assessment.
- Platform administration.
- Customer onboarding improvements.

At this point, prepare the MVP for controlled paid pilots.

### Phase 7 — Expansion features

Implement only after the MVP is stable:

- Landlord portal.
- Multi-branch advanced controls.
- First verified PMS integration.
- Agency-level compliance.
- Advanced analytics.
- Regulatory source monitoring.
- Expanded council coverage.
- Enterprise reporting.

### Phase 8 — Production hardening

- Complete threat model review.
- Complete security control verification.
- Complete tenant isolation testing.
- Complete accessibility testing.
- Complete performance testing.
- Complete dependency scanning.
- Complete infrastructure validation.
- Complete backup restoration exercises.
- Complete incident response documentation.
- Complete operational dashboards.
- Prepare staging deployment.
- Produce production readiness report.

Do not describe the platform as production-ready while release-blocking issues remain.

### Phase 9 — Future expansion

Document, but do not prematurely implement:

- Regulatory intelligence API.
- Insurer integrations.
- Institutional landlord features.
- Additional UK jurisdictions.
- Applicable damp and mould workflows.
- Additional housing standards workflows.
- Advanced regulatory analytics.

Each future feature requires a validated commercial or regulatory justification.

---

## 26. Persistent Codex repository instructions

Create an `AGENTS.md` file at the repository root containing permanent engineering instructions.

It must require every future coding agent to:

1. Read relevant architecture, product and security documentation before making changes.
2. Inspect existing implementation before creating new functionality.
3. Preserve architectural boundaries.
4. Maintain strict tenant isolation.
5. Enforce backend authorisation.
6. Validate all external inputs.
7. Use database migrations for schema changes.
8. Write meaningful tests.
9. Never fabricate regulatory content.
10. Never expose secrets or personal information.
11. Never weaken security controls to make tests pass.
12. Never silently disable failing tests.
13. Never introduce production mocks.
14. Never make destructive changes without authorisation.
15. Maintain backward compatibility where appropriate.
16. Document material architectural decisions.
17. Update implementation progress.
18. Report unresolved risks truthfully.
19. Verify changes through actual commands and test execution.
20. Avoid unrelated refactoring.

Create `docs/IMPLEMENTATION_PLAN.md` containing the complete milestone plan.

Create `docs/PROGRESS.md` containing:

- Current implementation phase.
- Completed features.
- Pending features.
- In-progress tasks.
- Known defects.
- Security concerns.
- External dependencies.
- Verification results.
- Next recommended task.

Maintain these files throughout development so future Codex sessions can continue without losing project context.

---

## 27. Definition of done

A feature is complete only when:

- Business requirements are implemented.
- Relevant permissions are enforced.
- Tenant isolation is verified.
- Input validation is implemented.
- Database constraints are appropriate.
- Error handling is complete.
- Relevant audit events are recorded.
- Loading and empty states are implemented.
- Accessibility requirements are addressed.
- Relevant tests exist and pass.
- Documentation is updated.
- No known release-blocking security issues remain.
- No mock functionality is present in production paths.

Do not mark partially implemented functionality as complete.

---

## 28. Execution instructions

Begin by inspecting the repository.

If the repository is empty, initialise it according to the architecture described above.

If existing code is present, evaluate it and preserve useful implementation.

Before implementing major functionality:

1. Produce a concise architecture assessment.
2. Identify important assumptions.
3. Create the implementation plan.
4. Establish the persistent repository instructions.
5. Identify security-critical decisions.
6. Define acceptance criteria for the current phase.

Then proceed with implementation.

For each milestone:

- Inspect relevant files.
- Plan the changes.
- Implement the smallest coherent vertical slice.
- Add database migrations where necessary.
- Implement backend functionality.
- Implement frontend functionality.
- Implement security controls.
- Add tests.
- Execute verification commands.
- Fix failures.
- Update documentation.
- Update the progress tracker.

Continue through the implementation phases while the environment and available execution time permit.

When approaching a session or context limit, complete the current coherent task, record the exact state in `docs/PROGRESS.md`, and identify the next task.

Do not repeatedly ask for approval for ordinary implementation decisions.

Request clarification only for consequential unresolved product decisions, missing external credentials, destructive operations, paid infrastructure provisioning or production deployment.

Use sensible engineering defaults for reversible decisions and document them.

Never report that a command, test, build, security scan or deployment succeeded unless it was actually executed successfully.

---

## 29. Final delivery requirements

Deliver a complete, maintainable ComplyLet application containing:

- Production-quality React and TypeScript frontend.
- Secure Java and Spring Boot backend.
- PostgreSQL database and migrations.
- Multi-tenant identity and authorisation.
- Regulatory intelligence engine.
- Property portfolio management.
- Certificate and document management.
- Property Compliance Passports.
- Tamper-evident evidence records.
- Compliance workflows.
- PRS registration readiness.
- Notifications.
- Evidence exports.
- Subscription billing.
- Public marketing website.
- Platform administration.
- Automated tests.
- CI/CD pipelines.
- Infrastructure as code.
- Security documentation.
- Deployment documentation.
- Operational documentation.

Provide documented local development commands.

Aim to support a straightforward local startup process such as:

```bash
make setup
make dev
make test
```

Ensure these commands are actually implemented and documented.

At the end of development, produce a final engineering report covering:

- Implemented functionality.
- Architecture overview.
- Security controls.
- Test results.
- Performance results.
- Known limitations.
- Required external credentials.
- Regulatory content awaiting verification.
- Deployment instructions.
- Estimated infrastructure costs.
- Remaining production launch requirements.

The final application must be secure, professional, modern, commercially focused and architecturally suitable for long-term development.

Build ComplyLet as a serious regulatory technology business, not merely a collection of CRUD endpoints and dashboard screens.

**Begin with Phase 0 and proceed systematically.**