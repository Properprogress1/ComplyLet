# ADR 0003 — Browser session revocation

The identity module indexes authenticated servlet sessions by the verified OIDC issuer and subject. This follows the scope of the authentication session across an account’s workspaces. The browser receives a random management identifier, an approximate browser family and sign-in time. The servlet session identifier, full user agent and provider tokens stay outside the management API.

Spring Security registers the session after OIDC authentication and session fixation protection. Logout and idle expiry remove it through the servlet attribute lifecycle. Remote revocation marks the target session unusable for subsequent requests. The security filter clears and invalidates it when presented again. Requests already authorised may finish. Revocation records an application security log event containing only the two management identifiers. Current-session logout continues through the existing OIDC logout flow.

The index and servlet sessions share the existing single-process, in-memory lifetime, so this slice adds no database migration. Workspace membership, tenant scoping and RLS still apply to every workspace request. Production requires a shared revocable session store and provider-side session termination so a browser with a live provider session cannot silently create a new application session after revocation.
