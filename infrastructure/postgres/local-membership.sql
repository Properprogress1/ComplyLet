-- Local development fixture only. Run as the migration role after Flyway.
INSERT INTO organisations (id, name)
VALUES ('f0e3e83f-ad62-4367-b174-228f2ad64971', 'Local agency'),
       ('acb150d1-b524-4a44-a926-5ce88c774b82', 'Second local agency')
ON CONFLICT DO NOTHING;

INSERT INTO memberships (organisation_id, issuer, subject, role)
VALUES ('f0e3e83f-ad62-4367-b174-228f2ad64971', 'http://localhost:8080/realms/complylet',
        '36d35cd2-bd09-4880-a71f-f040a2a7b111', 'ORGANISATION_OWNER'),
       ('acb150d1-b524-4a44-a926-5ce88c774b82', 'http://localhost:8080/realms/complylet',
        'cc5cc135-6a0f-4ace-929b-8bdc4aed017c', 'ORGANISATION_OWNER')
ON CONFLICT DO NOTHING;
