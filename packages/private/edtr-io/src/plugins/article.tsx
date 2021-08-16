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
import { AddButton } from '@edtr-io/editor-ui/internal'
import {
  child,
  EditorPlugin,
  EditorPluginProps,
  list,
  object,
} from '@edtr-io/plugin'
import * as React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { SemanticSection } from './helpers/semantic-section'
import { PluginToolbarButton } from '@edtr-io/core'
import { edtrDragHandle, EdtrIcon, faTrashAlt, Icon } from '@edtr-io/ui'

const articleState = object({
  content: child({ plugin: 'rows' }),
  exercises: list(child({ plugin: 'injection' })),
})

export type ArticlePluginState = typeof articleState
export type ArticleProps = EditorPluginProps<ArticlePluginState>

export const articlePlugin: EditorPlugin<ArticlePluginState> = {
  Component: ArticleEditor,
  state: articleState,
  config: {},
}

function ArticleEditor(props: ArticleProps) {
  const { editable, state } = props
  const { content, exercises } = state

  return (
    <React.Fragment>
      <SemanticSection editable={editable}>{content.render()}</SemanticSection>
      <SemanticSection editable={editable}>{renderExercises()}</SemanticSection>
    </React.Fragment>
  )

  function renderExercises() {
    // TODO: i18n
    const header = <h2>Übungsaufgaben</h2>
    return (
      <React.Fragment>
        {header}
        <DragDropContext
          onDragEnd={(result) => {
            const { source, destination } = result
            if (!destination) return
            exercises.move(source.index, destination.index)
          }}
        >
          <Droppable droppableId="default">
            {(provided: any) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {exercises.map((exercise, index) => {
                    return (
                      <Draggable
                        key={exercise.id}
                        draggableId={exercise.id}
                        index={index}
                      >
                        {(provided: any) => {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              {exercise.render({
                                renderToolbar() {
                                  return (
                                    <React.Fragment>
                                      {/*TODO: Label & i18n*/}
                                      <span {...provided.dragHandleProps}>
                                        <EdtrIcon icon={edtrDragHandle} />
                                      </span>
                                      <PluginToolbarButton
                                        icon={<Icon icon={faTrashAlt} />}
                                        // TODO: i18n
                                        label="Interaktives Element entfernen"
                                        onClick={() => {
                                          exercises.remove(index)
                                        }}
                                      />
                                    </React.Fragment>
                                  )
                                },
                              })}
                            </div>
                          )
                        }}
                      </Draggable>
                    )
                  })}
                </div>
              )
            }}
          </Droppable>
        </DragDropContext>
        {editable ? (
          <AddButton
            onClick={() => {
              exercises.insert(exercises.length)
            }}
          >
            {/*TODO: i18n*/}
            Add optional exercise
          </AddButton>
        ) : null}
      </React.Fragment>
    )
  }
}
