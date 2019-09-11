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
import { useScopedStore } from '@edtr-io/core'
import { StatefulPluginEditorProps, StatefulPlugin } from '@edtr-io/plugin'
import { styled } from '@edtr-io/renderer-ui'
import { DocumentState, serializeDocument } from '@edtr-io/store'
import * as React from 'react'

import { layoutState } from '.'

const LayoutContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-start'
})

const ChildContainer = styled.div<{ width: number }>(({ width }) => {
  return {
    width: `${(width / 12) * 100}%`,
    '@media (max-width: 480px)': {
      width: '100%'
    }
  }
})
const ConvertInfo = styled.div({
  padding: '5px',
  backgroundColor: '#f2dede',
  color: '#a94442',
  border: '1px solid #ebccd1',
  textAlign: 'center'
})

const ConvertButton = styled.button({
  borderRadius: '5px',
  margin: '5px',
  border: 'none',
  outline: 'none',
  backgroundColor: 'white',
  '&:hover': { backgroundColor: '#ebccd1' }
})

export const LayoutRenderer: React.FunctionComponent<
  StatefulPluginEditorProps<typeof layoutState> & {
    insert?: (options?: DocumentState) => void
    remove?: () => void
  }
> = props => {
  const store = useScopedStore()
  const convertToRow = () => {
    props.state.items.reverse().forEach(item => {
      if (props.insert) {
        const element = serializeDocument(item.child.id)(store.getState())
        if (element) {
          if (element.plugin === 'rows') {
            const rowsState = (element as { state: DocumentState[] }).state
            rowsState.reverse().forEach(rowsItem => {
              if (props.insert) {
                props.insert(rowsItem)
              }
            })
          } else {
            props.insert(element)
          }
        }
      }
    })
    if (props.remove) {
      props.remove()
    }
  }
  return (
    <React.Fragment>
      {props.editable ? (
        <ConvertInfo>
          Um die Inhalte zu verschieben, konvertiere sie für den neuen Editor:
          <div>
            <ConvertButton onClick={convertToRow}>Konvertiere</ConvertButton>
          </div>
        </ConvertInfo>
      ) : null}
      <LayoutContainer>
        {props.state.items.map((item, index) => {
          return (
            <ChildContainer key={index} width={item.width()}>
              {item.child.render()}
            </ChildContainer>
          )
        })}
      </LayoutContainer>
    </React.Fragment>
  )
}
