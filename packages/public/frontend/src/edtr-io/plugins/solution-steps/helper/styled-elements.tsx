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
import { Icon } from '@edtr-io/ui'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons/faBookOpen'
import { faChessRook } from '@fortawesome/free-solid-svg-icons/faChessRook'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons/faCommentDots'
import { faPencilRuler } from '@fortawesome/free-solid-svg-icons/faPencilRuler'
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons/faSearchPlus'
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import * as React from 'react'

import { SolutionElementType } from '../types'

export const Buttoncontainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  width: '100%'
})

export const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  position: 'relative'
})

export const ContentComponent = styled.div<{
  isHalf?: boolean
  boxfree?: boolean
}>(({ isHalf, boxfree }) => {
  return {
    marginTop: '10px',
    boxShadow: boxfree ? undefined : '0 1px 3px 0 rgba(0,0,0,0.2)',
    padding: '10px',
    width: isHalf ? '50%' : '100%',
    position: 'relative'
  }
})

export const BackgroundSymbol = styled.div({
  position: 'absolute',
  top: '0',
  right: '0',
  color: 'rgba(0,0,0,0.1)',
  transform: 'translate(-15px, 10px)',
  zIndex: 0
})

export function getIcon(
  type: SolutionElementType,
  size?: FontAwesomeIconProps['size']
) {
  switch (type) {
    case SolutionElementType.introduction:
      return <Icon icon={faBookOpen} size={size} />
    case SolutionElementType.strategy:
      return <Icon icon={faChessRook} size={size} />
    case SolutionElementType.explanation:
      return <Icon icon={faCommentDots} size={size} />
    case SolutionElementType.step:
      return <Icon icon={faPencilRuler} size={size} />
    case SolutionElementType.additionals:
      return <Icon icon={faSearchPlus} size={size} />
  }
}
export function Content(
  props: React.PropsWithChildren<{
    type: SolutionElementType
    isHalf?: boolean
    boxfree?: boolean
  }>
) {
  return (
    <React.Fragment>
      <ContentComponent isHalf={props.isHalf} boxfree={props.boxfree}>
        {props.children}
        <BackgroundSymbol>{getIcon(props.type, '3x')}</BackgroundSymbol>
      </ContentComponent>
    </React.Fragment>
  )
}

export const Controls = styled.div<{ show?: boolean }>(({ show }) => {
  return {
    right: '0',
    position: 'absolute',
    top: '0',
    transform: 'translate(50%, -5px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    visibility: show ? 'visible' : 'hidden'
  }
})

export const ControlButton = styled.button({
  borderRadius: '50%',
  border: '1px solid #858585',
  width: '25px',
  height: '25px',
  outline: 'none',
  textAlign: 'center',
  verticalAlign: 'middle',
  background: '#858585',
  color: 'white',
  zIndex: 20,
  '&:hover': {
    background: '#469bff',
    border: '1px solid #469bff'
  }
})

export const DragHandler = styled.div({
  borderRadius: '50%',
  padding: '0 2px 3px 2px',
  width: '25px',
  height: '25px',
  outline: 'none',
  textAlign: 'center',
  background: '#858585',
  color: 'white',
  zIndex: 20,
  '&:hover': {
    background: '#469bff'
  }
})
