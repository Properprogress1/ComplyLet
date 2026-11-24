package uk.co.complylet;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.UUID;
import javax.sql.DataSource;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.MountableFile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = {ComplyLet.class, FoundationTest.TestClient.class},
        properties = "debug=false")
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class FoundationTest {
    private static final String ISSUER = "https://identity.example.test";
    private static final UUID ALPHA = UUID.randomUUID();
    private static final UUID BETA = UUID.randomUUID();
    private static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer("postgres:16")
            .withDatabaseName("complylet")
            .withUsername("postgres")
            .withCopyFileToContainer(MountableFile.forHostPath("../../infrastructure/postgres/01-roles.sql"),
                    "/docker-entrypoint-initdb.d/01-roles.sql");
    private static final String EXTERNAL_URL = System.getenv("COMPLYLET_TEST_DATABASE_URL");

    @Autowired MockMvc http;
    @Autowired DataSource runtime;

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry properties) {
        if (EXTERNAL_URL == null) {
            POSTGRES.start();
        }
        properties.add("DB_URL", FoundationTest::databaseUrl);
        properties.add("DB_PASSWORD", () -> "local-runtime");
        properties.add("DB_MIGRATION_PASSWORD", () -> "local-migration");
        properties.add("FLYWAY_ENABLED", () -> "true");
        properties.add("APP_ORIGIN", () -> "http://localhost:5173");
        properties.add("OIDC_CLIENT_SECRET", () -> "test-secret");
        properties.add("OIDC_ISSUER", () -> ISSUER);
        properties.add("spring.datasource.hikari.maximum-pool-size", () -> "1");
    }

    @BeforeAll
    void seed() throws SQLException {
        try (var connection = migrationConnection();
             var organisation = connection.prepareStatement("INSERT INTO organisations (id, name) VALUES (?, ?)");
             var member = connection.prepareStatement("""
                     INSERT INTO memberships (organisation_id, issuer, subject, role, active)
                     VALUES (?, ?, ?, ?, ?)
                     """)) {
            for (UUID id : new UUID[] {ALPHA, BETA}) {
                organisation.setObject(1, id);
                organisation.setString(2, id.equals(ALPHA) ? "Alpha" : "Beta");
                organisation.executeUpdate();
            }
            addMember(member, ALPHA, "alice", "ORGANISATION_OWNER", true);
            addMember(member, BETA, "bob", "ORGANISATION_OWNER", true);
            addMember(member, BETA, "alice", "COMPLIANCE_MANAGER", false);
            addMember(member, ALPHA, "landlord", "LANDLORD_VIEWER", true);
        }
    }

    private static void addMember(java.sql.PreparedStatement statement, UUID organisation, String subject,
                                  String role, boolean active) throws SQLException {
        statement.setObject(1, organisation);
        statement.setString(2, ISSUER);
        statement.setString(3, subject);
        statement.setString(4, role);
        statement.setBoolean(5, active);
        statement.executeUpdate();
    }

    private static String databaseUrl() {
        return EXTERNAL_URL == null ? POSTGRES.getJdbcUrl() : EXTERNAL_URL;
    }

    private static Connection migrationConnection() throws SQLException {
        return DriverManager.getConnection(databaseUrl(), "complylet_migration", "local-migration");
    }

    private static org.springframework.test.web.servlet.request.RequestPostProcessor user(String subject, boolean verified) {
        return oidcLogin().idToken(token -> token.issuer(ISSUER).subject(subject).claim("email_verified", verified));
    }

    @Test
    void requiresAuthenticatedAndVerifiedIdentity() throws Exception {
        http.perform(get("/api/v1/session")).andExpect(status().isUnauthorized());
        http.perform(get("/api/v1/session").with(user("alice", false))).andExpect(status().isForbidden());
        http.perform(get("/api/v1/session").with(user("alice", true)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.csrfToken").isNotEmpty());
        http.perform(get("/api/v1/workspaces").with(oidcLogin().idToken(token ->
                token.issuer("https://different.example.test").subject("alice").claim("email_verified", true))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void returnsOnlyActiveAgencyMembershipsAndHidesForeignWorkspaceExistence() throws Exception {
        http.perform(get("/api/v1/workspaces").with(user("alice", true)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(ALPHA.toString()));
        http.perform(get("/api/v1/workspaces").with(user("bob", true)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(BETA.toString()));
        http.perform(get("/api/v1/workspaces").with(user("landlord", true)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(0));
        for (UUID unavailable : new UUID[] {BETA, UUID.randomUUID()}) {
            http.perform(post("/api/v1/workspaces/{id}/selection", unavailable).with(user("alice", true)).with(csrf()))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.detail").value("Workspace unavailable"));
        }
        http.perform(post("/api/v1/workspaces/{id}/selection", ALPHA).with(user("landlord", true)).with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    void workspaceSelectionRequiresCsrfAndRecordsAuditEvent() throws Exception {
        http.perform(post("/api/v1/workspaces/{id}/selection", ALPHA).with(user("alice", true)))
                .andExpect(status().isForbidden());
        http.perform(post("/api/v1/workspaces/{id}/selection", ALPHA).with(user("alice", true)).with(csrf()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Alpha"));
        try (var connection = migrationConnection();
             var events = connection.prepareStatement("SELECT action FROM audit_events WHERE organisation_id = ?")) {
            events.setObject(1, ALPHA);
            try (var result = events.executeQuery()) {
                assertThat(result.next()).isTrue();
                assertThat(result.getString(1)).isEqualTo("WORKSPACE_SELECTED");
                assertThat(result.next()).isFalse();
            }
        }
    }

    @Test
    void postgresRejectsWrongTenantAndAuditMutationAndClearsPooledScope() throws Exception {
        try (var connection = runtime.getConnection(); var query = connection.createStatement()) {
            assertThat(connection.getMetaData().getUserName()).isEqualTo("complylet_runtime");
            connection.setAutoCommit(false);
            bindScope(query);
            try (var result = query.executeQuery("SELECT count(*) FROM organisations")) {
                assertThat(result.next()).isTrue();
                assertThat(result.getInt(1)).isEqualTo(1);
            }
            try (var insert = connection.prepareStatement("""
                    INSERT INTO audit_events (organisation_id, issuer, subject, action)
                    VALUES (?, ?, 'alice', 'WORKSPACE_SELECTED')
                    """)) {
                insert.setObject(1, BETA);
                insert.setString(2, ISSUER);
                assertThat(assertThrows(SQLException.class, insert::executeUpdate).getSQLState()).isEqualTo("42501");
            }
            connection.rollback();
            try (var result = query.executeQuery("""
                    SELECT nullif(current_setting('complylet.organisation', true), ''),
                           (SELECT count(*) FROM organisations)
                    """)) {
                assertThat(result.next()).isTrue();
                assertThat(result.getString(1)).isNull();
                assertThat(result.getInt(2)).isZero();
            }
            connection.rollback();
            bindScope(query);
            connection.commit();
        }
        try (var connection = runtime.getConnection(); var query = connection.createStatement()) {
            try (var result = query.executeQuery("""
                    SELECT (SELECT count(*) FROM organisations) AS visible,
                           nullif(current_setting('complylet.organisation', true), '') AS tenant,
                           rolsuper, rolbypassrls
                    FROM pg_roles WHERE rolname = current_user
                    """)) {
                assertThat(result.next()).isTrue();
                assertThat(result.getInt("visible")).isZero();
                assertThat(result.getString("tenant")).isNull();
                assertThat(result.getBoolean("rolsuper")).isFalse();
                assertThat(result.getBoolean("rolbypassrls")).isFalse();
            }
            for (String forbidden : new String[] {
                    "SELECT * FROM audit_events", "DELETE FROM audit_events",
                    "UPDATE audit_events SET action = 'WORKSPACE_SELECTED'", "DELETE FROM organisations",
                    "UPDATE memberships SET active = true"
            }) {
                assertThat(assertThrows(SQLException.class, () -> query.execute(forbidden)).getSQLState())
                        .isEqualTo("42501");
            }
        }
    }

    private static void bindScope(java.sql.Statement query) throws SQLException {
        query.execute("SELECT set_config('complylet.issuer', '" + ISSUER + "', true)");
        query.execute("SELECT set_config('complylet.subject', 'alice', true)");
        query.execute("SELECT set_config('complylet.organisation', '" + ALPHA + "', true)");
    }

    @TestConfiguration(proxyBeanMethods = false)
    static class TestClient {
        @Bean
        InMemoryClientRegistrationRepository clientRegistrationRepository() {
            var client = ClientRegistration.withRegistrationId("complylet")
                    .clientId("complylet").clientSecret("test-secret")
                    .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                    .redirectUri("http://localhost:5173/login/oauth2/code/complylet")
                    .authorizationUri(ISSUER + "/authorize").tokenUri(ISSUER + "/token")
                    .jwkSetUri(ISSUER + "/keys").issuerUri(ISSUER).scope("openid", "email")
                    .build();
            return new InMemoryClientRegistrationRepository(client);
        }
    }
}
