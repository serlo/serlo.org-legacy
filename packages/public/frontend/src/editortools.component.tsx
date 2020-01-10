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
import {
  getColor,
  transparentizeColor,
  getBreakpoint
} from './provider.component'
// import { useScrollYPosition } from 'react-use-scroll-position'

export const EditorTools: React.FunctionComponent<React.HTMLAttributes<
  HTMLDivElement
>> = props => {
  // const scrollY = useScrollYPosition()
  // const summary = scrollY > 30 ? false : true

  return (
    <React.Fragment>
      <StyledButton
        className={props.className}
        a11yTitle={props.title}
        plain
        iconName="faSave"
        label={'Speichern'}
        activeBackgroundColor={getColor('brandGreen')}
        position="4rem"
      />
      <StyledButton
        className={props.className}
        a11yTitle={props.title}
        plain
        iconName="faTimes"
        label={'Abbrechen'}
        backgroundColor={'#EDCEB2'}
        activeBackgroundColor={'#EA7960'}
        position="7rem"
      />
      <StyledButton
        className={props.className}
        a11yTitle={props.title}
        plain
        iconName="faUndo"
        label={'Rückgängig'}
        backgroundColor={transparentizeColor('brandGreen', 0.5)}
        activeBackgroundColor={getColor('brandGreen')}
        position="12rem"
      />
      <StyledButton
        className={props.className}
        a11yTitle={props.title}
        plain
        iconName="faRedo"
        label={'Wiederholen – Test langer Content'}
        backgroundColor={transparentizeColor('brandGreen', 0.5)}
        activeBackgroundColor={getColor('brandGreen')}
        position="15rem"
      />
    </React.Fragment>
  )
}

interface StyledButtonProps {
  position: string
}

const StyledButton = styled(Button)<StyledButtonProps>`
  display: none;

  @media screen and (min-width: ${getBreakpoint('md')}) {
    display: block;
    position: fixed;
    top: ${props => (props.position ? props.position : '4rem')};

    font-weight: bold;
    right: 2.5rem;
    transform: translateX(100%);
    text-align: left;

    transition: transform 0.2s ease-in-out;
    padding: 0.7rem 0.7rem 0.7rem 1rem;

    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    > div {
      overflow: hidden;
      justify-content: start;
      > svg {
        width: 1.2rem !important;
        height: 1.2rem !important;
      }
    }

    @media screen and (hover: hover) {
      &:hover {
        transform: translateX(2.5rem);
        > div {
          font-size: 1rem;
        }
      }
    }
  }
`
