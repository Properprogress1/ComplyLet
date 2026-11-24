ARG WEB_BASE_IMAGE
FROM ${WEB_BASE_IMAGE}
COPY --chown=65532:65532 apps/web/dist/ /srv/
COPY --chown=65532:65532 infrastructure/environments/staging/Caddyfile /etc/caddy/Caddyfile
USER 65532:65532
ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
