# ComplyLet email configuration

## Ownership and security

Keycloak owns registration, verification and password recovery. The application accepts its OIDC identity only after checking the trusted `email_verified` claim on protected operations. Successful verification grants no organisation membership. Users who verify in a different browser can return to ComplyLet and sign in for a fresh OIDC session.

The repository provides a Keycloak login and email theme. Keycloak binds its signed verification action to the account, address and client. A fresh browser receives a confirmation page. A browser already holding the matching registration session can complete verification directly from the mail link. Publish the identity issuer at a fixed HTTPS hostname and register exact application callbacks and logout redirects. Keep verification URLs out of access logs, error monitoring, analytics and email click tracking. Keycloak user events may include recipient addresses. Restrict access and configure retention before forwarding events. [Keycloak verification handler](https://github.com/keycloak/keycloak/blob/26.8.2/services/src/main/java/org/keycloak/authentication/actiontoken/verifyemail/VerifyEmailActionTokenHandler.java)

## Local development

Run `make dev` and open the application at http://localhost:5173. Choose **Sign in**, then **Register**, using a synthetic address on `complylet.test`. Retrieve the message at http://localhost:8025. Set a password after proving ownership of the email address. Mailpit captures messages for local testing. With native Keycloak and native Mailpit, set realm SMTP host to `127.0.0.1`, port `1025`, and copy the theme into `KEYCLOAK_HOME/themes/complylet`. With Compose, use hostname `mailpit` and retain the loopback-only inbox binding. Keycloak skips importing a realm that already exists. For an existing realm, apply the settings below in the console without replacing its data.

## Staging and production

A project owner must approve the provider account, verify a domain the project controls and supply credentials through the deployment secret manager. Build the theme into the reviewed Keycloak image or mount it read-only. In **Realm settings**, select `complylet` as the login and email theme, turn on **Verify email**, and set the user-initiated **Email verification** action token lifespan to 30 minutes. In **Authentication → Required actions → Verify Email**, enable the action and configure a 60-second resend cooldown. Enable the `Update Email` required action with forced verification and a 60-second cooldown so authenticated users can correct an address through the Keycloak account console. Preserve the built-in password and MFA required actions. Keep the existing exact OIDC redirects and PKCE settings. Approve the proxy's registration, recovery and verification rate limits before making self-registration public.

| Keycloak SMTP setting | Resend | Amazon SES |
|---|---|---|
| From | Sender on your verified domain | Sender on your verified SES identity |
| From display name | ComplyLet | ComplyLet |
| Host | `smtp.resend.com` | Regional SES SMTP endpoint |
| Port | `587` | `587` |
| Encryption | STARTTLS | STARTTLS |
| Authentication | Enabled | Enabled |
| Username | `resend` | Regional SMTP username |
| Password | Sending API key via Keycloak vault | Regional SMTP password via Keycloak vault |

The variables commented in `.env.example` are operator inputs for the identity deployment. They do not configure an external Keycloak realm by themselves. Use the console or authorised deployment automation to apply realm settings. For the SMTP password field use a Keycloak vault reference such as `${vault.smtp}`. For the file vault with the default resolver, mount the secret at `complylet_smtp` in the vault directory, readable only by the Keycloak runtime. Enable the file vault provider and set its directory in the Keycloak deployment. The Spring BFF and React app require no SMTP credentials. [Keycloak vault configuration](https://www.keycloak.org/docs/latest/server_admin/#_vault)

### Resend setup

1. Add a dedicated sending subdomain, for example `accounts.example.com`. Publish the exact SPF and DKIM records shown by Resend at the names it gives you. Preserve existing DNS records and avoid multiple SPF records at the same DNS name.
2. Configure DMARC for the sending domain according to the project owner's policy. Review alignment and reports before enforcing quarantine or rejection.
3. Disable open and click tracking on the transactional domain. Create a sending-only API key scoped to the domain and store it in the identity deployment's secret manager. Use that key for the SMTP password and rotate it according to the environment's policy.
4. Enter the settings in Keycloak. Keep SMTP debug disabled. Require a successful provider test and a real registration test before releasing the identity deployment. An SMTP rejection or outage leaves users unverified. The external Keycloak service requires its own release gate because the application does not operate it. [Resend domains](https://resend.com/docs/dashboard/domains/introduction), [Resend SMTP configuration](https://resend.com/docs/send-with-smtp)

### Move to SES

Verify the sending identity and DKIM in the chosen region, configure DMARC alignment and a custom MAIL FROM domain if applicable, and obtain production access for that region before sending to unverified recipients. Generate SES SMTP credentials, replace the vault secret and SMTP settings, and repeat delivery checks. Configure the provider's bounce and complaint monitoring and suppression controls. The verification workflow remains in Keycloak. [SES SMTP setup](https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html)

## Acceptance and troubleshooting

Use consenting test inboxes on Gmail, Outlook or Hotmail, Yahoo or RocketMail, iCloud and a business domain after the environment owner authorises outbound testing. Register, check spam or junk, open the link in a separate browser and confirm. Sign in and confirm that verification did not create a membership. Exercise an expired link, replay, an invalid link and a second resend within 60 seconds. Use the Keycloak account workflow to correct an email address and require verification of the new address. Revoke existing application sessions when an operator changes an account's address. For a typo during first registration, use a support-assisted correction after establishing account ownership. Keep the corrected address unverified and require a new verification action.

If the email never appears, check Keycloak's send event and the provider dashboard. SMTP acceptance indicates the provider received the message. Delivery events indicate a receiving mail server accepted it. Check DNS alignment, suppression, bounce or complaint events, expiry, hostname, port, STARTTLS and vault permissions as appropriate. Share timestamps and a provider message ID with support. Keep addresses and action links out of support tickets and logs.

An application-generated notification service and its durable outbox, retries, idempotency, dead-letter handling and authenticated provider webhooks belong to the notifications module. This change uses Keycloak SMTP for identity messages. Provider-side monitoring is the current source of delivery status. Hourly per-email limits, enumeration resistance across native forms, edge rate-limit enforcement and cluster concurrency still need deployment-specific verification.
