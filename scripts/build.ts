import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as rimraf from 'rimraf'
import * as util from 'util'

const stat = util.promisify(fs.stat)

exec()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

async function exec() {
  let i = 0
  while (i++ < 3) {
    try {
      await clean()
      bundle()
      const stats = await stat(path.join('dist', 'index.d.ts'))
      if (stats.isFile()) return
    } catch (e) {
      console.log('Failed attempt', i, e)
    }
  }
  throw new Error('exec failed')

  async function clean() {
    const rm = util.promisify(rimraf)
    await rm('dist')
    await rm(path.join('node_modules', '.cache'))
  }

  function bundle() {
    const { status, error } = spawnSync(
      'yarn',
      ['tsdx', 'build', '--tsconfig', 'tsconfig.prod.json'],
      {
        stdio: 'inherit'
      }
    )
    if (status !== 0) {
      if (error) throw error
      throw new Error('build failed')
    }
  }
}
