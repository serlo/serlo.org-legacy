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
import { initDonationBanner } from './modules/donation-banner'
import './styles/donation-banner-mfnf.scss'

function isSerloPageOnWikibooks() {
  return mw && mw.config.get('wgPageName').startsWith('Mathe_für_Nicht-Freaks')
}

function isPageReadyForBanner() {
  return $('#donation-banner').length > 0
}

function preparePageForBanner() {
  const serloClientBaseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8081/'
      : 'https://packages.serlo.org/serlo-org-client@5/'
  const bannerStylesheet = serloClientBaseUrl + 'donation-banner-mfnf.css'

  $('body').prepend("<div id='donation-banner'></div>")
  $('head').prepend(
    `<link rel='stylesheet' type='text/css' href='${bannerStylesheet}' />`
  )
}

function displayDonationBannerOnMFNF() {
  if (isSerloPageOnWikibooks()) {
    if (!isPageReadyForBanner()) {
      preparePageForBanner()
    }

    initDonationBanner()
  }
}

displayDonationBannerOnMFNF()
