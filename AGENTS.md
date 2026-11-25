# ComplyLet engineering instructions

Read the master specification and relevant product, architecture and security documents before changing code. Inspect the existing implementation and preserve working behaviour and appropriate backward compatibility. Keep changes in scope.

Respect modular boundaries and persistence ownership. Validate external inputs and enforce permissions on the backend. Derive tenant context from authorised membership and maintain tenant-scoped queries, transaction-local context, row-level security and tenant-aware relationships. Apply schema changes through Flyway.

Write behavioural tests for changes, particularly authorisation and isolation. Run verification commands and report actual results. Never weaken a control, silence a failing test, invent test results, or introduce production mocks. Never fabricate regulatory content or disclose secrets or personal information. Obtain authorisation for destructive changes and paid or production deployment.

Record material architectural decisions and update the implementation plan and progress tracker. Report unresolved risks and keep the Phase 2 gate closed until Phase 1 authentication, authorisation and isolation pass verification.


