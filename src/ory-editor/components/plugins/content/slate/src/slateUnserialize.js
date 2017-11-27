// @flow
// FIXME #125: missing types for slate internals
/* eslint-disable new-cap, arrow-body-style, react/display-name */
import { List } from 'immutable'
import head from 'ramda/src/head'
import map from 'ramda/src/map'
import path from 'ramda/src/path'
import reduce from 'ramda/src/reduce'
import tail from 'ramda/src/tail'
import React from 'react'
import type { Props } from 'ory-editor-plugins-slate/lib/Component'
import AlignmentPlugin from 'ory-editor-plugins-slate/lib/plugins/alignment'
import BlockquotePlugin from 'ory-editor-plugins-slate/lib/plugins/blockquote'
import CodePlugin from 'ory-editor-plugins-slate/lib/plugins/code'
import EmphasizePlugin from 'ory-editor-plugins-slate/lib/plugins/emphasize'
import HeadingsPlugin from 'ory-editor-plugins-slate/lib/plugins/headings'
import LinkPlugin from 'ory-editor-plugins-slate/lib/plugins/link'
import ListsPlugin from 'ory-editor-plugins-slate/lib/plugins/lists'
import ParagraphPlugin, {
  P
} from 'ory-editor-plugins-slate/lib/plugins/paragraph'
import KatexPlugin from './plugins/katex'

import parse5 from 'parse5'

// FIXME #126
import { Document, Html, Raw, State, Plain } from 'slate'

const DEFAULT_NODE = P

export const defaultPlugins = [
  new ParagraphPlugin(),
  new EmphasizePlugin(),
  new HeadingsPlugin({ DEFAULT_NODE }),
  new LinkPlugin(),
  new CodePlugin({ DEFAULT_NODE }),
  new ListsPlugin({ DEFAULT_NODE }),
  new BlockquotePlugin({ DEFAULT_NODE }),
  new AlignmentPlugin(),
  new KatexPlugin({ DEFAULT_NODE })
]

export const lineBreakSerializer = {
  deserialize (el: any) {
    if (el.tagName.toLowerCase() === 'br') {
      return { kind: 'text', text: '\n' }
    }
  },
  serialize (object: any, children: any) {
    if (object.type === 'text' || children === '\n') {
      return <br />
    }
  }
}

export const html = new Html({
  rules: [...defaultPlugins, lineBreakSerializer],
  parseHtml: parse5.parseFragment
})

const options = { terse: true }

export const createInitialState = () => ({
  editorState: Raw.deserialize(
    {
      nodes: [
        {
          kind: 'block',
          type: P,
          nodes: [
            {
              kind: 'text',
              text: ''
            }
          ]
        }
      ]
    },
    options
  )
})

export const unserialize = ({
  importFromHtml,
  serialized,
  editorState
}: {
  importFromHtml: string,
  serialized: Object,
  editorState: Object
}): { editorState: Object } => {
  if (serialized) {
    return { editorState: Raw.deserialize(serialized, options) }
  } else if (importFromHtml) {
    return { editorState: html.deserialize(importFromHtml, options) }
  } else if (editorState) {
    return { editorState }
  }

  return createInitialState()
}

export const serialize = ({ editorState }: any) => {
  console.log('serializing editorState')

  return {
    serialized: Raw.serialize(editorState, options)
  }
}
