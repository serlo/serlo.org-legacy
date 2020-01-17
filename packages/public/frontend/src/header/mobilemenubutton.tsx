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
import { getColor, lightenColor } from '../provider.component'
// import { DropButton } from 'grommet'
import { Button } from '../button.component'

export interface Props {
  open: boolean
  onClick?: () => void
  dropContent?: JSX.Element
  dropTarget?: object
}

export function MobileMenuButton({
  open,
  onClick
}: // dropContent,
// dropTarget
Props) {
  return (
    <React.Fragment>
      <MenuButton
        title="Menü öffnen"
        iconName={open ? 'faTimes' : 'faBars'}
        active={open}
        size={1.1}
        backgroundColor={lightenColor('lighterblue', 0.18)}
        iconColor={getColor('brand')}
        activeIconColor={getColor('brand')}
        activeBackgroundColor={lightenColor('lighterblue', 0.1)}
        onClick={onClick}
      />
      {/* <HiddenDropButton
        open={open}
        dropContent={dropContent}
        dropTarget={dropTarget}
      /> */}
    </React.Fragment>
  )
}

// const HiddenDropButton = styled(DropButton)`
//   display: none;
// `

const MenuButton = styled(Button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
` as typeof Button
