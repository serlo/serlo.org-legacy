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
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { importantStatementPlugin } from '@edtr-io/plugin-important-statement'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { PluginRegistry } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { serloInjectionPlugin } from '@edtr-io/plugin-serlo-injection'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { tablePlugin } from '@edtr-io/plugin-table'
import { textPlugin } from '@edtr-io/plugin-text'
import { videoPlugin } from '@edtr-io/plugin-video'
import { terminatorPlugin } from '@entkenntnis/plugin-terminator'

import * as React from 'react'

import { deserialize, isError } from './deserialize'
import { createPlugins } from './plugins'
import { imagePlugin } from './plugins/image'

export interface EditorProps {
  children?: React.ReactNode
  onSave: (data: unknown) => Promise<void>
  onError?: (error: Error, context: Record<string, string>) => void
  initialState: unknown
  type: string
}

export const SaveContext = React.createContext<EditorProps['onSave']>(() => {
  return Promise.reject()
})

export function Editor(props: EditorProps) {
  let result = deserialize(props)
  const plugins = createPlugins(getRegistry())

  if (isError(result)) {
    const url = window.location.pathname.replace(
      'add-revision',
      'add-revision-old'
    )
    switch (result.error) {
      case 'type-unsupported':
        return (
          <div className="alert alert-danger" role="alert">
            Dieser Inhaltstyp wird vom neuen Editor noch nicht unterstützt.
            Bitte erstelle eine Bearbeitung mit{' '}
            <a href={url}>dem alten Editor</a>.
          </div>
        )
      case 'failure':
        return (
          <div className="alert alert-danger" role="alert">
            Leider trat ein Fehler bei der Konvertierung auf. Die Entwickler
            wurden informiert. Bitte benutze in der Zwischenzeit noch{' '}
            <a href={url}>den alten Editor</a> für diesen Inhalt.
          </div>
        )
    }
  }
  const stored = getStored()
  if (
    stored &&
    confirm(
      'Es wurde eine alte Bearbeitung von dir gefunden. Möchtest du diese wiederherstellen?'
    )
  ) {
    result = {
      success: true,
      initialState: stored
    }
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
        onError={props.onError}
        plugins={plugins}
        defaultPlugin="text"
        initialState={result.initialState}
        editable
      >
        {props.children}
      </Core>
    </SaveContext.Provider>
  )

  function getRegistry(): PluginRegistry {
    const isExercise = [
      'grouped-text-exercise',
      'text-exercise',
      'text-exercise-group'
    ].includes(props.type)
    return [
      {
        ...textPlugin,
        name: 'text'
      },
      {
        ...blockquotePlugin,
        name: 'blockquote'
      },
      {
        ...geogebraPlugin,
        name: 'geogebra'
      },
      {
        ...highlightPlugin,
        name: 'highlight'
      },
      {
        ...anchorPlugin,
        name: 'anchor'
      },
      {
        ...imagePlugin,
        name: 'image'
      },
      {
        ...importantStatementPlugin,
        name: 'important'
      },
      {
        ...serloInjectionPlugin,
        name: 'injection'
      },
      ...(isExercise
        ? [
            {
              ...inputExercisePlugin,
              name: 'inputExercise'
            }
          ]
        : []),
      ...(isExercise
        ? [
            {
              ...scMcExercisePlugin,
              name: 'scMcExercise'
            }
          ]
        : []),
      {
        ...spoilerPlugin,
        name: 'spoiler'
      },
      {
        ...tablePlugin,
        name: 'table'
      },
      {
        ...videoPlugin,
        name: 'video'
      },
      {
        ...terminatorPlugin,
        name: 'terminator'
      }
    ]
  }
}

function getStored(): { plugin: string; state?: unknown } | undefined {
  const edtr = localStorage.getItem('edtr')
  if (!edtr) return

  const state = JSON.parse(edtr)
  return state[window.location.pathname]
}

export function storeState(state: unknown) {
  const edtr = localStorage.getItem('edtr')
  if (!edtr) {
    localStorage.setItem(
      'edtr',
      JSON.stringify({
        [window.location.pathname]: state
      })
    )
  } else {
    const parsed = JSON.parse(edtr)
    localStorage.setItem(
      'edtr',
      JSON.stringify({
        ...parsed,
        [window.location.pathname]: state
      })
    )
  }
}
