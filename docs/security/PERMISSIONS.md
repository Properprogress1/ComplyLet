# Permission matrix

All workspace operations require verified identity and active membership. Branch and landlord grants restrict future resource access. Workspace switching records an audit event. Membership administration and all business permissions below are planned.

| Role | Open own workspace | Planned resource authority |
|---|---|---|
| Platform Administrator | Only through a separate ordinary membership | Platform operations; exceptional customer access requires approval, expiry and audit |
| Organisation Owner | Yes | Organisation settings, owner transfer, billing and team |
| Organisation Administrator | Yes | Agency settings, team and branch management |
| Compliance Manager | Yes | Manage obligations, workflows and evidence; authorised exports |
| Branch Manager | Yes | Manage assigned branches and their resources |
| Property Manager | Yes | Manage assigned properties and submit evidence |
| Compliance Reviewer | Yes | Review authorised evidence |
| Read-only Auditor | Yes | Read explicitly authorised evidence and audit history |
| Landlord Viewer | No agency workspace access | Read selectively disclosed resources for own assigned properties |

Team administration, owner transfer and sensitive exports require explicit grants and step-up. Public registration confers no agency access. Regulatory publication requires separate reviewer authority.

Browser session visibility and revocation are account-scoped by verified OIDC issuer and subject. They require no tenant role. Only another active session for the same identity can be revoked, with a valid CSRF token. Current-session logout uses the existing OIDC logout flow. OpenAPI access requires a verified sign-in and is disabled by default.

## Proposed controls for future operations

| Operation | Grant | Required scope |
|---|---|---|
| Invite staff and change ordinary memberships | Owner or administrator | Same organisation. Administrators cannot grant ownership or elevate themselves. |
| Transfer ownership and change billing | Owner | Same organisation, step-up, audit, and safeguards against removing the last owner. |
| View or update managed resources | Owner, administrator, compliance manager, branch manager or property manager | Organisation scope refined by branch or explicit resource assignment. |
| Submit evidence | Authorised managers | Permission to update the underlying property or obligation. |
| Approve evidence | Compliance manager or reviewer | Explicit review assignment and separation of duties where required. |
| Read evidence and audit history | Authorised staff or auditor | Explicitly authorised tenant and resource scope. |
| Generate bulk evidence exports | Owner or explicitly delegated compliance manager | Scoped resource set, step-up, audit and revalidation at download. |
| Read landlord-disclosed evidence | Landlord viewer | Explicit own-property grant and field-level disclosure policy. |
| Publish regulatory rules | Regulatory reviewer with delegated publication authority | Global regulatory module, separate author and approver. |
| Access customer data for support | Explicitly approved platform support actor | Time-limited purpose and tenant grant, step-up and comprehensive audit. |

The team, resource, approval, export and platform policies must be verified when their routes are introduced. Any operation without a matching grant is denied.
