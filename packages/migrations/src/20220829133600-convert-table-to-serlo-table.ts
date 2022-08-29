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
import { converter } from '@serlo/markdown'
import { parseDocument } from 'htmlparser2'

import { createEdtrIoMigration, replacePlugins, Plugin } from './utils'

createEdtrIoMigration({
  exports,
  migrateState: replacePlugins({
    table({ plugin }) {
      if (typeof plugin.state !== 'string') {
        throw new Error('plugin state is not a string')
      }

      const html = converter.makeHtml(plugin.state)

      return convertTable(html)
    },
  }),
})

interface LegacyNode {
  type: string
  name: string
  attribs: {
    class?: string
    href?: string
    src?: string
    alt?: string
    id?: string
  }
  children: LegacyNode[]
  text?: string
  data?: string
}

function convertTable(html: string): Plugin {
  const dom = parseDocument(html) as unknown as LegacyNode[]

  const table = dom[0].children.filter((child) => child.type === 'tag')[0]
  if (!table || table.name !== 'table') {
    throw new Error('table is not defined')
  }

  const tHeadAndTBody = table.children.filter((child) => child.type === 'tag')
  if (tHeadAndTBody.length !== 2) {
    throw new Error('table has empty length')
  }

  const rows = [
    ...tHeadAndTBody[0].children,
    ...tHeadAndTBody[1].children,
  ].filter((child) => child.type === 'tag')

  const convertedRows = rows.map((row) => {
    const columns = row.children
      .filter((col) => col.type === 'tag')
      .map((col) => {
        return {
          content: {
            plugin: 'text',
            state: convertCellContent(col),
          },
        }
      })
    return {
      columns,
    }
  })

  return {
    plugin: 'serloTable',
    state: {
      tableType: 'OnlyColumnHeader',
      rows: convertedRows,
    },
  }
}

function convertCellContent(cell: LegacyNode) {
  if (cell.children.length === 0) return []
  if (cell.children.length > 1 || cell.children[0].name !== 'p') {
    throw 'unknown state'
  }
  const contentNodes = cell.children[0].children

  const converted = contentNodes.map(convertContentNode)
  // console.log([{ type: 'p', children: [converted] }])
  return [{ plugin: 'text', state: [{ type: 'p', children: converted }] }]
}

function convertContentNode(node: LegacyNode) {
  //handle code? 0: {text: "Test", code: true}

  if (node.type === 'text') return { text: node.data ?? '' }

  if (node.type === 'tag') {
    // console.log(node.name)
    if (node.name === 'br') {
      return { text: ' ' }
    }

    if (node.name === 'strong') {
      return { text: node.children[0].data ?? '', strong: true }
    }

    if (node.name === 'em') {
      return { text: node.children[0].data ?? '', em: true }
    }

    if (node.name === 'span' && node.attribs.class === 'mathInline') {
      if (node.children.length !== 1) {
        console.log('mathInline: unexpected state, skipping')
        return { text: '' }
      }
      const mathContent =
        node.children[0].children[0].data?.replace(/%%/, '') ?? ''
      // not working as expected?!
      return {
        type: 'math',
        src: mathContent,
        inline: true,
        children: [{ text: mathContent }], //???
      }
    }
    console.log('unsupported tag')
    console.log(node.name)
    console.log(node)
    return []
  }

  console.log('unsupported type')
  console.log(node.type)
  console.log(node)

  return { text: 'test' }
}
