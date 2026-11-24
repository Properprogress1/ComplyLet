# Foundation API

All API operations use a same-origin server session. The OIDC sign-in entry point is `GET /oauth2/authorization/complylet`. The callback uses the configured external origin. Logout uses `POST /logout` with the session’s CSRF token.

| Operation | Result | Scope |
|---|---|---|
| `GET /api/v1/session` | CSRF token and header name | Verified OIDC identity |
| `GET /api/v1/workspaces?after={uuid}` | Up to 100 workspace IDs, names and roles ordered by UUID | Active agency memberships of the caller |
| `POST /api/v1/workspaces/{id}/selection` | Selected workspace summary; writes an audit event | Active agency membership of the caller in the named workspace and valid CSRF |

Unknown and inaccessible workspaces share the same 404 response. The selection result is local to the calling UI. Future tenant routes must bind the workspace on each request after validating membership and resource authority. OpenAPI JSON is available at `/v3/api-docs` to signed-in sessions when explicitly enabled.
