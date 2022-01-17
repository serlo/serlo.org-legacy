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
import * as R from 'ramda'

export function updatePlugins(transformations: {
  [key in string]?: (args: {
    state: unknown
    transformState: Transformation
  }) => unknown
}): Transformation {
  function transformState(value: unknown): unknown {
    if (isPlugin(value)) {
      const { plugin, state } = value
      const transformFunc = transformations[plugin]

      if (typeof transformFunc === 'function') {
        return { ...value, state: transformFunc({ state, transformState }) }
      }
    }

    if (Array.isArray(value)) {
      return value.map(transformState)
    }

    if (typeof value === 'object' && value !== null) {
      return R.mapObjIndexed(transformState, value)
    }

    return value
  }

  return transformState
}

export function isPlugin(value: unknown): value is Plugin {
  return (
    R.has('plugin', value) &&
    R.has('state', value) &&
    typeof value.plugin === 'string'
  )
}

type Transformation = (value: unknown) => unknown

interface Plugin {
  plugin: string
  state: unknown
}
