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
import { MathRenderer } from '@edtr-io/math'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { EquationsProps } from '.'
import { renderSignToString, Sign } from './sign'
import { useScopedStore } from '@edtr-io/core'
import { isEmpty } from '@edtr-io/store'
import downArrow from './down-arrow.svg'

export const TableWrapper = styled.div({
  overflowX: 'scroll',
  padding: '10px 0',
})

export const Table = styled.table({
  whiteSpace: 'nowrap',
})

export const LeftTd = styled.td({
  textAlign: 'right',
})

export const SignTd = styled.td({
  padding: '0 3px',
  textAlign: 'center',
})

export const TransformTd = styled.td({
  paddingLeft: '5px',
})

export const ExplanationTr = styled.tr({
  color: '#007ec1',
  div: {
    margin: 0,
  },
})

export function EquationsRenderer({ state }: EquationsProps) {
  const store = useScopedStore()

  return (
    <TableWrapper>
      <Table>
        <tbody>
          {state.steps.map((step, index) => {
            return (
              <React.Fragment key={index}>
                <tr>
                  <LeftTd>
                    {step.left.value ? (
                      <MathRenderer inline state={step.left.value} />
                    ) : null}
                  </LeftTd>
                  <SignTd>
                    <MathRenderer
                      inline
                      state={renderSignToString(step.sign.value as Sign)}
                    />
                  </SignTd>
                  <td>
                    {step.right.value ? (
                      <MathRenderer inline state={step.right.value} />
                    ) : null}
                  </td>
                  <TransformTd>
                    {step.transform.value ? (
                      <>
                        |
                        <MathRenderer inline state={step.transform.value} />
                      </>
                    ) : null}
                  </TransformTd>
                </tr>
                {isEmpty(step.explanation.id)(store.getState()) ? null : (
                  <ExplanationTr>
                    <td />
                    {renderDownArrow()}
                    <td colSpan={2}>{step.explanation.render()}</td>
                  </ExplanationTr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </Table>
    </TableWrapper>
  )
}

export function renderDownArrow() {
  return (
    <td
      style={{
        backgroundImage: `url(${downArrow})`,
        backgroundSize: '20px 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    ></td>
  )
}
