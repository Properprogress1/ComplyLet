# ADR 0004 · Keycloak email verification and SMTP

Keep registration, action tokens, email address binding and verification with Keycloak. Configure a verified SMTP sender on the identity provider. Use Mailpit in development, Resend for the initial outbound deployment and the same SMTP contract for a future SES deployment. Keep SMTP secrets in the identity deployment and use the existing OIDC and membership boundaries in the application.

Keycloak renders registration and verification pages so its authentication session, required actions and redirects stay intact. The React application continues to enforce access through the BFF. Service-generated invitations and alerts will use an application-owned notifications contract and outbox when those workflows exist. That service will not generate Keycloak verification links.

Production rollout requires a verified domain, authorised inbox delivery tests, edge abuse controls and delivery monitoring. See [Email configuration](../EMAIL_CONFIGURATION.md).
