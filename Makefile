.PHONY: setup dev api web seed test e2e

setup:
	test -e .env || cp .env.example .env
	corepack pnpm install --frozen-lockfile

dev:
	docker compose up -d --wait
	@for attempt in $$(seq 1 180); do \
	  if curl -fsS http://localhost:8080/realms/complylet/.well-known/openid-configuration >/dev/null 2>&1; then exit 0; fi; \
	  sleep 2; \
	done; echo 'Keycloak realm unavailable' >&2; exit 1
	$(MAKE) -j2 api web

api:
	set -a; . ./.env; set +a; apps/api/mvnw -f apps/api/pom.xml spring-boot:run

web:
	corepack pnpm --filter @complylet/web dev

seed:
	docker compose exec -T -e PGPASSWORD=local-migration postgres psql -v ON_ERROR_STOP=1 -h localhost -U complylet_migration -d complylet < infrastructure/postgres/local-membership.sql

test:
	apps/api/mvnw -B -f apps/api/pom.xml verify
	corepack pnpm --filter @complylet/web test
	corepack pnpm --filter @complylet/web build

e2e:
	corepack pnpm --filter @complylet/web test:e2e
