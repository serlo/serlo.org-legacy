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

export function replacePlugins(transformations: {
  [key in string]?: (args: {
    plugin: Plugin
    applyChangeToChildren: Transformation
  }) => Plugin
}): Transformation {
  return updatePlugins((plugin, applyChangeToChildren) => {
    const transformFunc = transformations[plugin.plugin]

    if (typeof transformFunc === 'function') {
      return transformFunc({ plugin, applyChangeToChildren })
    }
  })
}

export function replacePluginState(transformations: {
  [key in string]?: (args: {
    state: unknown
    applyChangeToChildren: Transformation
  }) => unknown
}): Transformation {
  return updatePlugins(({ plugin, state }, applyChangeToChildren) => {
    const transformFunc = transformations[plugin]

    if (typeof transformFunc === 'function') {
      return { plugin, state: transformFunc({ state, applyChangeToChildren }) }
    }
  })
}

function updatePlugins(
  updatePlugin: (
    plugin: Plugin,
    applyChangeToChildren: Transformation
  ) => Plugin | undefined
): Transformation {
  function applyChangeToChildren(value: unknown): unknown {
    if (isPlugin(value)) {
      const newPlugin = updatePlugin(value, applyChangeToChildren)

      if (newPlugin) return newPlugin
    }

    if (Array.isArray(value)) {
      return value.map(applyChangeToChildren)
    }

    if (typeof value === 'object' && value !== null) {
      return R.mapObjIndexed(applyChangeToChildren, value)
    }

    return value
  }

  return applyChangeToChildren
}

export function isPlugin(value: unknown): value is Plugin {
  return (
    R.has('plugin', value) &&
    R.has('state', value) &&
    typeof value.plugin === 'string'
  )
}

export type Transformation = (value: unknown) => unknown

export interface Plugin {
  plugin: string
  state: unknown
}
