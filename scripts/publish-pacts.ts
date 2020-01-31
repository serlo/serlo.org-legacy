import pact from '@pact-foundation/pact-node'
import { spawnSync } from 'child_process'
import * as path from 'path'

const { version } = require('../packages/public/server/package.json')

const result = spawnSync('git', ['rev-parse', '--short', 'HEAD'], {
  stdio: 'pipe'
})
const hash = String(result.stdout).trim()

const consumerVersion = `${version}-${hash}`

pact
  .publishPacts({
    pactFilesOrDirs: [
      path.join(
        __dirname,
        '..',
        'packages',
        'public',
        'server',
        'pacts',
        'http'
      ),
      path.join(
        __dirname,
        '..',
        'packages',
        'public',
        'server',
        'pacts',
        'message'
      )
    ],
    pactBroker: 'https://pacts.serlo.org/',
    pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
    pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
    consumerVersion
  })
  .then(function() {
    console.log('success')
    // do something
  })
