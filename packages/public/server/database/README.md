# Create a database dump

Export the dataset from the serlo database, then add:

```sql
DROP SCHEMA IF EXISTS `serlo` ;
CREATE SCHEMA IF NOT EXISTS `serlo` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `serlo` ;
```

Replace all password hashes by this one: `8a534960a8a4c8e348150a0ae3c7f4b857bfead4f02c8cbf0d` which is `123456`

To anonymize usernames and email addresses, run the following regex replace:  
`([0-9]+, )'[^']+\@[^']+'. '[^']+', '[^']+'`  
`$1CONCAT(LEFT(UUID(), 8),'@localhost'), LEFT(UUID(), 8), '8a534960a8a4c8e348150a0ae3c7f4b857bfead4f02c8cbf0d'`  
