import { Editor as Core, EditorProps } from '@edtr-io/core'
import * as React from 'react'

import { plugins } from './plugins'

export function Editor(
  props: React.PropsWithChildren<{
    initialState: EditorProps['initialState']
    editable: EditorProps['editable']
  }>
) {
  return (
    <Core
      plugins={plugins}
      defaultPlugin="video"
      initialState={props.initialState}
      editable={props.editable}
    >
      {props.children}
    </Core>
  )
}
