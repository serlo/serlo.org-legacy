/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { AddButton, styled } from '@edtr-io/editor-ui/internal'
import { boolean, EditorPlugin, EditorPluginProps, list } from '@edtr-io/plugin'
import { useI18n } from '@serlo/i18n'
import * as React from 'react'

import {
  editorContent,
  entity,
  Controls,
  serializedChild,
  OptionalChild,
  entityType,
} from './common'
import { RevisionHistory } from './helpers/settings'
import { SemanticSection } from '../helpers/semantic-section'

export const textExerciseGroupTypeState = entityType(
  {
    ...entity,
    content: editorContent(),
    cohesive: boolean(false),
  },
  {
    'grouped-text-exercise': list(serializedChild('type-text-exercise')),
  }
)

export const textExerciseGroupTypePlugin: EditorPlugin<
  typeof textExerciseGroupTypeState
> = {
  Component: TextExerciseGroupTypeEditor,
  state: textExerciseGroupTypeState,
  config: {},
}

function TextExerciseGroupTypeEditor(
  props: EditorPluginProps<typeof textExerciseGroupTypeState>
) {
  const { cohesive, content, 'grouped-text-exercise': children } = props.state
  const i18n = useI18n()
  const isCohesive = cohesive.value ?? false

  console.log(42)
  console.log(cohesive.value)

  return (
    <article className="exercisegroup">
      {getTypeDescription()}
      {props.renderIntoToolbar(
        <RevisionHistory
          id={props.state.id.value}
          currentRevision={props.state.revision.value}
          onSwitchRevision={props.state.replaceOwnState}
        />
      )}
      <section className="row">
        <SemanticSection editable={props.editable}>
          {content.render()}
        </SemanticSection>
      </section>
      {children.map((child, index) => {
        return (
          <section className="row" key={child.id}>
            <div className="col-sm-1 hidden-xs">
              <em>{getExerciseIndex(index)})</em>
            </div>
            <div className="col-sm-11 col-xs-12">
              <OptionalChild
                state={child}
                removeLabel={i18n.t('textExerciseGroup::Remove exercise')}
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
        {i18n.t('textExerciseGroup::Add exercise')}
      </AddButton>
      <Controls subscriptions {...props.state} />
    </article>
  )

  function getTypeDescription() {
    if (!props.editable) return null

    return (
      <h4>
        Aufgabe mit{' '}
        <InlineSelect
          value={isCohesive ? 'cohesive' : 'non-cohesive'}
          onChange={(e) => cohesive.set(e.target.value === 'cohesive')}
        >
          <option value="non-cohesive">nicht zusammenhängenden</option>
          <option value="cohesive">zusammenhängenden</option>
        </InlineSelect>{' '}
        Teilaufgaben:
      </h4>
    )
  }

  function getExerciseIndex(index: number) {
    return isCohesive ? index + 1 : String.fromCharCode(97 + index)
  }
}

const InlineSelect = styled.select`
  background-color: white;
  border: none;
`
