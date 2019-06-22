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
