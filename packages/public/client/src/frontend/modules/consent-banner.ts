/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import $ from 'jquery'

import { tenant } from '../../modules/tenant'

export async function initConsentBanner(): Promise<boolean> {
  if (tenant !== 'de') return true

  const localStorageKey = 'consent'
  const localStorageValue = localStorage.getItem(localStorageKey)
  const value: ConsentLogalStorageValue = localStorageValue
    ? JSON.parse(localStorageValue)
    : {}

  const [currentRevision]: string[] = await $.get('/privacy/json')
  if (value.revision === currentRevision) return true

  const $div = $(`
        <div id="consent-banner">
            Mit der Nutzung dieser Webseite erklärst du dich mit unserer
            <a href="/privacy">Datenschutzerklärung</a> und
            <a href="/terms">Nutzungsbedingungen</a> einverstanden.
        </div>
       `)
  const $button = $('<button class="btn btn-success">Verstanden</button>')
  $div.append($button)

  $button.on('click', () => {
    persist({ revision: currentRevision })
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
}
