package uk.co.complylet.organisations;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
class Workspaces {
    private final JdbcClient database;

    Workspaces(JdbcClient database) {
        this.database = database;
    }

    record Workspace(UUID id, String name, String role) {}

    @Transactional(readOnly = true)
    public List<Workspace> list(String issuer, String subject, UUID after) {
        bindActor(issuer, subject);
        return database.sql("""
                SELECT o.id, o.name, m.role FROM organisations o
                JOIN memberships m ON m.organisation_id = o.id
                WHERE m.issuer = :issuer AND m.subject = :subject AND m.active
                  AND can_open_agency_workspace(m.role)
                  AND (CAST(:after AS uuid) IS NULL OR o.id > :after)
                ORDER BY o.id LIMIT 100
                """).param("issuer", issuer).param("subject", subject).param("after", after)
                .query(Workspace.class).list();
    }

    @Transactional
    public Workspace select(String issuer, String subject, UUID organisation) {
        bindActor(issuer, subject);
        Workspace workspace = database.sql("""
                SELECT o.id, o.name, m.role FROM organisations o
                JOIN memberships m ON m.organisation_id = o.id
                WHERE o.id = :organisation AND m.issuer = :issuer AND m.subject = :subject
                  AND m.active AND can_open_agency_workspace(m.role)
                """).param("organisation", organisation).param("issuer", issuer).param("subject", subject)
                .query(Workspace.class).optional()
                .orElseThrow(Workspaces::unavailable);
        database.sql("SELECT set_config('complylet.organisation', :organisation, true)")
                .param("organisation", organisation.toString()).query(String.class).single();
        // PostgreSQL independently checks role and membership on the write.
        int recorded = database.sql("""
                INSERT INTO audit_events (organisation_id, issuer, subject, action)
                SELECT organisation_id, issuer, subject, 'WORKSPACE_SELECTED'
                FROM memberships
                WHERE organisation_id = :organisation AND issuer = :issuer AND subject = :subject
                  AND active AND role = :role
                """).param("organisation", organisation).param("issuer", issuer).param("subject", subject)
                .param("role", workspace.role()).update();
        if (recorded == 0) {
            throw unavailable();
        }
        return workspace;
    }

    private static ResponseStatusException unavailable() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Workspace unavailable");
    }

    private void bindActor(String issuer, String subject) {
        database.sql("SELECT set_config('complylet.issuer', :issuer, true)")
                .param("issuer", issuer).query(String.class).single();
        database.sql("SELECT set_config('complylet.subject', :subject, true)")
                .param("subject", subject).query(String.class).single();
    }
}
