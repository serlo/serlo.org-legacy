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
  string,
} from '@edtr-io/plugin'
import * as React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { SemanticSection } from './helpers/semantic-section'
import { PluginToolbarButton } from '@edtr-io/core'
import {
  edtrDragHandle,
  EdtrIcon,
  faExternalLinkAlt,
  faTrashAlt,
  Icon,
  styled,
} from '@edtr-io/ui'
import { InlineSettings } from './helpers/inline-settings'
import { InlineSettingsInput } from './helpers/inline-settings-input'
import { InlineInput } from './helpers/inline-input'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from 'styled-components'

const relatedContentItemState = object({ id: string(), title: string() })

const articleState = object({
  content: child({ plugin: 'rows' }),
  exercises: list(child({ plugin: 'injection' })),
  relatedContent: object({
    articles: list(relatedContentItemState),
    courses: list(relatedContentItemState),
    videos: list(relatedContentItemState),
    exercises: list(relatedContentItemState),
  }),
  sources: list(
    object({
      href: string(),
      title: string(),
    })
  ),
})

export type ArticlePluginState = typeof articleState
export type ArticleProps = EditorPluginProps<ArticlePluginState>

export const articlePlugin: EditorPlugin<ArticlePluginState> = {
  Component: ArticleEditor,
  state: articleState,
  config: {},
}

const OpenInNewTab = styled.span({ margin: '0 0 0 10px' })

const spoilerTheme = {
  rendererUi: {
    expandableBox: {
      toggleBackgroundColor: '#f5f5f5',
      toggleColor: '#333',
      containerBorderColor: '#f5f5f5',
    },
  },
}

function ArticleEditor(props: ArticleProps) {
  const { editable, focused, state } = props
  const { content, exercises, relatedContent, sources } = state

  return (
    <React.Fragment>
      <SemanticSection editable={editable}>{content.render()}</SemanticSection>
      <SemanticSection editable={editable}>{renderExercises()}</SemanticSection>
      <SemanticSection editable={editable}>
        {renderRelatedContent()}
      </SemanticSection>
      <SemanticSection editable={editable}>{renderSources()}</SemanticSection>
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
                  {provided.placeholder}
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

  function renderRelatedContent() {
    const header = (
      <React.Fragment>
        {/*TODO: i18n*/}
        <h2>Du hast noch nicht genug vom Thema?</h2>
        {/*TODO: i18n*/}
        <p>Hier findet du noch weitere passende Inhalte zum Thema:</p>
      </React.Fragment>
    )

    return (
      <React.Fragment>
        {header}
        {['articles', 'courses', 'videos', 'exercises'].map((section) => {
          return (
            <React.Fragment key={section}>
              {renderRelatedContentSection(section)}
            </React.Fragment>
          )
        })}
      </React.Fragment>
    )
  }

  function renderRelatedContentSection(
    section: 'articles' | 'courses' | 'videos' | 'exercises'
  ) {
    if (!editable && relatedContent[section].length === 0) {
      return null
    }

    return (
      <React.Fragment>
        ICON {section}
        <DragDropContext
          onDragEnd={(result) => {
            const { source, destination } = result
            if (!destination) return
            relatedContent[section].move(source.index, destination.index)
          }}
        >
          <Droppable droppableId="default">
            {(provided: any) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {relatedContent[section].map((item, index) => {
                    return (
                      <Draggable
                        key={index}
                        draggableId={`${section}-${index}`}
                        index={index}
                      >
                        {(provided: any) => {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <span {...provided.dragHandleProps}>
                                <EdtrIcon icon={edtrDragHandle} />
                              </span>
                              {focused ? (
                                <InlineSettings
                                  onDelete={() => {
                                    relatedContent[section].remove(index)
                                  }}
                                  position={'below'}
                                >
                                  <InlineSettingsInput
                                    value={
                                      item.id.value !== ''
                                        ? `/${item.id.value}`
                                        : ''
                                    }
                                    // TODO: placeholder
                                    placeholder={'todo'}
                                    onChange={(event) => {
                                      const newValue = event.target.value.replace(
                                        /[^0-9]/g,
                                        ''
                                      )
                                      item.id.set(newValue)
                                    }}
                                  />
                                  <a
                                    target="_blank"
                                    href={
                                      item.id.value !== ''
                                        ? `/${item.id.value}`
                                        : ''
                                    }
                                    rel="noopener noreferrer"
                                  >
                                    <OpenInNewTab
                                      // TODO: title
                                      title={'todo'}
                                    >
                                      <Icon icon={faExternalLinkAlt} />
                                    </OpenInNewTab>
                                  </a>
                                </InlineSettings>
                              ) : null}
                              <a>
                                <InlineInput
                                  value={item.title.value}
                                  onChange={(value) => {
                                    item.title.set(value)
                                  }}
                                  // TODO: placeholder
                                  placeholder={'todo'}
                                />
                              </a>
                            </div>
                          )
                        }}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                  {editable ? (
                    <AddButton
                      onClick={() => {
                        relatedContent[section].insert(
                          relatedContent[section].length
                        )
                      }}
                    >
                      {/*TODO: i18n*/}
                      Add {section}
                    </AddButton>
                  ) : null}
                </div>
              )
            }}
          </Droppable>
        </DragDropContext>
      </React.Fragment>
    )
  }

  function renderSources() {
    // TODO: i18n
    return (
      <ThemeProvider theme={spoilerTheme}>
        <ExpandableBox
          renderTitle={() => 'Quellen'}
          editable={editable}
          alwaysVisible
        >
          <DragDropContext
            onDragEnd={(result) => {
              const { source, destination } = result
              if (!destination) return
              sources.move(source.index, destination.index)
            }}
          >
            <Droppable droppableId="default">
              {(provided: any) => {
                return (
                  <ul ref={provided.innerRef} {...provided.droppableProps}>
                    {sources.map((source, index) => {
                      return (
                        <Draggable
                          key={index}
                          draggableId={`${index}`}
                          index={index}
                        >
                          {(provided: any) => {
                            return (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <span {...provided.dragHandleProps}>
                                  <EdtrIcon icon={edtrDragHandle} />
                                </span>
                                <span>
                                  {focused ? (
                                    <InlineSettings
                                      onDelete={() => {
                                        sources.remove(index)
                                      }}
                                      position={'below'}
                                    >
                                      <InlineSettingsInput
                                        value={source.href.value}
                                        // TODO: placeholder
                                        placeholder={'todo'}
                                        onChange={(event) => {
                                          source.href.set(event.target.value)
                                        }}
                                      />
                                      <a
                                        target="_blank"
                                        href={source.href.value}
                                        rel="noopener noreferrer"
                                      >
                                        <OpenInNewTab
                                          // TODO: title
                                          title={'todo'}
                                        >
                                          <Icon icon={faExternalLinkAlt} />
                                        </OpenInNewTab>
                                      </a>
                                    </InlineSettings>
                                  ) : null}
                                  <a>
                                    <InlineInput
                                      value={source.title.value}
                                      onChange={(value) => {
                                        source.title.set(value)
                                      }}
                                      // TODO: placeholder
                                      placeholder={'todo'}
                                    />
                                  </a>
                                </span>
                              </li>
                            )
                          }}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </ul>
                )
              }}
            </Droppable>
          </DragDropContext>
          {editable ? (
            <AddButton
              onClick={() => {
                sources.insert(sources.length)
              }}
            >
              {/*TODO: i18n*/}
              Add source
            </AddButton>
          ) : null}
        </ExpandableBox>
      </ThemeProvider>
    )
  }
}
