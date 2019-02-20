import { spawnSync } from 'child_process'
import * as path from 'path'

export function uploadFolder({
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
  spawnSync(`gsutil`, ['-m', 'mv', `${tmp}*`, dest], { stdio: 'inherit' })

  function trimSlashes(p: string) {
    return p.replace(/^\/+/, '').replace('//+$/', '')
  }
}
