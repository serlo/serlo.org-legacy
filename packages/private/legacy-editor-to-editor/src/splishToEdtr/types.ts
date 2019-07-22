import { Plugin } from '@serlo/editor-plugins-registry'
import { Plugin as EdtrPlugins } from '@serlo/edtr-io'

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
  content: {
    plugin: SplishPlugin
    state: S
  }
}

export function isContentCell(cell: Cell): cell is ContentCell {
  const c = cell as ContentCell
  return typeof c.content !== 'undefined'
}

type SplishPlugin = { name: Plugin; version?: string }

export type Edtr = RowsPlugin | LayoutPlugin | OtherPlugin

export type RowsPlugin = { plugin: 'rows'; state: Edtr[] }
export type LayoutPlugin = {
  plugin: 'layout'
  state: { child: Edtr; width: number }[]
}
export type OtherPlugin = {
  plugin: Exclude<EdtrPlugins, 'rows' | 'layout'>
  state: unknown
}

export function isSplish(content: Legacy | Splish): content is Splish {
  return (content as Splish).cells !== undefined
}

export function isEdtr(content: Legacy | Splish | Edtr): content is Edtr {
  return (content as Edtr).plugin !== undefined
}
