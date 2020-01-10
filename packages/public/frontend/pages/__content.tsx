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
import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
import { Renderer } from '../src/edtr-io'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { RendererProps } from '@edtr-io/renderer'
import { convert, isEdtr } from '../src/legacy/legacy-editor-to-editor'
import {
  Edtr,
  Legacy,
  Splish
} from '../src/legacy/legacy-editor-to-editor/splishToEdtr/types'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

export default function Index({ input }) {
  if (input === undefined) return null
  if (input === '') return null
  let data: Legacy | Splish | Edtr
  try {
    data = JSON.parse(input.trim().replace(/&quot;/g, '"'))
  } catch (e) {
    return null
  }
  const state = isEdtr(data) ? data : convert(data)
  return <Renderer state={state} />
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, {
    input: ''
  })
}
