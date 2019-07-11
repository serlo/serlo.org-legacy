# SQL Queries

## Number of entities by type

```sql
SELECT t.`name`, count(*)
  FROM entity e LEFT JOIN type t ON e.`type_id` = t.`id` WHERE 	e.instance_id = 1
  AND e.type_id IN (1, 2, 3, 4, 5, 6, 7, 8, 40, 49)
  AND e.current_revision_id IS NOT NULL
  AND e.id NOT IN (SELECT id FROM uuid where trashed = 1)
  GROUP BY e.`type_id`
```

## Add new tenant

```sql
START TRANSACTION;

SET @langCode = "ta";
SET @langLocale = "ta_IN";
SET @langName = "Tamil";
/*
 * Setup basic tenant information
 */
-- Insert language
INSERT INTO language (code, name, locale) VALUES (@langCode, @langName, @langLocale);

-- Insert instance
INSERT INTO instance (language_id, name,subdomain) VALUES ((SELECT id FROM language WHERE code=@langCode),@langName, @langCode);

SET @instance = (SELECT id FROM instance i WHERE i.subdomain=@langCode);

/*
 * Setup role system
 */
SET @langLower = LOWER(@langName);

-- Insert roles
INSERT INTO role(name) VALUES
(CONCAT(@langLower,"_reviewer")),
(CONCAT(@langLower,"_helper")),
(CONCAT(@langLower,"_admin")),
(CONCAT(@langLower,"_horizonhelper")),
(CONCAT(@langLower,"_moderator")),
(CONCAT(@langLower,"_ambassador")),
(CONCAT(@langLower,"_langhelper")),
(CONCAT(@langLower,"_langadmin"));

-- Add inheritance of roles
INSERT INTO role_inheritance (role_id, child_id) VALUES
((SELECT id FROM role WHERE name= CONCAT(@langLower,"_reviewer")),(SELECT id FROM role WHERE name="login")),
((SELECT id FROM role WHERE name= CONCAT(@langLower,"_helper")),(SELECT id FROM role WHERE name= CONCAT(@langLower,"_reviewer"))),
((SELECT id FROM role WHERE name= CONCAT(@langLower,"_admin")),(SELECT id FROM role WHERE name= CONCAT(@langLower,"_helper"))),
((SELECT id FROM role WHERE name= CONCAT(@langLower,"_moderator")),(SELECT id FROM role WHERE name= CONCAT(@langLower,"_admin"))),
((SELECT id FROM role WHERE name= CONCAT(@langLower,"_ambassador")),(SELECT id FROM role WHERE name= CONCAT(@langLower,"_moderator"))),
((SELECT id FROM role WHERE name= CONCAT(@langLower,"_langhelper")),(SELECT id FROM role WHERE name= CONCAT(@langLower,"_ambassador"))),
((SELECT id FROM role WHERE name= CONCAT(@langLower,"_langadmin")),(SELECT id FROM role WHERE name= CONCAT(@langLower,"_langhelper"))),
((SELECT id FROM role WHERE name="sysadmin"),(SELECT id FROM role WHERE name=CONCAT(@langLower,"_langadmin")));


-- Copy non-global Permissions from english roles
INSERT INTO instance_permission (permission_id, instance_id)
SELECT DISTINCT i.permission_id, @instance
FROM role_permission p JOIN role r ON p.role_id = r.id JOIN instance_permission i ON p.permission_id = i.id
WHERE r.name LIKE "english_%" AND i.instance_id IS NOT NULL;

-- Copy global Permissions from english roles
INSERT INTO instance_permission (permission_id, instance_id)
SELECT DISTINCT i.permission_id, NULL
FROM role_permission p JOIN role r ON p.role_id = r.id JOIN instance_permission i ON p.permission_id = i.id
WHERE r.name LIKE "english_%" AND i.instance_id IS NULL;

-- Connect the created permissions to the same roles as in english
INSERT INTO role_permission(role_id, permission_id)
SELECT rt.id, it.id
FROM role re /* english roles */
  JOIN role rt ON rt.name = REPLACE(re.name, "english", @langLower) /* corresp. tamil roles */
  JOIN role_permission pe ON re.id = pe.role_id
  JOIN instance_permission ie ON ie.id = pe.permission_id, /* english permissions */
  instance_permission it /* this will be used for corresp. tamil permissions */
WHERE
  re.name LIKE "english_%" AND
  it.permission_id = ie.permission_id /* permission of english and tamil should be the same */
  AND NOT ie.id = it.id /* should be different elements */
  AND (it.instance_id IS NULL AND ie.instance_id IS NULL /* global permission */
       OR it.instance_id = @instance /* tamil permission */
);

/*
 * Setup taxonomy root
 */

-- Create the taxonomy root and subject if not existing yet
INSERT INTO taxonomy(type_id, instance_id)
SELECT t.id, @instance
FROM type t
WHERE (t.name = "root" OR t.name = "subject") AND NOT t.id IN (SELECT type_id FROM taxonomy WHERE instance_id = @instance);

SET @rootTax = (SELECT tax.id FROM taxonomy tax JOIN type t ON tax.type_id = t.id WHERE t.name="root" AND tax.instance_id = @instance);
SET @subjectTax = (SELECT tax.id FROM taxonomy tax JOIN type t ON tax.type_id = t.id WHERE t.name="subject" AND tax.instance_id = @instance);

-- Create root term and connect to taxonomy
INSERT INTO term(instance_id, name)
VALUES (@instance, "root");

SET @rootTerm = LAST_INSERT_ID();

INSERT INTO uuid(trashed, discriminator)
VALUES (0, "taxonomyTerm");

SET @rootTermTax = LAST_INSERT_ID();

INSERT INTO term_taxonomy(id, taxonomy_id, term_id, parent_id) VALUES
  (@rootTermTax, @rootTax, @rootTerm, NULL);

COMMIT;
```
