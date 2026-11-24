CREATE TABLE organisations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 200)
);

CREATE TABLE memberships (
    organisation_id uuid NOT NULL REFERENCES organisations (id),
    issuer text NOT NULL CHECK (issuer <> ''),
    subject text NOT NULL CHECK (subject <> ''),
    role text NOT NULL CHECK (role IN (
        'ORGANISATION_OWNER', 'ORGANISATION_ADMINISTRATOR', 'COMPLIANCE_MANAGER',
        'BRANCH_MANAGER', 'PROPERTY_MANAGER', 'COMPLIANCE_REVIEWER',
        'READ_ONLY_AUDITOR', 'LANDLORD_VIEWER'
    )),
    active boolean NOT NULL DEFAULT true,
    PRIMARY KEY (organisation_id, issuer, subject)
);
CREATE INDEX memberships_active_actor ON memberships (issuer, subject, organisation_id) WHERE active;

CREATE TABLE audit_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id uuid NOT NULL,
    issuer text NOT NULL,
    subject text NOT NULL,
    action text NOT NULL CHECK (action = 'WORKSPACE_SELECTED'),
    occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
    FOREIGN KEY (organisation_id, issuer, subject)
        REFERENCES memberships (organisation_id, issuer, subject)
);
CREATE INDEX audit_events_org_time ON audit_events (organisation_id, occurred_at, id);

CREATE FUNCTION can_open_agency_workspace(membership_role text) RETURNS boolean
LANGUAGE sql IMMUTABLE STRICT AS $$
    SELECT membership_role IN (
        'ORGANISATION_OWNER', 'ORGANISATION_ADMINISTRATOR', 'COMPLIANCE_MANAGER',
        'BRANCH_MANAGER', 'PROPERTY_MANAGER', 'COMPLIANCE_REVIEWER', 'READ_ONLY_AUDITOR'
    )
$$;
REVOKE EXECUTE ON FUNCTION can_open_agency_workspace(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION can_open_agency_workspace(text) TO complylet_runtime;

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY membership_self ON memberships FOR SELECT TO complylet_runtime USING (
    active AND issuer = nullif(current_setting('complylet.issuer', true), '')
       AND subject = nullif(current_setting('complylet.subject', true), '')
);
-- Organisations expose only workspace labels belonging to the actor's memberships.
CREATE POLICY organisation_member ON organisations FOR SELECT TO complylet_runtime USING (
    EXISTS (SELECT 1 FROM memberships WHERE organisation_id = organisations.id
            AND can_open_agency_workspace(role))
);
CREATE POLICY audit_insert ON audit_events FOR INSERT TO complylet_runtime WITH CHECK (
    organisation_id = nullif(current_setting('complylet.organisation', true), '')::uuid
    AND issuer = nullif(current_setting('complylet.issuer', true), '')
    AND subject = nullif(current_setting('complylet.subject', true), '')
    AND EXISTS (SELECT 1 FROM memberships WHERE organisation_id = audit_events.organisation_id
                AND can_open_agency_workspace(role))
);

GRANT SELECT ON organisations, memberships TO complylet_runtime;
GRANT INSERT (organisation_id, issuer, subject, action) ON audit_events TO complylet_runtime;
