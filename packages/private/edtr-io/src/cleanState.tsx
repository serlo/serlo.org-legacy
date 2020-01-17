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
import * as R from 'ramda'
import { Edtr } from '@serlo/legacy-editor-to-editor'
// import { slateValueToHtml } from '@edtr-io/plugin-text-state'
import Html from 'slate-html-serializer'
import * as React from 'react'
import { Value, ValueJSON, Data } from 'slate'
import { Rule } from 'slate-html-serializer'

/* eslint-disable @typescript-eslint/no-explicit-any */
function cleanJson(jsonObj: any): any {
  if (jsonObj !== null && typeof jsonObj === 'object') {
    return R.map((value: any) => {
      if (value.plugin === 'text' && value.state) {
        // found a text plugin
        return {
          ...value,
          state: slateValueToHtml(Value.fromJSON(value.state))
        }
      }
      return cleanJson(value)
    }, jsonObj)
  } else {
    // jsonObj is a number or string
    return jsonObj
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function cleanEdtrState(state: Edtr) {
  return cleanJson(state)
}

/*
 * Everything below is from https://github.com/edtr-io/edtr-io/pull/234
 */
export const paragraphNode = 'paragraph'

export const orderedListNode = 'ordered-list'
export const unorderedListNode = 'unordered-list'
export const listItemNode = 'list-item'
export const listItemChildNode = 'list-item-child'

export const linkNode = '@splish-me/a'
export const colorMark = '@splish-me/color'
export const strongMark = '@splish-me/strong'
export const emphasizeMark = '@splish-me/em'
export const katexInlineNode = '@splish-me/katex-inline'

export const katexBlockNode = '@splish-me/katex-block'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export const createHeadingNode = (level: HeadingLevel) => {
  return `@splish-me/h${level}`
}

export const defaultNode = paragraphNode

export const slateSchema = {
  inlines: {
    [katexInlineNode]: {
      isVoid: true
    },
    [linkNode]: {
      text: /.+/
    }
  },
  blocks: {
    [katexBlockNode]: {
      isVoid: true
    }
  }
}

export const emptyDocument: ValueJSON = {
  document: {
    nodes: [
      {
        object: 'block',
        type: defaultNode,
        nodes: [
          {
            object: 'text'
          }
        ]
      }
    ]
  }
}

export const rules: Rule[] = [
  // paragraph
  {
    serialize(obj, children) {
      const block = obj

      if (
        block.object === 'block' &&
        (block.type === paragraphNode || block.type === '@splish-me/p')
      ) {
        return <p>{children}</p>
      }
    },

    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'p') {
        return {
          object: 'block',
          type: paragraphNode,
          nodes: next(el.childNodes)
        }
      }
    }
  },
  // rich text
  {
    serialize(obj, children) {
      const mark = obj
      if (mark.object === 'mark') {
        switch (mark.type) {
          case strongMark:
            return <strong>{children}</strong>
          case emphasizeMark:
            return <em>{children}</em>
        }
      }
    },

    deserialize(el, next) {
      switch (el.tagName.toLowerCase()) {
        case 'strong':
        case 'b':
          return {
            object: 'mark',
            type: strongMark,
            nodes: next(el.childNodes)
          }
        case 'em':
        case 'i':
          return {
            object: 'mark',
            type: emphasizeMark,
            nodes: next(el.childNodes)
          }
        default:
          return
      }
    }
  },
  // link
  {
    serialize(obj, children) {
      const block = obj

      if (block.object === 'inline' && block.type === linkNode) {
        const { data } = block

        if (!data) {
          return null
        }

        return <a href={data.get('href')}>{children}</a>
      }
    },

    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'a') {
        const href = el.getAttribute('href')

        return {
          object: 'inline',
          type: linkNode,
          nodes: next(el.childNodes),
          data: Data.create({
            href: href ? href : ''
          })
        }
      }
    }
  },
  // headings
  {
    serialize(obj, children) {
      const block = obj

      if (block.object === 'block') {
        for (let i = 1; i <= 6; i++) {
          const headingNode = createHeadingNode(i as HeadingLevel)
          if (block.type === headingNode) {
            return React.createElement(`h${i}`, {}, children)
          }
        }
      }
    },

    deserialize(el, next) {
      const match = /h([1-6])/.exec(el.tagName.toLowerCase())

      if (match) {
        const level = parseInt(match[1], 10) as HeadingLevel

        console.log('create heading', level)

        return {
          object: 'block',
          type: createHeadingNode(level),
          nodes: next(el.childNodes)
        }
      }
    }
  },
  // lists
  {
    serialize(obj, children) {
      const block = obj
      if (block.object === 'block') {
        switch (block.type) {
          case unorderedListNode:
            return <ul>{children}</ul>
          case orderedListNode:
            return <ol>{children}</ol>
          case listItemNode:
            return <li>{children}</li>
          case listItemChildNode:
            return <>{children}</>
        }
      }
    },

    deserialize(el, next) {
      switch (el.tagName.toLowerCase()) {
        case 'ol':
          return {
            object: 'block',
            type: orderedListNode,
            nodes: next(el.childNodes)
          }
        case 'ul':
          return {
            object: 'block',
            type: unorderedListNode,
            nodes: next(el.childNodes)
          }
        case 'li':
          return {
            object: 'block',
            type: listItemNode,
            nodes: [
              {
                object: 'block',
                type: listItemChildNode,
                nodes: next(el.childNodes)
              }
            ]
          }
      }
    }
  },
  // edtr-io specific: katex
  {
    serialize(obj, _children) {
      const block = obj

      if (block.object === 'block' && block.type === katexBlockNode) {
        // @ts-ignore, custom tag
        return <katexblock>{block.data.get('formula')}</katexblock>
      }

      const inline = obj

      if (inline.object === 'inline' && inline.type === katexInlineNode) {
        // @ts-ignore, custom tag
        return <katexinline>{block.data.get('formula')}</katexinline>
      }
    },

    deserialize(el, next) {
      switch (el.tagName.toLowerCase()) {
        case 'katexblock':
          return {
            object: 'block',
            type: katexBlockNode,
            data: {
              formula: el.childNodes[0].nodeValue,
              inline: false
            },
            nodes: next(el.childNodes)
          }
        case 'katexinline':
          return {
            object: 'inline',
            type: katexInlineNode,
            data: {
              formula: el.childNodes[0].nodeValue,
              inline: true
            },
            nodes: next(el.childNodes)
          }
        default:
          return
      }
    }
  },
  // edtr-io specific: color
  {
    serialize(obj, children) {
      const mark = obj
      if (mark.object === 'mark' && mark.type === colorMark) {
        const colorIndex = mark.data.get('colorIndex')
        // @ts-ignore, custom tag
        return <color index={colorIndex}>{children}</color>
      }
    },

    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'color') {
        const colorIndex = el.getAttribute('index')

        return {
          object: 'mark',
          type: linkNode,
          nodes: next(el.childNodes),
          data: Data.create({
            colorIndex: parseInt(colorIndex ? colorIndex : '')
          })
        }
      }
    }
  }
]

const serializer = new Html({ rules, defaultBlock: { type: defaultNode } })

export function htmlToSlateValue(html: string) {
  return serializer.deserialize(html, { toJSON: false })
}

export function slateValueToHtml(value: Value) {
  return serializer.serialize(value, { render: true })
}
