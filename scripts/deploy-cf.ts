import * as fs from 'fs'
// @ts-ignore
import * as runAll from 'npm-run-all'
import * as path from 'path'
import * as request from 'request'
import { Signale } from 'signale'
import * as util from 'util'

import { zoneId, secret } from './cloudflare'

const readFile = util.promisify(fs.readFile)

const fsOptions = { encoding: 'utf-8' }

const signale = new Signale({ interactive: true })
const numberOfSteps = 2

run()

async function run() {
  try {
    signale.info('Deploying Cloudflare workers')

    signale.pending(`[0/${numberOfSteps}]: Bundling…`)
    await build()

    signale.pending(`[1/${numberOfSteps}]: Uploading workers…`)
    await uploadWorkers()

    signale.success(
      `[2/${numberOfSteps}]: Successfully deployed Cloudflare workers`
    )
  } catch (e) {
    signale.fatal(e)
  }
}

function build(): Promise<void> {
  return runAll(['build:cf'], {
    parallel: true,
    stdout: process.stdout,
    stderr: process.stderr
  })
}

async function uploadWorkers(): Promise<void> {
  const content = await readFile(
    path.join(__dirname, '..', 'dist-cf', 'index.js'),
    fsOptions
  )

  await new Promise((resolve, reject) => {
    request.put(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/workers/script`,
      {
        headers: {
          'X-Auth-Email': secret.email,
          'X-Auth-Key': secret.key,
          'Content-Type': 'application/javascript'
        },
        body: content
      },
      error => {
        if (error) {
          reject(error)
          return
        }

        resolve()
      }
    )
  })
}
