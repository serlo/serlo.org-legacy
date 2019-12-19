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
import * as React from 'react'
import { AddButton } from '@edtr-io/editor-ui'
import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  list,
  string
} from '@edtr-io/plugin'

import {
  editorContent,
  entity,
  Controls,
  serializedChild,
  HeaderInput,
  OptionalChild,
  entityType
} from './common'
import { Settings } from './helpers/settings'

export const courseTypeState = entityType(
  {
    ...entity,
    title: string(),
    description: editorContent(),
    reasoning: editorContent(),
    meta_description: string()
  },
  {
    'course-page': list(serializedChild('type-course-page'))
  }
)

export const courseTypePlugin: StatefulPlugin<typeof courseTypeState> = {
  Component: CourseTypeEditor,
  state: courseTypeState
}

function CourseTypeEditor(
  props: StatefulPluginEditorProps<typeof courseTypeState>
) {
  const { title, meta_description, 'course-page': children } = props.state

  return (
    <article>
      <Settings
        id={props.state.id.value}
        onSwitchRevision={props.state.replaceOwnState}
      >
        <Settings.Textarea
          label="Suchmaschinen-Beschreibung"
          state={meta_description}
        />
      </Settings>
      <h1>
        {props.editable ? (
          <HeaderInput
            placeholder="Titel"
            value={title.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              title.set(e.target.value)
            }}
          />
        ) : (
          <span itemProp="name">{title.value}</span>
        )}
      </h1>
      {children.map((child, index) => {
        return (
          <OptionalChild
            state={child}
            key={child.id}
            onRemove={() => {
              children.remove(index)
            }}
          />
        )
      })}
      <hr />
      <AddButton onClick={() => children.insert()}>
        Kursseite hinzufügen
      </AddButton>
      <Controls subscriptions {...props.state} />
    </article>
  )
}
