import { generateChangelog } from '@splish-me/changelog'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

const releases: Parameters<typeof generateChangelog>['0'] = [
  {
    tagName: '2.0.4',
    date: '2018-09-28'
  },
  {
    tagName: '3.0.0',
    date: '2018-10-30',
    breakingChanges: [
      'Removed `CommonsChunkPlugin`, i.e. there are no more `commons.js` and `common.css`',
      'Renamed `editor` to `legacy-editor`, i.e. one has to include `legacy-editor.js` resp. `legacy-editor.css` instead of `editor.js` resp. `editor.css`',
      'Asset bundle moved to `https://packages.serlo.org/athene2-assets@a/` resp. `https://packages.serlo.org/athene2-assets@b/` (blue-green deployment)',
      'Google Cloud Function moved to `https://europe-west1-serlo-assets.cloudfunctions.net/editor-renderer-a` resp. `https://europe-west1-serlo-assets.cloudfunctions.net/editor-renderer-b` (blue-green deployment)',
      'Needs an element with id `ory-editor-meta-data-wrapper` around the element with id `ory-editor-meta-data`'
    ],
    fixed: [
      'Load all plugins in render server for new editor',
      'When server side rendering fails, still pass state down to client for improved debugging',
      'Hide double sidebar outside the editor'
    ],
    internal: [
      'Dynamically import the new editor and its renderer. This leads to a much smaller bundle size for the initial load.',
      'Automated blue-green deployment of athene2-assets and server side renderer for new editor',
      'Automated deployment of Cloudflare workers',
      'Log version to browser console',
      'Add a content hash of length 8 to file names of chunks and assets (e.g. fonts and images)',
      'Upgrade to Webpack 4'
    ]
  },
  {
    tagName: '3.0.1',
    date: '2018-10-31',
    changed: [
      "Remove explicit target on `@babel/preset-env` so that [Browserlist's](https://github.com/browserslist/browserslist) recommended config is used"
    ],
    fixed: ['Replace usages of `String.startsWith` for IE compatibility']
  },
  {
    tagName: '3.1.0',
    date: '2018-11-18',
    added: ['Style semantic elements in taxonomy'],
    fixed: ['Polyfill css class `.fa-1-5-x`']
  },
  {
    tagName: '3.1.1',
    date: '2018-11-22',
    fixed: ['Handle `ggt/{id}` links correctly']
  },
  {
    tagName: '3.2.0',
    date: '2018-12-01',
    added: [
      'Add consent banner for privacy policy and terms of use (de.serlo.org only for now)'
    ],
    internal: ['Add Sentry to monitor JavaScript runtime errors']
  },
  {
    tagName: '3.2.1',
    date: '2018-12-02',
    fixed: ['Always show consent banner on top'],
    internal: ['Associate commit with Sentry release on deployment']
  },
  {
    tagName: '3.2.2',
    date: '2018-12-02',
    internal: ['Associate commit with Sentry release on deployment correctly']
  },
  {
    tagName: '3.3.0',
    date: '2018-12-02',
    changed: ['Handle legacy GeoGebra applets more gracefully'],
    fixed: ['Fix text plugin']
  },
  {
    tagName: '3.4.0',
    date: '2019-01-14',
    added: ['Redirect from https://start.serlo.org to team overview document'],
    changed: ['Update `@serlo/editor` to 0.4.0'],
    fixed: [
      'Correct heading styles in new editor',
      'Set max file size limit of old image upload to 2MB',
      'Handle rewriting of https://assets.serlo.org/meta links correctly'
    ],
    internal: ['Lazy load ReCAPTCHA']
  },
  {
    tagName: '3.5.0',
    date: '2019-01-16',
    added: ['H5P.com editor plugin'],
    internal: [
      'Upload `yarn.lock` with Google Cloud Function for consistent dependencies'
    ]
  },
  {
    tagName: '3.6.0',
    date: '2019-01-22',
    added: [
      'Content API: notify parent window of actual content dimensions',
      'Editor: shortcuts for undo/redo'
    ],
    fixed: ['Editor: various fixes']
  },
  {
    tagName: '3.7.0',
    date: '2019-02-02',
    changed: ['Improved content styles'],
    internal: [
      'Move to CircleCI from Travis',
      'Use [@splish-me/changelog](https://github.com/splish/changelog) to generate changelogs'
    ]
  },
  {
    tagName: '3.7.1',
    date: '2019-02-12',
    fixed: ['Fixed image upload in new editor']
  },
  {
    tagName: '3.7.2',
    date: '2019-02-18',
    fixed: ['Fixed footer styles']
  },
  {
    internal: ['Automatically deploy assets']
  }
]

const writeFile = util.promisify(fs.writeFile)

exec()

async function exec(): Promise<void> {
  const content = await generateChangelog(releases)

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
