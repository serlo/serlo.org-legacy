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
import * as React from 'react'
import ReactDOM from 'react-dom'

import { SerloContainer } from './serlo'

const state = JSON.parse(
  '{"plugin":"rows","state":[{"plugin":"layout","state":[{"child":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Dies ist ein mehrspaltiges Layout, wie es beim Konvertieren auf serlo.org verwendet wird.","marks":[]}]}]}]}}},{"plugin":"spoiler","state":{"title":"Geheimtipp","content":{"plugin":"rows","state":[{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Durch klicken auf \\"konvertiere\\" wird das alles zu einem schönen, spaltenfreien Layout","marks":[]}]}]}]}}}]}}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Das Plugin ist nur für Serlo relevant!","marks":[]}]}]}]}}}]},"width":12},{"child":{"plugin":"rows","state":[{"plugin":"image","state":{"src":"https://www.edutags.de/screenshots/30329_full.jpg","href":"","target":"","rel":"","description":"cooler Serlo content","maxWidth":0}},{"plugin":"text","state":{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Das tolle Bild ist etwas klein... außer man konvertiert es! ","marks":[]}]}]}]}}}]},"width":12}]}]}'
)
ReactDOM.render(
  <SerloContainer initialState={state} />,
  document.getElementById('root')
)
