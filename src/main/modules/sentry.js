import * as Sentry from '@sentry/browser'

import { version } from '../../../package.json'

Sentry.init({
  dsn:
    process.env.NODE_ENV === 'production'
      ? 'https://0c66c811e7f4408c8f20798379d7a814@sentry.io/1330033'
      : null,
  release: `athene2-assets@${version}`
})

export { Sentry }
