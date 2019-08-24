/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { Editor as Core } from '@edtr-io/core'
import * as React from 'react'

import { deserialize } from './deserialize'
import { plugins } from './plugins'

export interface EditorProps {
  children?: React.ReactNode
  onSave: (data: unknown) => Promise<void>
  initialState: unknown
  type: string
}

export const SaveContext = React.createContext<EditorProps['onSave']>(() => {
  return Promise.reject()
})

export function Editor(props: EditorProps) {
  const initialState = deserialize(props)
  console.log('deserialized state', initialState)

  if (!initialState) {
    const url = window.location.pathname.replace(
      'add-revision',
      'add-revision-old'
    )
    return (
      <div className="alert alert-danger" role="alert">
        Dieser Inhaltstyp wird vom neuen Editor noch nicht unterstützt. Bitte
        erstelle eine Bearbeitung mit <a href={url}>dem alten Editor</a>.
      </div>
    )
  }

  return (
    <SaveContext.Provider value={props.onSave}>
      <div className="alert alert-warning" role="alert">
        <strong>Willkommen im neuen Serlo-Editor :)</strong>
        <br />
        Bitte beachte, dass sich der neue Editor noch in einer Testphase
        befindet. Du kannst dein Feedback in{' '}
        <a
          href="https://docs.google.com/document/d/1Lb_hB0zgwzIHgmDPY75XXJKVu5sa33UUwvNTQdRGALk/edit"
          target="_blank"
        >
          diesem Google Doc
        </a>{' '}
        hinterlassen (oder alternativ via Mail an jonas@serlo.org). Dort findest
        du auch eine Liste von bekannten Problemen und ggf. Workarounds.
      </div>
      <Core
        plugins={plugins}
        defaultPlugin="text"
        initialState={initialState}
        editable
      >
        {props.children}
      </Core>
    </SaveContext.Provider>
  )
}
