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
import { HotKeys, useScopedSelector, useScopedStore } from '@edtr-io/core'
import { PreferenceContext, setDefaultPreference } from '@edtr-io/core/beta'
import { MathEditor } from '@edtr-io/math'
import { StateTypeReturnType, StringStateType } from '@edtr-io/plugin'
import { edtrDragHandle, EdtrIcon, faTimes, Icon, styled } from '@edtr-io/ui'
import { useI18n } from '@serlo/i18n'
import * as R from 'ramda'
import * as React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import {
  EquationsRenderer,
  ExplanationTr,
  LeftTd,
  SignTd,
  Table,
  TableWrapper,
  TransformTd,
} from './renderer'
import { focusNext, focusPrevious, getFocused, isEmpty } from '@edtr-io/store'
import { renderSignToString, Sign } from './sign'
import { EquationsProps, stepProps } from '.'

enum StepSegment {
  Left = 0,
  Sign = 1,
  Right = 2,
  Transform = 3,
  Explanation = 4,
}

const preferenceKey = 'katex:usevisualmath'

setDefaultPreference(preferenceKey, true)

const RemoveButton = styled.button({
  outline: 'none',
  width: '35px',
  border: 'none',
  background: 'transparent',
})
const DragButton = styled.span({
  cursor: 'grab',
  paddingRight: '5px',
})

