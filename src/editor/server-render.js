/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2018 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2018 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
import { HtmlRenderer } from '@serlo-org/html-renderer'
import React from 'react'
import { renderToString } from 'react-dom/server'

import converter from './converter'
import createRenderPlugins from './plugins.render'
import { stringifyState } from './helpers'

const wrapOutput = ({ state, children }) => {
  return `<div class="ory-content" data-raw-content='${stringifyState(
    state
  )}'>${children || ''}</div>`
}

export function render(input, callback) {
  let data

  // callback(output, Exception, ErrorMessage);
  if (typeof input === 'undefined') {
    callback('', 'InvalidArgumentException', 'No input given')
    return
  }

  if (input === '') {
    callback('')
  } else {
    // parse input to object
    try {
      // FIXME:
      input = input.trim().replace(/&quot;/g, '"')
      data = JSON.parse(input)
    } catch (e) {
      callback(
        '',
        'InvalidArgumentException',
        'No valid json string given: ' + input
      )
      return
    }

    const state = data['cells'] ? data : converter(data)

    try {
      const children = renderToString(
        <HtmlRenderer
          state={state}
          plugins={createRenderPlugins('text-exercise')}
        />
      )

      callback(wrapOutput({ state, children }))
    } catch (e) {
      callback(wrapOutput({ state }))
    }
  }
}
