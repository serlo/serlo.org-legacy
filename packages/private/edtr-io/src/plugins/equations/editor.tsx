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
import {
  HotKeys,
  useScopedDispatch,
  useScopedSelector,
  useScopedStore,
} from '@edtr-io/core'
import { focusNext, focusPrevious, getFocused, isEmpty } from '@edtr-io/store'
import {
  Icon,
  faPlus,
  faTimes,
  styled,
  EdtrIcon,
  edtrDragHandle,
} from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { EquationsProps } from '.'
import { LayoutContainer, EquationsRenderer } from './renderer'
import { useI18n } from '@serlo/i18n'
import { Sign, renderSignToString } from './sign'

const ButtonContainer = styled.div({
  display: 'flex',
  float: 'right',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'absolute',
  right: '-50px',
  zIndex: 10,
})

const RemoveButton = styled.button({
  outline: 'none',
  width: '35px',
  border: 'none',
  background: 'transparent',
})
const DragButton = styled.div({
  cursor: 'grab',
  paddingRight: '5px',
})

const AddButton = styled.button({
  border: '2px solid  #007ec1',
  borderRadius: '5px',
  color: '#007ec1',
  outline: 'none',
  padding: '5px',
  margin: 'auto',
  marginTop: '10px',
  backgroundColor: 'transparent',
})

const AddButtonWrapper = styled.div({
  textAlign: 'center',
})

const Header = styled.div({
  textAlign: 'center',
  width: '33%',
})

const DropDown = styled.select({
  height: '30px',
  width: '35px',
  marginLeft: '15px',
  marginRight: '10px',
  backgroundColor: 'lightgrey',
  border: '1px solid lightgrey',
  borderRadius: '5px',
})

export function EquationsEditor(props: EquationsProps) {
  const i18n = useI18n()
  const store = useScopedStore()
  const focusedElement = useScopedSelector(getFocused())
  const dispatch = useScopedDispatch()

  const insertWithRightSymbol = () => {
    const length = props.state.steps.length
    const sign =
      length > 0 ? props.state.steps[length - 1].sign.value : Sign.Equals
    props.state.steps.insert(length, {
      left: { plugin: 'text', state: undefined },
      right: { plugin: 'text', state: undefined },
      transform: { plugin: 'text', state: undefined },
      sign,
    })
  }
  const addButton = () => {
    insertWithRightSymbol()
  }
  const removeButton = (index: number) => () => {
    const { state } = props
    state.steps.remove(index)
  }
  const handleKeyDown = (e: KeyboardEvent | undefined, next: () => void) => {
    e && e.preventDefault()
    next()
  }

  const { focused, state, editable } = props
  const children = R.flatten(
    props.state.steps.map((step) => {
      return [step.left.id, step.right.id, step.transform.id]
    })
  )
  const noEmptyLine = !R.includes(
    false,
    props.state.steps.map((step) => {
      return R.includes(false, [
        isEmpty(step.left.id)(store.getState()),
        isEmpty(step.right.id)(store.getState()),
        isEmpty(step.transform.id)(store.getState()),
      ])
    })
  )
  return editable && (focused || R.includes(focusedElement, children)) ? (
    <HotKeys
      keyMap={{
        FOCUS_NEXT: 'tab',
        FOCUS_PREV: 'shift+tab',
        NEW_LINE: 'return',
      }}
      handlers={{
        FOCUS_NEXT: (e) => {
          handleKeyDown(e, () => {
            dispatch(focusNext())
          })
        },
        FOCUS_PREV: (e) => {
          handleKeyDown(e, () => {
            dispatch(focusPrevious())
          })
        },
        NEW_LINE: (e) => {
          if (noEmptyLine) {
            handleKeyDown(e, () => {
              insertWithRightSymbol()
            })
          }
        },
      }}
    >
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <DragDropContext
        onDragEnd={(result) => {
          const { source, destination } = result
          if (!destination) {
            return
          }
          state.steps.move(source.index, destination.index)
        }}
      >
        <Droppable droppableId="default" direction="vertical">
          {(provided: any) => {
            return (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <LayoutContainer>
                  <Header>
                    <strong>{i18n.t('equations::Left-hand side')}</strong>
                  </Header>
                  <Header>
                    <strong>{i18n.t('equations::Right-hand side')}</strong>
                  </Header>
                  <Header>
                    <strong>
                      {i18n.t('equations::Transformation / explanation')}
                    </strong>
                  </Header>
                </LayoutContainer>
                {state.steps.map((step, index) => {
                  return (
                    <Draggable
                      key={index}
                      draggableId={step.left.id}
                      index={index}
                    >
                      {(provided: any) => {
                        return (
                          <LayoutContainer
                            className="row"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <div
                              style={{
                                textAlign: isEmpty(step.left.id)(
                                  store.getState()
                                )
                                  ? 'center'
                                  : 'right',
                                width: '33%',
                              }}
                            >
                              {step.left.render({
                                config: {
                                  placeholder: i18n.t(
                                    'equations::Left-hand side'
                                  ),
                                },
                              })}
                            </div>

                            <div
                              style={{
                                width: '33%',
                                display: 'flex',
                                flexDirection: 'row',
                              }}
                            >
                              <DropDown
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                  step.sign.set(e.target.value)
                                }}
                                value={step.sign.value}
                              >
                                {[
                                  Sign.Equals,
                                  Sign.GreaterThan,
                                  Sign.LessThan,
                                  Sign.GreaterThanOrEqual,
                                  Sign.LessThanOrEqual,
                                  Sign.AlmostEqualTo,
                                ].map((sign) => {
                                  return (
                                    <option key={sign} value={sign}>
                                      {renderSignToString(sign)}
                                    </option>
                                  )
                                })}
                              </DropDown>
                              <div style={{ flexGrow: 1 }}>
                                {step.right.render({
                                  config: {
                                    placeholder: i18n.t(
                                      'equations::Right-hand side'
                                    ),
                                  },
                                })}
                              </div>
                            </div>

                            <div style={{ width: '33%' }}>
                              {step.transform.render({
                                config: {
                                  placeholder: i18n.t(
                                    'equations::Transformation'
                                  ),
                                },
                              })}
                            </div>
                            <ButtonContainer>
                              <DragButton {...provided.dragHandleProps}>
                                <EdtrIcon icon={edtrDragHandle} />
                              </DragButton>
                              <RemoveButton onClick={removeButton(index)}>
                                <Icon icon={faTimes} />
                              </RemoveButton>
                            </ButtonContainer>
                          </LayoutContainer>
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
      <AddButtonWrapper>
        <AddButton onClick={addButton}>
          <Icon icon={faPlus} /> {i18n.t('equations::Add step')}
        </AddButton>
      </AddButtonWrapper>
    </HotKeys>
  ) : (
    <EquationsRenderer {...props} />
  )
}
