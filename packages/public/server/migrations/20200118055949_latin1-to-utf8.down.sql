START TRANSACTION;

DROP PROCEDURE if exists utf8_to_latin1_columns;
CREATE PROCEDURE utf8_to_latin1_columns()
BEGIN
    DECLARE s_query varchar(255);
    DECLARE done bool default false;
    DECLARE c_queries cursor FOR
        SELECT CONCAT('UPDATE `', table_name, '` SET `', column_name, '`=CONVERT(BINARY CONVERT(`', column_name,
                      '` USING UTF8MB4) USING LATIN1);')
        FROM information_schema.columns
        WHERE table_schema = 'serlo'
          AND DATA_TYPE IN (
                            'char',
                            'varchar',
                            'binary',
                            'varbinary',
                            'tinyblob',
                            'blob',
                            'mediumblob',
                            'longblob',
                            'tinytext',
                            'text',
                            'mediumtext',
                            'longtext',
                            'enum',
                            'set');
    DECLARE CONTINUE HANDLER for NOT FOUND
        BEGIN
            SET done = true;
        END;

    OPEN c_queries;
    read_loop:
    LOOP
        FETCH c_queries INTO s_query;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SET @sql = s_query;
        SELECT @sql;
        PREPARE stmt from @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;
    CLOSE c_queries;
END;
CALL utf8_to_latin1_columns();
DROP PROCEDURE utf8_to_latin1_columns;

ALTER DATABASE serlo CHARACTER SET = utf8 COLLATE = utf8_general_ci;

DROP PROCEDURE if exists utf8_to_latin1_tables;
CREATE PROCEDURE utf8_to_latin1_tables()
BEGIN
    DECLARE s_query varchar(255);
    DECLARE done bool default false;
    DECLARE c_queries cursor FOR
        SELECT CONCAT('ALTER TABLE `', table_name, '` CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;')
        FROM information_schema.tables
        WHERE table_schema = 'serlo';

    DECLARE CONTINUE HANDLER for NOT FOUND
        BEGIN
            SET done = true;
        END;

    SET @old_sql_mode = @@sql_mode;
    SET @new_sql_mode = @old_sql_mode;
    SET @new_sql_mode = TRIM(BOTH ',' FROM REPLACE(CONCAT(',', @new_sql_mode, ','), ',NO_ZERO_DATE,', ','));
    SET @new_sql_mode = TRIM(BOTH ',' FROM REPLACE(CONCAT(',', @new_sql_mode, ','), ',NO_ZERO_IN_DATE,', ','));
    SET @@sql_mode = @new_sql_mode;

    OPEN c_queries;
    read_loop:
    LOOP
        FETCH c_queries INTO s_query;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SET @sql = s_query;
        SELECT @sql;
        PREPARE stmt from @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;
    CLOSE c_queries;

    SET @@sql_mode = @old_sql_mode;
END;
CALL utf8_to_latin1_tables();
DROP PROCEDURE utf8_to_latin1_tables;

COMMIT;
