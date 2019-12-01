import * as React from 'react'
import styled from 'styled-components'
import { Button } from './button.component'
import { getColor, lightenColor } from './provider.component'
import Breakpoint from 'react-socks'
import { Anchor } from 'grommet'

interface BreadcrumbProps {
  className?: string
  title?: string
  entries?: BreadcrumbEntry[]
}

interface BreadcrumbEntry {
  label: string
  url: string
}

export function Breadcrumb({ className, title, entries }: BreadcrumbProps) {
  if (!entries || entries.length < 1) {
    return <p>"bad breadcrum"</p>
  }
  const lastEntry = entries[entries.length - 1]
  return (
    <div style={{ minHeight: '2rem' }}>
      <Breakpoint sm down>
        <StyledButton
          label={/*'Übersicht Prozentrechnung'*/ lastEntry.label}
          className={className}
          a11yTitle={title}
          plain
          iconName={'faArrowCircleLeft'}
          size={1}
          backgroundColor={lightenColor('lighterblue', 0.18)}
          fontColor={getColor('brand')}
          activeBackgroundColor={getColor('brand')}
        />
      </Breakpoint>
      <Breakpoint md up>
        <BreadcrumbList>
          {entries.map((bcEntry, i, l) => {
            return (
              <React.Fragment key={i}>
                <StyledAnchor href={bcEntry.url}>{bcEntry.label} </StyledAnchor>
                {i + 1 < l.length && <>>&nbsp;</>}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breakpoint>
    </div>
  )
}

const BreadcrumbList = styled.div`
  position: absolute;
  left: 2rem;
  margin-top: -0.5rem;
  font-size: 1rem;
  color: #ddd;
`

const StyledAnchor = styled(Anchor)`
  color: ${getColor('brand')};
  font-weight: normal;
`

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-bottom: 0;
  font-weight: bold;
`
