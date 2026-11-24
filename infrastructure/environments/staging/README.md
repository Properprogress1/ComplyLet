# ComplyLet foundation staging

This configuration packages Phase 1 for operator-supplied, separate staging with synthetic data. It uses an HTTPS static web gateway and a private API. PostgreSQL and OIDC are external. Use one API instance because sessions are process-local.

1. Obtain approval for the staging host, registry, isolated database and identity provider. Select provenance-verified, digest-pinned Java 21 and Caddy base images. Verify the JVM patch level and scan all exact images.
2. Set the exact HTTPS application origin without a trailing slash and the certificate DNS name. Configure an isolated confidential OIDC client with code flow, PKCE S256, verified email, the exact callback at /login/oauth2/code/complylet and the exact post-logout URI at /. Verify issuer and public DNS resolution.
3. Provision PostgreSQL with certificate verification and a trusted root for the JDBC driver. Provision separate migration and runtime roles following the [database design](../../../docs/architecture/DATABASE.md). Apply Flyway through separate authorised tooling using migration credentials. Confirm schema history, grants and RLS before starting the API.
4. Supply secrets and TLS files through the staging secret manager and ensure the relevant container UID 65532 can read its files. Keep real environment paths in an ignored file such as .env.staging. The operator owns DNS, TLS rotation and private ingress or port forwarding. The gateway binds to host loopback and only exposes the specified HTTPS host.
5. Check dependencies, secrets, image advisories, SBOMs and signature/provenance evidence before deploying.

From the repository root, after building the JAR and frontend with the normal build commands:

    docker compose --env-file infrastructure/environments/staging/validation.env -f infrastructure/environments/staging/compose.yml config --quiet
    docker build --build-arg API_BASE_IMAGE="$REVIEWED_JAVA_IMAGE" -f infrastructure/environments/staging/api.Dockerfile -t complylet-api:staging-build .
    docker build --build-arg WEB_BASE_IMAGE="$REVIEWED_CADDY_IMAGE" -f infrastructure/environments/staging/web.Dockerfile -t complylet-web:staging-build .

Use base images with java and caddy respectively in PATH. Supply resulting image digests in the approved environment configuration. The committed validation file contains reserved example inputs for static checks. The gateway keeps the API and its health endpoint inside the private network. Probe /actuator/health internally.

For an authorised staging rollout, first validate Compose with the real environment file. Use the approved Compose project name and deploy the reviewed images.

    docker compose --env-file .env.staging -f infrastructure/environments/staging/compose.yml config --quiet
    docker compose --env-file .env.staging -f infrastructure/environments/staging/compose.yml up -d --no-build
    docker compose --env-file .env.staging -f infrastructure/environments/staging/compose.yml ps

After staging starts, smoke-test gateway host matching, TLS, HSTS, CSP, Secure/HttpOnly/SameSite and no-store on account responses. Verify OIDC sign-in/logout, cross-workspace denial, CSRF, email verification, session revocation, private route blocking and audit attribution. Exercise startup with unavailable dependencies, process restart, alerts, restore, recovery timing and representative performance.

Check that the web shell, API and blocked private routes omit both `Server` and `X-Powered-By`.

    sh infrastructure/environments/staging/check-response-headers.sh https://staging.example.invalid:8443

Record image digests, migration version, change approval and evidence. To roll back, use the previous reviewed configuration and images if schema compatibility has been checked. If incompatible, follow the approved forward fix or isolated restore procedure and reconcile writes after the restore point.

## Logical recovery rehearsal

Use an approved backup identity and a separate empty restore database on an isolated network. Set connection details through the operator's secret mechanism. Confirm the target name and server before running any restore.

    pg_dump --dbname="$SOURCE_DATABASE" --format=custom --file="$BACKUP_ARCHIVE"
    pg_restore --list "$BACKUP_ARCHIVE"
    pg_restore --exit-on-error --dbname="$ISOLATED_RESTORE_DB" "$BACKUP_ARCHIVE"

Treat the archive as sensitive. Encrypt it, restrict access and apply approved retention. Provision cluster roles before the restore and reconcile database-level CONNECT and schema privileges. Compare row counts and Flyway history, assert the runtime role cannot modify audit events, exercise RLS and verify OIDC/workspace smoke tests against the restored data. Capture elapsed duration and recoverable data age. This rehearsal covers logical restore. Separately exercise the approved managed backup and point-in-time recovery process before launch.
