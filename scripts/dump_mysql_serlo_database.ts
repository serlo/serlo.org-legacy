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
import { Transform } from 'stream'

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
  'serlo'
]
const dockerComposeArgs = ['exec', '-T', 'mysql'].concat(mysqldumpCommand)

abstract class StringTransform extends Transform {
  protected readonly encoding: string

  constructor(encoding: string) {
    super()
    this.encoding = encoding
  }

  abstract transformString(text: string): void

  _transform(chunk: Buffer, encoding: string, callback: Function) {
    assert.strictEqual(
      encoding,
      'buffer',
      '`chunk` should always be a Buffer in our implementation.'
    )

    this.transformString(chunk.toString(this.encoding))
    callback()
  }

  push(text: string): boolean {
    return super.push(text, this.encoding)
  }
}

abstract class LineTransform extends StringTransform {
  private unfinishedLine: string = ''

  abstract transformLine(line: string): void

  transformString(newText: string): void {
    const text = this.unfinishedLine + newText
    let start: number = 0
    let end: number = 0

    while (true) {
      start = end
      end = text.indexOf('\n', start) + 1

      if (start < end) {
        this.transformLine(text.substring(start, end))
      } else {
        this.unfinishedLine = text.substring(start)
        break
      }
    }
  }

  _flush(callback: Function) {
    if (this.unfinishedLine) {
      this.transformLine(this.unfinishedLine)
    }

    callback()
  }
}

class ConcatenateInsertCommands extends LineTransform {
  private lastTable: string = ''
  private currentCmdLength: number = 0
  private maxInsertCmdLength: number

  constructor(encoding: string, maxInsertCmdLength: number) {
    super(encoding)
    this.maxInsertCmdLength = maxInsertCmdLength
  }

  transformLine(line: string): void {
    const insertTerm = 'INSERT INTO `'
    const tableEndTerm = '` ('
    const valuesTerm = ') VALUES ('

    if (line.startsWith(insertTerm)) {
      assert.ok(
        line.endsWith('\n'),
        'This implementation asserts that an INSERT command is never the last line.'
      )

      const tableStart = insertTerm.length + 1
      const tableEnd = line.indexOf(tableEndTerm)
      const table = line.substring(tableStart, tableEnd)

      const valuesStart = line.indexOf(valuesTerm) + valuesTerm.length - 1
      const valuesEnd = line.length - ';\n'.length
      const values = line.substring(valuesStart, valuesEnd)

      if (table !== this.lastTable) {
        this.lastTable = table

        const insertCommandPrefix = line.substring(0, valuesStart - 1)
        this.pushInsertCommand(insertCommandPrefix + '\n')
      } else {
        this.continueInsertCommand()
      }

      this.pushInsertCommand(values)

      if (this.currentCmdLength > this.maxInsertCmdLength) {
        this.endInsertCommand()
      }
    } else {
      this.endInsertCommand()
      this.push(line)
    }
  }

  private pushInsertCommand(part: string) {
    this.push(part)
    this.currentCmdLength += part.length
  }

  private continueInsertCommand(): void {
    this.pushInsertCommand(',\n')
  }

  private endInsertCommand(): void {
    if (this.lastTable) {
      this.pushInsertCommand(';\n')
      this.lastTable = ''
      this.currentCmdLength = 0
    }
  }
}

class IgnoreInsecurePasswordWarning extends LineTransform {
  private readonly uneccessaryError =
    'mysqldump: [Warning] Using a password on the command line ' +
    'interface can be insecure.\n'

  transformLine(line: string): void {
    if (line !== this.uneccessaryError) {
      this.push(line)
    }
  }
}

const mysqldump = spawn('docker-compose', dockerComposeArgs)

mysqldump.stdout
  .pipe(new ConcatenateInsertCommands(encoding, maxInsertCmdLength))
  .pipe(fs.createWriteStream(sqlInitFile))

mysqldump.stderr
  .pipe(new IgnoreInsecurePasswordWarning('utf8'))
  .pipe(process.stderr)

mysqldump.on('error', error => {
  console.error('ERROR: ' + error)
})

mysqldump.on('exit', (code, signal) => {
  process.exit(code !== null ? code : 1)
})
