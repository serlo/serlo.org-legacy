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
import { EditorInput } from '@edtr-io/editor-ui'
import { entity, Controls, editorContent } from '../entities/common'

export const mathPuzzleTypeState = StateType.object({
  ...entity,
  source: StateType.string(),
  content: editorContent()
})

export const mathPuzzleTypePlugin: StatefulPlugin<
  typeof mathPuzzleTypeState
> = {
  Component: MathPuzzleTypeEditor,
  state: mathPuzzleTypeState
}

function MathPuzzleTypeEditor(
  props: StatefulPluginEditorProps<typeof mathPuzzleTypeState>
) {
  const { source, content, changes, license } = props.state

  function handleSourceChange(e: React.ChangeEvent<HTMLInputElement>) {
    source.set(e.target.value)
  }

  console.log('state', props.state.content())
  console.log('foo')

  return (
    <article>
      <div className="page-header">
        <h1>
          {props.editable ? (
            <EditorInput
              placeholder="Source"
              value={source.value}
              onChange={handleSourceChange}
            />
          ) : (
            <span itemProp="name">{source.value}</span>
          )}{' '}
        </h1>
      </div>
      <div itemProp="articleBody">{content.render()}</div>
      <Controls />
      {/*{props.editable && props.focused ? (*/}
      {/*  <React.Fragment>*/}
      {/*    {reasoning.render()}*/}
      {/*    <Overlay>*/}
      {/*      <OverlayInput*/}
      {/*        label="Suchmaschinen-Titel"*/}
      {/*        placeholder="Ein Titel für die Suchmaschine. Standardwert: der Titel"*/}
      {/*        value={meta_title.value}*/}
      {/*        onChange={handleMetaTitleChange}*/}
      {/*      />*/}
      {/*      <Textarea*/}
      {/*        label="Suchmaschinen-Beschreibung"*/}
      {/*        placeholder="Gib hier eine Beschreibung für die Suchmaschine ein (ca. 160 Zeichen). Standardwert: Der Anfang des Artikels"*/}
      {/*        value={meta_description.value}*/}
      {/*        onChange={handleMetaDescriptionChange}*/}
      {/*      />*/}
      {/*      <OverlayInput*/}
      {/*        label="Lizenz"*/}
      {/*        value={license.id.value}*/}
      {/*        disabled={true}*/}
      {/*        onChange={handleLicenseChange}*/}
      {/*      />*/}
      {/*    </Overlay>*/}
      {/*  </React.Fragment>*/}
      {/*) : null}*/}
    </article>
  )
}
