import { MathRenderer } from '@edtr-io/math'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { EquationsProps } from '.'
import { renderSignToString, Sign } from './sign'
import { useScopedStore } from '@edtr-io/core'
import { isEmpty } from '@edtr-io/store'

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
                <tr key={index}>
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
                    <SignTd>
                      {index === state.steps.length - 1 ? '→' : '↓'}
                    </SignTd>
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
