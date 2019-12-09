/**
 * Displays the donation banner on the Wikibooks project „Mathe für
 * Nicht-Freaks“ on de.wikibooks.org. This script is included at
 * https://de.wikibooks.org/wiki/MediaWiki:Gadget-serlo-general.js
 *
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
import { initDonationBanner } from '../main/modules/donation-banner'
import './styles/donation-banner-mfnf.scss'

init()

function init() {
  if (isSerloPageOnWikibooks()) {
    preparePageForBanner()
    initDonationBanner()
  }
}

function isSerloPageOnWikibooks() {
  const mw = (window as any)['mw']
  return mw && mw.config.get('wgPageName').startsWith('Mathe_für_Nicht-Freaks')
}

function preparePageForBanner() {
  if ($('#donation-banner').length > 0) return
  const bannerStylesheet = __webpack_public_path__ + 'donation-banner-mfnf.css'

  $('body').prepend("<div id='donation-banner'></div>")
  $('head').prepend(
    `<link rel='stylesheet' type='text/css' href='${bannerStylesheet}' />`
  )
}
