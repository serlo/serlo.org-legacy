// @ts-ignore FIXME
import build from '@vercel/ncc'
import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import rimraf from 'rimraf'
import * as util from 'util'

const root = path.join(__dirname, '..')
const src = path.join(root, 'src')
const dist = path.join(root, 'dist')

exec()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

async function exec() {
  const createDir = util.promisify(fs.mkdir)
  const readDir = util.promisify(fs.readdir)
  const writeFile = util.promisify(fs.writeFile)
  const rmDir = util.promisify(rimraf)
  const stat = util.promisify(fs.stat)

  await rmDir(dist)
  await createDir(dist)
  const files = await readDir(src)
  await Promise.all(
    files.map(async (file) => {
      const stats = await stat(path.join(src, file))
      if (!stats.isFile()) return

      const { code } = await build(path.join(src, file), {
        cache: false,
        sourceMapRegister: false,
      })
      await writeFile(
        path.join(dist, `${path.basename(file, '.ts')}.js`),
        code,
        {
          encoding: 'utf-8',
        }
      )
    })
  )
}
