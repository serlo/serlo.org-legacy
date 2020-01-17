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
import ScrollMenu from 'react-horizontal-scrolling-menu'
import styled from 'styled-components'
import { Heading } from './heading.component'
import { getColor } from './provider.component'

interface SecondaryMenuProps {
  entries: string[]
  selectedIndex: number
}

export const SecondaryMenu: React.FunctionComponent<SecondaryMenuProps> = props => {
  return (
    <StyledScrollMenu>
      <ScrollMenu
        alignCenter={false}
        data={props.entries.map((name, i) => {
          return (
            <div
              key={name}
              className={i === props.selectedIndex ? 'active' : ''}
            >
              <Heading level={3}>{name}</Heading>
            </div>
          )
        })}
        selected={props.entries[props.selectedIndex]}
        scrollToSelected={true}
        onSelect={(x: string | number | null) => {
          alert(x)
        }}
        arrowRight={<StyledArrowRight />}
        arrowLeft={<StyledArrowLeft />}
        hideSingleArrow={true}
        transition={0.6}
        inertiaScrolling={true}
        inertiaScrollingSlowdown={0.25}
        useButtonRole={false}
      />
    </StyledScrollMenu>
  )
}

const StyledScrollMenu = styled.div`
  h3 {
    user-select: none;
    padding: 0 0.5rem;
    margin: 0.7rem 0;
    cursor: pointer;
  }

  .active > h3 {
    color: black;
  }

  .menu-wrapper--inner > div:not(:last-child) {
    border-right: 1px solid ${getColor('lighterblue')};
  }

  .menu-item-wrapper {
    outline: none;
  }

  a {
    text-decoration: none;
  }

  .scroll-menu-arrow--disabled {
    opacity: 0.1;
  }
`

const StyledArrowLeft = styled.div`
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid ${getColor('lightblue')};
  margin-right: 0.2rem;
  margin-left: 0.05rem;
  transform: scale(0.7, 2);
`

const StyledArrowRight = styled.div`
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid ${getColor('lightblue')};
  margin-left: 0.2rem;
  margin-right: 0.05rem;
  transform: scale(0.7, 2);
`
