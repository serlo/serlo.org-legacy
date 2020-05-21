import * as assert from 'assert'
import { LineTransform } from './line-transformation'

export class ConcatenateInsertCommands extends LineTransform {
  private lastTable: string = ''
  private currentCmdLength: number = 0
  private maxInsertCmdLength: number

  constructor(encoding: BufferEncoding, maxInsertCmdLength: number) {
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
