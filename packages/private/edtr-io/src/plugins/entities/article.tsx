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
import BSFormGroup from 'react-bootstrap/lib/FormGroup'
import BSControlLabel from 'react-bootstrap/lib/ControlLabel'
import BSFormControl from 'react-bootstrap/lib/FormControl'
import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  StateType
} from '@edtr-io/core'
import { EditorInput } from '@edtr-io/editor-ui'
import {
  standardElements,
  Controls,
  editorContent,
  EntitySettings,
  HeaderInput
} from './common'

export const articleEntityState = StateType.object({
  ...standardElements,
  title: StateType.string(),
  content: editorContent(),
  reasoning: editorContent(),
  meta_title: StateType.string(),
  meta_description: StateType.string()
})

export const articleEntityPlugin: StatefulPlugin<typeof articleEntityState> = {
  Component: ArticleEntityEditor,
  state: articleEntityState
}

function ArticleEntityEditor(
  props: StatefulPluginEditorProps<typeof articleEntityState>
) {
  const {
    title,
    content,
    changes,
    meta_title,
    meta_description,
    license
  } = props.state

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    title.set(e.target.value)
  }

  return (
    <React.Fragment>
      <div className="page-header">
        <EntitySettings>
          <BSFormGroup>
            <BSControlLabel>Suchmaschinen-Titel</BSControlLabel>
            <BSFormControl
              componentClass="textarea"
              value={meta_title.value}
              onChange={e => {
                const { value } = e.target as HTMLTextAreaElement
                meta_title.set(value)
              }}
            />
          </BSFormGroup>
          <BSFormGroup>
            <BSControlLabel>Suchmaschinen-Beschreibung</BSControlLabel>
            <BSFormControl
              componentClass="textarea"
              value={meta_description.value}
              onChange={e => {
                const { value } = e.target as HTMLTextAreaElement
                meta_description.set(value)
              }}
            />
          </BSFormGroup>
        </EntitySettings>
        <h1>
          {props.editable ? (
            <HeaderInput
              placeholder="Titel"
              value={title.value}
              onChange={handleTitleChange}
            />
          ) : (
            <span itemProp="name">{title.value}</span>
          )}
        </h1>
      </div>
      <div itemProp="articleBody">{content.render()}</div>
      <Controls license={license} subscriptions changes={changes} />
    </React.Fragment>
  )
}
