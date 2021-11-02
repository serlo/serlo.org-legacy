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
import { useVirtual } from 'react-virtual'

// https://github.com/tannerlinsley/react-virtual/issues/167
function useVirtualResizeObserver<T>(options: {
  size: number
  parentRef: React.RefObject<T>
  estimateSize: () => number
}) {
  const measureRefCacheRef = React.useRef<
    Record<string, (el: HTMLElement | null) => void>
  >({})
  const elCacheRef = React.useRef<Record<number, HTMLElement | null>>({})

  const resizeObserverRef = React.useRef(
    new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement
        const index = el.getAttribute('data-index')
        if (index !== null) measureRefCacheRef.current[index](el)
      })
    })
  )

  React.useEffect(() => {
    const resizeObserver = resizeObserverRef.current
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const rowVirtualizer = useVirtual<T>(options)

  const refs = React.useMemo(() => {
    const obj: Record<number, (el: HTMLElement | null) => void> = {}
    for (let i = 0; i < options.size; i++) {
      obj[i] = (el: HTMLElement | null) => {
        const currentElCache = elCacheRef.current[i]
        if (currentElCache) {
          resizeObserverRef.current.unobserve(currentElCache)
        }

        if (el) {
          // sync
          measureRefCacheRef.current[i](el)

          el.setAttribute('data-index', i.toString())
          resizeObserverRef.current.observe(el)
        }

        elCacheRef.current[i] = el
      }
    }
    return obj
  }, [options.size])

  for (let i = 0; i < rowVirtualizer.virtualItems.length; i++) {
    const item = rowVirtualizer.virtualItems[i]
    if (item.measureRef !== refs[item.index]) {
      measureRefCacheRef.current[item.index] = item.measureRef
    }
    item.measureRef = refs[item.index]
  }

  return rowVirtualizer
}

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

  const virtualParent = React.useRef(null)

  const virtualizer = useVirtualResizeObserver({
    size: children.length,
    parentRef: virtualParent,
    estimateSize: React.useCallback(() => 35, []),
  })

  const contentRendered = content.render({
    renderSettings(children) {
      return (
        <React.Fragment>
          {children}
          {getSettings()}
        </React.Fragment>
      )
    },
  })

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
        <SemanticSection editable={props.editable}>
          {contentRendered}
        </SemanticSection>
      </section>
      <div
        ref={virtualParent}
        style={{
          height: '100%',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${virtualizer.totalSize}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.virtualItems.map((virtualRow) => {
            const child = children[virtualRow.index]
            return (
              <div
                key={virtualRow.index}
                ref={virtualRow.measureRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <section className="row" key={child.id}>
                  <div className="col-sm-1 hidden-xs">
                    <em>{getExerciseIndex(virtualRow.index)})</em>
                  </div>
                  <div className="col-sm-11 col-xs-12">
                    <OptionalChild
                      state={child}
                      removeLabel={i18n.t('textExerciseGroup::Remove exercise')}
                      onRemove={() => children.remove(virtualRow.index)}
                    />
                  </div>
                </section>
              </div>
            )
          })}
        </div>
      </div>
      <AddButton onClick={() => children.insert()}>
        {i18n.t('textExerciseGroup::Add exercise')}
      </AddButton>
      <Controls subscriptions {...props.state} />
    </article>
  )

  function getSettings() {
    return (
      <div>
        <label htmlFor="cohesiveSelect">
          {i18n.t('textExerciseGroup::Kind of exercise group')}:
        </label>{' '}
        <select
          id="cohesiveSelect"
          value={isCohesive ? 'cohesive' : 'non-cohesive'}
          onChange={(e) => cohesive.set(e.target.value === 'cohesive')}
        >
          <option value="non-cohesive">
            {i18n.t('textExerciseGroup::not cohesive')}
          </option>
          <option value="cohesive">
            {i18n.t('textExerciseGroup::cohesive')}
          </option>
        </select>
      </div>
    )
  }

  function getExerciseIndex(index: number) {
    return isCohesive ? index + 1 : String.fromCharCode(97 + index)
  }
}
