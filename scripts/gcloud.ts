import { spawnSync } from 'child_process'
import * as path from 'path'

const root = path.join(__dirname, '..')

spawnSync('gcloud', ['init'])
spawnSync('gcloud', [
  'auth',
  'activate-service-account',
  `--key-file=${path.join(root, 'gcloud.secret.json')}`
])

export const project = `--project=serlo-assets`
