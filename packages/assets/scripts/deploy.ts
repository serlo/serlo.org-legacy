import { uploadFolder } from '@serlo/gcloud'
import * as path from 'path'
import { Signale } from 'signale'

const bucket = 'assets.serlo.org'
const source = path.join(__dirname, '..', 'src')

const signale = new Signale({ interactive: true })

run()

async function run() {
  try {
    signale.info('Deploying static assets')
    uploadFolder({
      bucket,
      source,
      target: 'athene2'
    })
    signale.success(`Successfully deployed static assets`)
  } catch (e) {
    signale.fatal(e)
  }
}
