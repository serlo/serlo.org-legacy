/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import {
  createEdtrIoMigration,
  replacePlugins,
  Plugin,
  Transformation,
} from './utils'

createEdtrIoMigration({
  exports,
  migrateState: replacePlugins({
    important: convertToBox,
    blockquote: convertToBox,
  }),
})

function convertToBox({
  plugin,
  applyChangeToChildren,
}: {
  plugin: Plugin
  applyChangeToChildren: Transformation
}) {
  return {
    plugin: 'box',
    state: {
      title: {
        plugin: 'text',
        state: [{ type: 'p', children: [{}] }],
      },
      content: {
        plugin: 'rows',
        state: [applyChangeToChildren(plugin.state)],
      },
      type: plugin.plugin === 'blockquote' ? 'quote' : 'blank',
      anchorId: `box${Math.floor(10000 + Math.random() * 90000)}`,
    },
  }
}
