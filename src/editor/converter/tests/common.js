/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2019 Serlo Education e.V.
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
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
import { slatePlugin } from '@serlo-org/editor-plugins/lib/slate'
import unexpected from 'unexpected'

const expectInstance = unexpected.clone()

/**
 * Remove all specified keys from an object, no matter how deep they are.
 * The removal is done in place, so run it on a copy if you don't want to modify the original object.
 * This function has no limit so circular objects will probably crash the browser
 *
 * @param obj The object from where you want to remove the keys
 * @param keys An array of property names (strings) to remove
 */
const removeKeys = (obj, keys) => {
  let index
  for (let prop in obj) {
    // important check that this is objects own property
    // not from prototype prop inherited
    if (obj.hasOwnProperty(prop)) {
      switch (typeof obj[prop]) {
        case 'string':
          index = keys.indexOf(prop)
          if (index > -1) {
            delete obj[prop]
          }
          break
        case 'object':
          index = keys.indexOf(prop)
          if (index > -1) {
            delete obj[prop]
          } else {
            removeKeys(obj[prop], keys)
          }
          break
      }
    }
  }
}

const ignoreIrrelevantKeys = obj => removeKeys(obj, ['id'])

export const expect = (input, method, output) => {
  expectInstance(
    ignoreIrrelevantKeys(input),
    method,
    ignoreIrrelevantKeys(output)
  )
}

export const expectSlate = html => ({
  content: {
    plugin: { name: slatePlugin.name, version: slatePlugin.version },
    state: slatePlugin.serialize(
      slatePlugin.unserialize({
        importFromHtml: html
      })
    )
  }
})
