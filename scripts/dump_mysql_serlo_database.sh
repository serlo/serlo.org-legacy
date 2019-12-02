#!/bin/bash
#
# This script dumps the current state of the MySQL database running in docker.
# It saves the dump into the file which is used to initialize the MySQL docker
# container during `yarn start`.

THIS_SCRIPT=`realpath $0`
REPOSITORY_BASE_DIR=`dirname "${THIS_SCRIPT}"`/..
SERVER_BASE_DIR="${REPOSITORY_BASE_DIR}/packages/public/server"
SQL_INIT_FILE="${SERVER_BASE_DIR}/docker-entrypoint-initdb.d/001-init.sql"

# * Before and after each row of each INSERT command in the final .sql file a
#   new line is added with the `sed` commands. Thus we have smaller diffs in
#   git when table rows are modified (see https://stackoverflow.com/a/19961480).
# * The option --skip-dump-date omits dumping the current date which further
#   reduces the noise in diffs between dumps. The dumped date is implicitly
#   stored by git.
# * The options --complete-insert and --comments make the dump more readable for
#   humans.
docker exec serloorg_mysql_1 /usr/bin/mysqldump --user=root --password=secret \
	--lock-all-tables --complete-insert --comments --skip-dump-date \
	--databases serlo \
		| sed 's$VALUES ($VALUES\n($g' \
		| sed 's$),($),\n($g' \
		> "${SQL_INIT_FILE}"
