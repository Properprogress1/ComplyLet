-- Local development and ephemeral test credentials.
CREATE ROLE complylet_migration LOGIN PASSWORD 'local-migration';
CREATE ROLE complylet_runtime LOGIN PASSWORD 'local-runtime' NOSUPERUSER NOBYPASSRLS NOCREATEROLE NOCREATEDB NOINHERIT;
REVOKE ALL ON DATABASE complylet FROM PUBLIC;
GRANT CONNECT ON DATABASE complylet TO complylet_migration, complylet_runtime;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
ALTER SCHEMA public OWNER TO complylet_migration;
GRANT USAGE ON SCHEMA public TO complylet_runtime;