export function EquationsEditor(props: EquationsProps) {
  const i18n = useI18n()

  const { focused, state } = props

  const store = useScopedStore()
  const focusedElement = useScopedSelector(getFocused())
  const nestedFocus =
    focused ||
    R.includes(
      focusedElement,
      props.state.steps.map((step) => step.explanation.id)
    )

  const gridFocus = useGridFocus({
    rows: state.steps.length,
    columns: 4,
    focusNext() {
      store.dispatch(focusNext())
    },
    focusPrevious() {
      store.dispatch(focusPrevious())
    },
  })

  React.useEffect(() => {
    if (nestedFocus) {
      gridFocus.setFocus({ row: 0, column: 0 })
    }
  }, [nestedFocus])

  if (!nestedFocus) return <EquationsRenderer {...props} />

  return (
    <HotKeys
      allowChanges
      keyMap={{
        FOCUS_NEXT_OR_INSERT: 'tab',
        FOCUS_PREVIOUS: 'shift+tab',
        INSERT: 'return',
      }}
      handlers={{
        FOCUS_NEXT_OR_INSERT: (e) => {
          handleKeyDown(e, () => {
            if (
              gridFocus.isFocused({
                row: state.steps.length - 1,
                column: StepSegment.Transform,
              })
            ) {
              const newIndex = state.steps.length
              state.steps.insert(newIndex, {
                left: '',
                sign: state.steps[newIndex - 1].sign.value,
                right: '',
                transform: '',
                explanation: { plugin: 'text' },
              })
              gridFocus.setFocus({
                row: newIndex,
                column: StepSegment.Left,
              })
            } else {
              gridFocus.moveRight()
            }
          })
        },
        FOCUS_PREVIOUS: (e) => {
          handleKeyDown(e, () => {
            gridFocus.moveLeft()
          })
        },
        INSERT: (e) => {
          handleKeyDown(e, () => {
            if (!gridFocus.focus) return
            const newIndex = gridFocus.focus.row + 1
            state.steps.insert(newIndex, {
              left: '',
              sign: state.steps[newIndex - 1].sign.value,
              right: '',
              transform: '',
              explanation: { plugin: 'text' },
            })
            gridFocus.setFocus({
              row: newIndex,
              column: StepSegment.Left,
            })
          })
        },
      }}
    >
      <TableWrapper>
        <DragDropContext
          onDragEnd={(result) => {
            const { source, destination } = result
            if (!destination) return
            state.steps.move(source.index, destination.index)
          }}
        >
          <Droppable droppableId="default">
            {(provided: any) => {
              return (
                <Table ref={provided.innerRef} {...provided.droppableProps}>
                  {state.steps.map((step, index) => {
                    return (
                      <Draggable
                        key={step.explanation.id}
                        draggableId={step.explanation.id}
                        index={index}
                      >
                        {(provided: any) => {
                          return (
                            <tbody
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <tr>
                                <td>
                                  <DragButton {...provided.dragHandleProps}>
                                    <EdtrIcon icon={edtrDragHandle} />
                                  </DragButton>
                                </td>
                                <StepEditor
                                  gridFocus={gridFocus}
                                  row={index}
                                  state={step}
                                />
                                <td>
                                  <RemoveButton
                                    onClick={() => {
                                      state.steps.remove(index)
                                    }}
                                  >
                                    <Icon icon={faTimes} />
                                  </RemoveButton>
                                </td>
                              </tr>
                              <ExplanationTr>
                                <td />
                                <td />
                                <SignTd>
                                  {isEmpty(step.explanation.id)(
                                    store.getState()
                                  )
                                    ? null
                                    : index === state.steps.length - 1
                                    ? '→'
                                    : '↓'}
                                </SignTd>
                                <td colSpan={2}>
                                  {step.explanation.render({
                                    config: {
                                      placeholder: i18n.t(
                                        'equations::explanation'
                                      ),
                                    },
                                  })}
                                </td>
                              </ExplanationTr>
                            </tbody>
                          )
                        }}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </Table>
              )
            }}
          </Droppable>
        </DragDropContext>
      </TableWrapper>
    </HotKeys>
  )

  function handleKeyDown(e: KeyboardEvent | undefined, next: () => void) {
    e && e.preventDefault()
    next()
  }
}

const DropDown = styled.select({
  height: '30px',
  width: '35px',
  marginLeft: '15px',
  marginRight: '10px',
  backgroundColor: 'lightgrey',
  border: '1px solid lightgrey',
  borderRadius: '5px',
})

interface StepEditorProps {
  gridFocus: GridFocus
  row: number
  state: StateTypeReturnType<typeof stepProps>
}

function StepEditor(props: StepEditorProps) {
  const i18n = useI18n()
  const { gridFocus, row, state } = props

  const dropDown = React.useRef<HTMLSelectElement>(null)

  React.useEffect(() => {
    if (gridFocus.isFocused({ row, column: StepSegment.Sign })) {
      dropDown.current?.focus()
    }
  })

  return (
    <>
      <LeftTd
        onClick={() => {
          gridFocus.setFocus({ row, column: StepSegment.Left })
        }}
      >
        <InlineMath
          focused={gridFocus.isFocused({ row, column: StepSegment.Left })}
          placeholder={`[${i18n.t('equations::left-hand side')}]`}
          state={state.left}
          onChange={(src) => {
            state.left.set(src)
          }}
          onFocusNext={() => {
            gridFocus.moveRight()
          }}
          onFocusPrevious={() => {
            gridFocus.moveLeft()
          }}
        />
      </LeftTd>
      <SignTd
        onClick={() => {
          gridFocus.setFocus({ row, column: StepSegment.Sign })
        }}
      >
        <DropDown
          tabIndex={-1}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            state.sign.set(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              if (e.shiftKey) {
                gridFocus.moveLeft()
              } else {
                gridFocus.moveRight()
              }
            }
            if (e.key === 'ArrowRight') gridFocus.moveRight()
            if (e.key === 'ArrowLeft') gridFocus.moveLeft()
            e.stopPropagation()
          }}
          value={state.sign.value}
          ref={dropDown}
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
      </SignTd>
      <td
        onClick={() => {
          gridFocus.setFocus({ row, column: StepSegment.Right })
        }}
      >
        <InlineMath
          focused={gridFocus.isFocused({ row, column: StepSegment.Right })}
          placeholder={`[${i18n.t('equations::right-hand side')}]`}
          state={state.right}
          onChange={(src) => {
            state.right.set(src)
          }}
          onFocusNext={() => {
            gridFocus.moveRight()
          }}
          onFocusPrevious={() => {
            gridFocus.moveLeft()
          }}
        />
      </td>
      <TransformTd
        onClick={() => {
          gridFocus.setFocus({ row, column: StepSegment.Transform })
        }}
      >
        {state.transform.value === '' ? '' : '|'}
        <InlineMath
          focused={gridFocus.isFocused({ row, column: StepSegment.Transform })}
          placeholder={`[${i18n.t('equations::transformation')}]`}
          state={state.transform}
          onChange={(src) => {
            state.transform.set(src)
          }}
          onFocusNext={() => {
            gridFocus.moveRight()
          }}
          onFocusPrevious={() => {
            gridFocus.moveLeft()
          }}
        />
      </TransformTd>
    </>
  )
}

interface InlineMathProps {
  state: StateTypeReturnType<StringStateType>
  placeholder: string
  onChange: (state: string) => void
  onFocusNext: () => void
  onFocusPrevious: () => void
  focused?: boolean
  prefix?: string
  suffix?: string
}

function InlineMath(props: InlineMathProps) {
  const {
    focused,
    onFocusNext,
    onFocusPrevious,
    onChange,
    state,
    prefix = '',
    suffix = '',
  } = props

  const preferences = React.useContext(PreferenceContext)

  return (
    <MathEditor
      readOnly={!focused}
      state={`${prefix}${state.value}${suffix}`}
      config={{
        i18n: {
          placeholder: props.placeholder,
        },
      }}
      inline
      disableBlock
      visual={preferences.getKey(preferenceKey) === true}
      onEditorChange={(visual) => {
        preferences.setKey(preferenceKey, visual)
      }}
      onInlineChange={() => {}}
      onChange={(value) => {
        onChange(value)
      }}
      onMoveOutRight={() => {
        onFocusNext()
      }}
      onMoveOutLeft={() => {
        onFocusPrevious()
      }}
    />
  )
}

type GridFocusState = {
  row: number
  column: number
} | null

interface GridFocus {
  focus: GridFocusState
  isFocused: (payload: { row: number; column: number }) => boolean
  setFocus: (focus: GridFocusState) => void
  moveRight: () => void
  moveLeft: () => void
}

function useGridFocus({
  rows,
  columns,
  focusNext,
  focusPrevious,
}: {
  rows: number
  columns: number
  focusNext: () => void
  focusPrevious: () => void
}): GridFocus {
  const [focus, setFocus] = React.useState<GridFocusState | null>(null)

  return {
    focus,
    isFocused({ row, column }) {
      return focus !== null && focus.row === row && focus.column === column
    },
    setFocus,
    moveRight() {
      if (focus === null) return
      // Last column
      if (focus.column === columns - 1) {
        // Last row
        if (focus.row === rows - 1) {
          focusNext()
        } else {
          setFocus({ row: focus.row + 1, column: 0 })
        }
      } else {
        setFocus({ row: focus.row, column: focus.column + 1 })
      }
    },
    moveLeft() {
      if (focus === null) return

      // First column
      if (focus.column === 0) {
        // First row
        if (focus.row === 0) {
          focusPrevious()
        } else {
          setFocus({ row: focus.row - 1, column: columns - 1 })
        }
      } else {
        setFocus({ row: focus.row, column: focus.column - 1 })
      }
    },
  }
}
