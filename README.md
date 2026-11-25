# ComplyLet

ComplyLet is a compliance and evidence platform for English letting agencies. The current implementation establishes identity, agency workspace access and isolation.

## Local development

Install a currently patched Java 21 build, Node.js 22.12 or later with Corepack, and Docker with Compose. See the JVM advisory in the [security assessment](docs/security/ASSESSMENT.md) for the minimum patched version and interim mitigation.

```sh
make setup
make dev
```

Open http://localhost:5173. For the optional local workspace fixture, wait for the API at http://localhost:8081/actuator/health, then run `make seed`. The synthetic login is `workspace-owner` with password `local-owner-only`. Mailpit captures registration and recovery email at http://localhost:8025. See [Email configuration](docs/EMAIL_CONFIGURATION.md) for outbound delivery and native Keycloak setup. The development realm and SQL credentials are scoped to this local stack.

`make test` runs architecture and PostgreSQL integration tests via Testcontainers, frontend tests and the production web build. For the browser test, run `corepack pnpm --filter @complylet/web exec playwright install chromium`, seed the running stack and run `make e2e`.

For isolated native PostgreSQL verification, initialise a fresh database named `complylet` using `infrastructure/postgres/01-roles.sql` as a database administrator, then provide its JDBC URL via `COMPLYLET_TEST_DATABASE_URL` to Maven. Integration tests migrate and write synthetic data, so use a disposable database.

Development uses a Vite proxy to keep the browser on the same origin as the BFF. Deployments require a same-origin HTTPS gateway, secure session cookies and a separate Flyway migration step. Local Compose credentials and Keycloak development mode are for loopback use.

See [the specification](docs/MASTER_SPECIFICATION.md), [architecture](docs/architecture/SYSTEM.md) and [project status](docs/PROGRESS.md).

See the [foundation staging configuration](infrastructure/environments/staging/README.md) and [production readiness report](docs/operations/ENGINEERING_READINESS_REPORT.md) for deployment requirements and release gates.
