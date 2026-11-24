# ADR 0001 — OIDC BFF and shared PostgreSQL

Use OIDC with server-side sessions, and keep role and membership decisions in PostgreSQL. Identify users by issuer and subject, allowing email changes without transferring access. Select workspace per request to support independent browser tabs. Recheck membership in every transaction. Bind actor and tenant through transaction-local PostgreSQL settings and restrict runtime grants. A successful workspace selection writes an audit event in the same transaction. Production requires shared sessions, revocation, and trusted TLS ingress before rollout.
