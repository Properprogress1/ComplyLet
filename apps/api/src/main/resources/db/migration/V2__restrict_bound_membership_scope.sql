-- Unscoped actor lookup discovers memberships. Once a workspace is selected,
-- later reads in that transaction can see only that workspace's membership.
ALTER POLICY membership_self ON memberships USING (
    active AND issuer = nullif(current_setting('complylet.issuer', true), '')
       AND subject = nullif(current_setting('complylet.subject', true), '')
       AND (
           nullif(current_setting('complylet.organisation', true), '') IS NULL
           OR organisation_id = nullif(current_setting('complylet.organisation', true), '')::uuid
       )
);
