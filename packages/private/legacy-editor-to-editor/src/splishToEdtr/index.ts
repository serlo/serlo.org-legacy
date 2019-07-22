import * as R from 'ramda'

import { Cell, isContentCell, LayoutPlugin, OtherPlugin, Row } from './types'
import { convertPlugin } from './convertPlugins'

export { Edtr, Legacy, Splish, isSplish, isEdtr } from './types'

export function convertRow(row: Row): (LayoutPlugin | OtherPlugin)[] {
  // no cells, then end the recursion
  if (!row.cells.length) return []

  // if more than one cell, than convert to special plugin 'layout'
  if (row.cells.length > 1) {
    return [
      {
        plugin: 'layout',
        state: row.cells.map((cell): LayoutPlugin['state'][0] => {
          return {
            width: cell.size || 12,
            child: {
              plugin: 'rows',
              state: convertCell(cell)
            }
          }
        })
      }
    ]
  }

  // otherwise continue with converting the only cell
  return convertCell(row.cells[0])
}

function convertCell(cell: Cell): (LayoutPlugin | OtherPlugin)[] {
  if (isContentCell(cell)) {
    return [convertPlugin(cell)]
  } else {
    return R.reduce(
      (plugins, row) => R.concat(plugins, convertRow(row)),
      [] as (LayoutPlugin | OtherPlugin)[],
      cell.rows
    )
  }
}
