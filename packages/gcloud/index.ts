import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

const readdir = util.promisify(fs.readdir)

export async function uploadFolder({
  bucket,
  source,
  target
}: {
  bucket: string
  source: string
  target: string
}) {
  const b = `gs://${bucket}`
  const dest = `${b}/${trimSlashes(target)}/`
  const tmp = `${b}/${trimSlashes(target)}-tmp/`

  spawnSync(`gsutil`, ['-m', 'cp', '-r', path.join(source, '*'), tmp], {
    stdio: 'inherit'
  })
  spawnSync(`gsutil`, ['-m', 'rm', '-r', dest], { stdio: 'inherit' })

  const items = await readdir(source)

  items.forEach(item => {
    spawnSync(`gsutil`, ['-m', 'mv', `${tmp}${item}`, dest], {
      stdio: 'inherit'
    })
  })
  spawnSync(`gsutil`, ['-m', 'rm', '-r', tmp], { stdio: 'inherit' })

  function trimSlashes(p: string) {
    return p.replace(/^\/+/, '').replace('//+$/', '')
  }
}
