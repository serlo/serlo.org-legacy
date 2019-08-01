/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { spawnSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { Signale } from 'signale'
import * as util from 'util'

const root = path.join(__dirname, '..')

const packageJsonPath = path.join(root, 'package.json')

const fsOptions = { encoding: 'utf-8' }

const readFile = util.promisify(fs.readFile)

const signale = new Signale({ interactive: true })

run().then(() => {})

async function run() {
  try {
    signale.info('Deploying athene2')

    const { version } = await fetchPackageJSON()

    signale.pending(`Creating Sentry release…`)
    createSentryRelease(version)
  } catch (e) {
    signale.fatal(e.message)
  }
}

function fetchPackageJSON(): Promise<{ version: string }> {
  return readFile(packageJsonPath, fsOptions).then(JSON.parse)
}

function createSentryRelease(version: string) {
  const release = `athene2@${version}`
  const environments = getEnvironments(version)

  spawnSync(
    'sentry-cli',
    ['releases', 'new', '--project', 'athene2', release],
    {
      stdio: 'inherit'
    }
  )
  spawnSync('sentry-cli', ['releases', 'set-commits', '--auto', release], {
    stdio: 'inherit'
  })
  environments.forEach(
    env => {
      spawnSync(
        'sentry-cli',
        ['releases', 'deploys', release, 'new', '--env', env],
        {
          stdio: 'inherit'
        }
      )
    },
    {
      stdio: 'inherit'
    }
  )
}

function getEnvironments(version: string) {
  const [major, minor] = version.split('.')
  return ['latest', major, `${major}.${minor}`, version]
}
