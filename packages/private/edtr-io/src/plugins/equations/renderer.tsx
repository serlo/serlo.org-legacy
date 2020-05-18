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
import { styled } from '@edtr-io/editor-ui'
import * as React from 'react'

import { EquationsProps } from '.'
import { Sign, renderSignToString } from './sign'

export const LayoutContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-start'
})

export const LeftSide = styled.div({
  width: '33%',
  '@media(max-width: 480px)': { width: '100%', textAlign: 'left' },
  '@media(max-width: 768px)': { width: '50%', textAlign: 'right' },
  '@media(min-width:768px)': { textAlign: 'right' }
})

export const RightSide = styled.div({
  width: '33%',
  display: 'flex',
  flexDirection: 'row',
  '@media(max-width: 480px)': { width: '100%' },
  '@media(max-width: 768px)': { width: '50%' }
})
export const Transformation = styled.div({
  width: '33%',
  '@media(max-width: 768px)': { width: '100%', textAlign: 'center' }
})

export function EquationsRenderer({ state }: EquationsProps) {
  const rows = state.steps
  return (
    <React.Fragment>
      <div>
        {rows.map(row => {
          return (
            <LayoutContainer key={row.left.id}>
              <LeftSide>{row.left.render()}</LeftSide>
              <RightSide>
                {renderSignToString(row.sign.value as Sign)}
                {row.right.render()}
              </RightSide>
              {row.transform === undefined ? null : (
                <Transformation>{row.transform.render()}</Transformation>
              )}
            </LayoutContainer>
          )
        })}
      </div>
    </React.Fragment>
  )
}
