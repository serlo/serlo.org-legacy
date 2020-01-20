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
import { Plugin } from '@serlo/editor-plugins-registry'

export type Legacy = LegacyRow[]

export type LegacyRow = {
  col: number
  content: string
}[]

export type Splish = {
  id?: string
  cells: Cell[]
}
export type Row = Splish

export type Cell = RowCell | ContentCell

type RowCell = {
  id?: string
  size?: number
  rows: Row[]
}

export type ContentCell<S = unknown> = {
  id?: string
  size?: number
  inline?: null
  content: {
    plugin: SplishPlugin
    state: S
  }
}

export function isContentCell(cell: Cell): cell is ContentCell {
  const c = cell as ContentCell
  return typeof c.content !== 'undefined'
}

type SplishPlugin = { name: Plugin | 'code'; version?: string }

export type Edtr = RowsPlugin | LayoutPlugin | SolutionStepsPlugin | OtherPlugin

export type RowsPlugin = { plugin: 'rows'; state: Edtr[] }
export type LayoutPlugin = {
  plugin: 'layout'
  state: { child: Edtr; width: number }[]
}

export type SolutionStepsPlugin = {
  plugin: 'solutionSteps'
  state: {
    introduction: Edtr
    strategy: Edtr
    hasStrategy: boolean
    solutionSteps: Edtr[]
    additionals: Edtr
    hasAdditionals: boolean
  }
}

export type OtherPlugin = {
  plugin:
    | 'anchor'
    | 'blockquote'
    | 'error'
    | 'geogebra'
    | 'highlight'
    | 'image'
    | 'important'
    | 'injection'
    | 'inputExercise'
    | 'spoiler'
    | 'scMcExercise'
    | 'solution'
    | 'table'
    | 'text'
    | 'video'
  state: unknown
}

export function isSplish(content: Legacy | Splish): content is Splish {
  return (content as Splish).cells !== undefined
}

export function isEdtr(content: Legacy | Splish | Edtr): content is Edtr {
  return (content as Edtr).plugin !== undefined
}
