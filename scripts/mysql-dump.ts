/**
 * This script dumps the current state of the MySQL database running in docker.
 * It saves the dump into the file which is used to initialize the MySQL docker
 * container during `yarn start`.
 */

import * as assert from 'assert'
import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as process from 'process'
import {
  ConcatenateInsertCommands,
  IgnoreInsecurePasswordWarning,
} from './transform'

// Currently we have wrongly encoded characters in the DB and the dump only
// works when we handle it with a 1 Byte character set (see #166)
const encoding = 'latin1'
const maxInsertCmdLength = 1024 * 1024
const repositoryBaseDir = path.dirname(__dirname)
const sqlInitFile = path.join(
  repositoryBaseDir,
  'packages',
  'public',
  'server',
  'docker-entrypoint-initdb.d',
  '001-init.sql'
)

// The option --skip-dump-date omits dumping the current date which reduces
// the noise in diffs between dumps. The date of the last dump is implicitly
// stored by git. The options --complete-insert and --comments make the dump
// more readable.
const mysqldumpCommand = [
  'mysqldump',
  '--user=root',
  '--password=secret',
  '--lock-all-tables',
  '--complete-insert',
  '--skip-extended-insert',
  '--comments',
  '--skip-dump-date',
  '--default-character-set=utf8',
  '--databases',
  'serlo',
]
const dockerComposeArgs = ['exec', '-T', 'mysql'].concat(mysqldumpCommand)
const mysqldump = spawn('docker-compose', dockerComposeArgs)

mysqldump.stdout
  .pipe(new ConcatenateInsertCommands(encoding, maxInsertCmdLength))
  .pipe(fs.createWriteStream(sqlInitFile))

mysqldump.stderr
  .pipe(new IgnoreInsecurePasswordWarning('utf8'))
  .pipe(process.stderr)

mysqldump.on('error', (error) => {
  console.error('ERROR: ' + error)
})

mysqldump.on('exit', (code, signal) => {
  process.exit(code !== null ? code : 1)
})
