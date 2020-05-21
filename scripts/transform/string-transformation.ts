import * as assert from 'assert'
import { Transform } from 'stream'

export abstract class StringTransform extends Transform {
  constructor(protected readonly encoding: BufferEncoding) {
    super()
  }

  abstract transformString(text: string): void

  _transform(chunk: Buffer, encoding: BufferEncoding, callback: Function) {
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
