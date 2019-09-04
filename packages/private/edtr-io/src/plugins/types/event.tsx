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
import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  StateType
} from '@edtr-io/core'

import { editorContent, entity, Controls, HeaderInput } from './common'
import { Settings } from './helpers/settings'

export const eventTypeState = StateType.object({
  ...entity,
  title: StateType.string(),
  content: editorContent(),
  meta_title: StateType.string(),
  meta_description: StateType.string()
})

export const eventTypePlugin: StatefulPlugin<typeof eventTypeState> = {
  Component: EventTypeEditor,
  state: eventTypeState
}

function EventTypeEditor(
  props: StatefulPluginEditorProps<typeof eventTypeState>
) {
  const { content, title, meta_title, meta_description } = props.state

  return (
    <React.Fragment>
      <div className="page-header">
        <Settings>
          <Settings.Textarea label="Suchmaschinen-Titel" state={meta_title} />
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
      </div>
      <article>{content.render()}</article>
      <Controls subscriptions {...props.state} />
    </React.Fragment>
  )
}
