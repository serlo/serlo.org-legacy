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
import { useI18n } from '@serlo/i18n'

const relatedContentItemState = object({ id: string(), title: string() })

const articleState = object({
  introduction: child({ plugin: 'articleIntroduction' }),
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
  const { editable, state } = props
  const { introduction, content, exercises, relatedContent, sources } = state

  const i18n = useI18n()
  const [focusedInlineSetting, setFocusedInlineSetting] = React.useState<{
    id: string
    index: number
  } | null>(null)

  function isFocused(id: string, index: number) {
    return (
      focusedInlineSetting &&
      focusedInlineSetting.id === id &&
      focusedInlineSetting.index === index
    )
  }

  return (
    <React.Fragment>
      <SemanticSection editable={editable}>
        {introduction.render()}
      </SemanticSection>
      <SemanticSection editable={editable}>{content.render()}</SemanticSection>
      <SemanticSection editable={editable}>{renderExercises()}</SemanticSection>
      <SemanticSection editable={editable}>
        {renderRelatedContent()}
      </SemanticSection>
      <SemanticSection editable={editable}>{renderSources()}</SemanticSection>
    </React.Fragment>
  )

  function renderExercises() {
    const header = <h2>{i18n.t('article::Exercises')}</h2>
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
                                        label={i18n.t(
                                          'article::Remove exercise'
                                        )}
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
            {i18n.t('article::Add optional exercise')}
          </AddButton>
        ) : null}
      </React.Fragment>
    )
  }

  function renderRelatedContent() {
    const header = (
      <React.Fragment>
        <h2>{i18n.t('article::Still want more?')}</h2>
        <p>
          {i18n.t('article::You can find more content on this topic here')}:
        </p>
      </React.Fragment>
    )

    const types: {
      section: 'articles' | 'courses' | 'videos' | 'exercises'
      label: string
      addLabel: string
    }[] = [
      {
        section: 'articles',
        label: i18n.t('article::Articles'),
        addLabel: i18n.t('article::Add article'),
      },
      {
        section: 'courses',
        label: i18n.t('article::Courses'),
        addLabel: i18n.t('article::Add course'),
      },
      {
        section: 'videos',
        label: i18n.t('article::Videos'),
        addLabel: i18n.t('article::Add video'),
      },
      {
        section: 'exercises',
        label: i18n.t('article::Exercises and exercise folders'),
        addLabel: i18n.t('article::Add exercise'),
      },
    ]

    return (
      <React.Fragment>
        {header}
        {types.map((type) => {
          return (
            <React.Fragment key={type.section}>
              {renderRelatedContentSection(type)}
            </React.Fragment>
          )
        })}
      </React.Fragment>
    )
  }

  function renderRelatedContentSection(type: {
    section: 'articles' | 'courses' | 'videos' | 'exercises'
    label: string
    addLabel: string
  }) {
    if (!editable && relatedContent[type.section].length === 0) {
      return null
    }

    return (
      <React.Fragment>
        ICON {type.label}
        <DragDropContext
          onDragEnd={(result) => {
            const { source, destination } = result
            if (!destination) return
            relatedContent[type.section].move(source.index, destination.index)
          }}
        >
          <Droppable droppableId="default">
            {(provided: any) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {relatedContent[type.section].map((item, index) => {
                    return (
                      <Draggable
                        key={index}
                        draggableId={`${type.section}-${index}`}
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
                              {isFocused(type.section, index) ? (
                                <InlineSettings
                                  onDelete={() => {
                                    relatedContent[type.section].remove(index)
                                  }}
                                  position="below"
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
                                  onFocus={() => {
                                    setFocusedInlineSetting({
                                      id: type.section,
                                      index,
                                    })
                                  }}
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
                        relatedContent[type.section].insert(
                          relatedContent[type.section].length
                        )
                      }}
                    >
                      {type.addLabel}
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
    return (
      <ThemeProvider theme={spoilerTheme}>
        <ExpandableBox
          renderTitle={() => i18n.t('article::Sources')}
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
                                  {isFocused('source', index) ? (
                                    <InlineSettings
                                      onDelete={() => {
                                        sources.remove(index)
                                      }}
                                      position="below"
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
                                      onFocus={() => {
                                        setFocusedInlineSetting({
                                          id: 'source',
                                          index,
                                        })
                                      }}
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
              {i18n.t('article::Add source')}
            </AddButton>
          ) : null}
        </ExpandableBox>
      </ThemeProvider>
    )
  }
}
