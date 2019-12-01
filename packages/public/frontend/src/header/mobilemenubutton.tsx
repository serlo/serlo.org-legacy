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
