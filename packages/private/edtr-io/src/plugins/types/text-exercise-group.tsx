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
import { AddButton } from '@edtr-io/editor-ui'
import { EditorPlugin, EditorPluginProps, list } from '@edtr-io/plugin'
import * as React from 'react'

import {
  editorContent,
  entity,
  Controls,
  serializedChild,
  OptionalChild,
  entityType
} from './common'
import { RevisionHistory, Settings } from './helpers/settings'
import {
  Content,
  SemanticPluginTypes,
  Controls as GuidelineControls,
  ControlButton as GuidelineButton,
  Overlay,
  exerciseGuideline
} from '../semantic-plugin-helpers'
import { Icon } from '@edtr-io/ui'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { useScopedSelector } from '@edtr-io/core'
import { getFocusPath } from '@edtr-io/store'

export const textExerciseGroupTypeState = entityType(
  {
    ...entity,
    content: editorContent()
  },
  {
    'grouped-text-exercise': list(serializedChild('type-text-exercise'))
  }
)

export const textExerciseGroupTypePlugin: EditorPlugin<typeof textExerciseGroupTypeState> = {
  Component: TextExerciseGroupTypeEditor,
  state: textExerciseGroupTypeState,
  config: {}
}

function TextExerciseGroupTypeEditor(
  props: EditorPluginProps<typeof textExerciseGroupTypeState>
) {
  const { content, 'grouped-text-exercise': children } = props.state
  const [exerciseHelpVisible, setExerciseHelp] = React.useState(false)
  const focusPath = useScopedSelector(getFocusPath())
  return (
    <article className="exercisegroup">
      {props.renderIntoToolbar(
        <RevisionHistory
          id={props.state.id.value}
          currentRevision={props.state.revision.value}
          onSwitchRevision={props.state.replaceOwnState}
        />
      )}
      <section className="row">
        <div style={{ position: 'relative' }}>
          <Content type={SemanticPluginTypes.exercise} boxfree>
            {content.render()}
          </Content>
          <GuidelineControls
            show={(focusPath && focusPath.includes(props.id)) || false}
          >
            <GuidelineButton
              onMouseDown={() => {
                setExerciseHelp(true)
              }}
            >
              <Icon icon={faQuestion} />
            </GuidelineButton>
          </GuidelineControls>
          <Overlay
            content={exerciseGuideline}
            open={exerciseHelpVisible}
            setOpen={setExerciseHelp}
          />
        </div>
      </section>
      {children.map((child, index) => {
        return (
          <section className="row" key={child.id}>
            <div className="col-sm-1 hidden-xs">
              <em>{String.fromCharCode(97 + index)})</em>
            </div>
            <div className="col-sm-11 col-xs-12">
              <OptionalChild
                state={child}
                onRemove={() => {
                  children.remove(index)
                }}
              />
            </div>
          </section>
        )
      })}
      <AddButton
        onClick={() => {
          children.insert()
        }}
      >
        Teilaufgabe hinzufügen
      </AddButton>
      <Controls subscriptions {...props.state} />
    </article>
  )
}
