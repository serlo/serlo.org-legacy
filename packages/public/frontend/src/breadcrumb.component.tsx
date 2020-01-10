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
