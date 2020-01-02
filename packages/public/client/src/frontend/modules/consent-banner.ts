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
import $ from 'jquery'

import { tenant } from '../../modules/tenant'
import { getGa } from './analytics'

export async function initConsentBanner(): Promise<boolean> {
  if (tenant !== 'de') return true

  const localStorageKey = 'consent'
  const localStorageValue = localStorage.getItem(localStorageKey)
  const value: ConsentLogalStorageValue = localStorageValue
    ? JSON.parse(localStorageValue)
    : { showEvent: false, consentEvent: false }

  const [currentRevision]: string[] = await $.get('/datenschutz/json')
  if (value.revision === currentRevision) return true

  if (!value.showEvent) {
    getGa()('send', 'event', 'consent', 'show', 'Banner shown')
    persist({ ...value, showEvent: true })
  }

  const $div = $(`
        <div id="consent-banner">
            Mit der Nutzung dieser Webseite erklärst du dich mit unserer
            <a href="/datenschutz">Datenschutzerklärung</a> und
            <a href="/21654">Nutzungsbedingungen</a> einverstanden.
        </div>
       `)
  const $button = $('<button class="btn btn-success">Verstanden</button>')
  $div.append($button)

  $button.on('click', () => {
    if (!value.consentEvent) {
      getGa()('send', 'event', 'consent', 'consent', 'Banner consented')
    }
    persist({ revision: currentRevision, showEvent: true, consentEvent: true })
    $div.remove()
  })

  $('body').append($div)

  return false

  function persist(value: ConsentLogalStorageValue) {
    localStorage.setItem(localStorageKey, JSON.stringify(value))
  }
}

interface ConsentLogalStorageValue {
  revision?: string
  showEvent: boolean
  consentEvent: boolean
}
