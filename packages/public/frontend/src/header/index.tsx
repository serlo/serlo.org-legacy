import { Box } from 'grommet'
import * as React from 'react'
import styled from 'styled-components'
import { getColor, getBreakpoint } from '../provider.component'
import MobileMenu from './mobilemenu'
import Menu from './menu'
import Logo from '../logo.component'
import { SearchInput } from './searchinput'
import { Entry } from './mobilemenu'

interface HeaderProps {
  links: Entry[]
  slogan: string
}

export function Header(props: HeaderProps) {
  const [overlayTarget, overlayTargetRef] = useOverlayTarget()

  return (
    <React.Fragment>
      <TopNavWrap>
        <StyledMobileMenu links={props.links} overlayTarget={overlayTarget} />

        <Box pad="medium">
          <StyledMenu links={props.links} />
          <Logo subline={props.slogan} />
        </Box>

        <SearchInput />
        <div ref={overlayTargetRef} />
      </TopNavWrap>
    </React.Fragment>
  )
}

function useOverlayTarget<E extends HTMLElement>(): [
  E | undefined,
  React.LegacyRef<E>
] {
  const [overlayTarget, setOverlayTarget] = React.useState<E | undefined>(
    undefined
  )
  const refCallback: React.LegacyRef<E> = ref => {
    if (ref && ref !== overlayTarget) {
      setOverlayTarget(ref)
    }
  }
  return [overlayTarget, refCallback]
}

const TopNavWrap = styled.header`
  /* background-color: ${getColor('bluewhite')}; */
  background-color: ${getColor('bluewhite')};
  padding: 0;
  align-items: start;
  position: static;
`

const StyledMobileMenu = styled(MobileMenu)`
  display: block;
  @media screen and (min-width: ${getBreakpoint('sm')}) {
    display: none;
  }
`

const StyledMenu = styled(Menu)`
  display: none;
  @media screen and (min-width: ${getBreakpoint('sm')}) {
    display: block;
    /* background-color: ${getColor('lighterblue')}; */
    /* height: 3rem; */
    color: ${getColor('brand')};
    margin-bottom: -2rem;
    position: relative;
    z-index: 5;
  }
`
