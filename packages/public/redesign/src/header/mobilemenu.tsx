import * as React from 'react'
import { Box } from 'grommet'
import styled, { createGlobalStyle } from 'styled-components'
import { Icon } from '../icon.component'
import {
  getColor,
  transparentizeColor,
  getBreakpoint
} from '../provider.component'
import Collapsible from 'react-collapsible'
import { MobileMenuButton as Button } from './mobilemenubutton'

type Child = { title: string; url: string; icon?: string }
export type Entry = {
  title: string
  class?: string
  icon?: string
  highlight?: boolean
  url?: string
  children?: Child[]
}

export interface Props {
  links: Entry[]
  overlayTarget: { offsetTop: number }
  className?: string
}

/* TODO: Replace Grommet DropButton with own code
 so we can easily change the styling of the overlay and also load the overlay inside of the header
 -> this way we can make the header 100% VP-Height and scroll inside this box. */

export default function MobileMenu({ overlayTarget, links, className }: Props) {
  const [open, setOpen] = React.useState(false)
  const [top, setTop] = React.useState(0)

  function handleOnClick() {
    setOpen(!open)
    setTop(overlayTarget.offsetTop)
    console.log(top)
  }

  return (
    <div className={className}>
      {open ? <GlobalStyle /> : null}
      <Button
        onClick={handleOnClick}
        open={open}
        // dropContent={<Overlay links={links} onClose={toggleOpen} />}
        // dropTarget={overlayTarget}
      />
      {open ? <Overlay top={top} links={links} /> : null}
    </div>
  )
}

function Overlay({
  links,
  className,
  top
}: {
  links: Entry[]
  onClose?: () => void
  className?: string
  top: number
}) {
  return (
    <OverlayBox top={top} className={className}>
      <List>
        {links.map((header, index) => {
          let children: JSX.Element[] = []
          const key = 'mn_' + index
          const icon = header.icon

          if (header.children) {
            children = header.children.map((_, index) => {
              return (
                <Entry
                  key={key + '_child' + index}
                  childKey={key}
                  isChild
                  href="test"
                  icon={icon ? icon : 'faBars'}
                  title={header.title}
                />
              )
            })
            children.push(<Seperator />)
          }
          if (!header.title) return <Seperator />
          else if (children.length > 0)
            return (
              <Collapsible
                trigger={
                  <Entry
                    key={key}
                    childKey={key}
                    href="test"
                    icon={icon ? icon : 'faBars'}
                    hasChildren
                    title={header.title}
                  />
                }
                transitionTime={200}
              >
                {children}
              </Collapsible>
            )
          else
            return (
              <Entry
                key={key}
                childKey={key}
                href="test"
                icon={icon ? icon : 'faBars'}
                title={header.title}
              />
            )
        })}
      </List>
    </OverlayBox>
  )
}

interface EntryProps {
  href: string
  title: string
  childKey: string
  icon: string
  hasChildren?: boolean
  isChild?: boolean
}

function Entry({
  href,
  title,
  childKey,
  icon,
  hasChildren,
  isChild
}: EntryProps) {
  return (
    <li>
      <EntryLink key={childKey} href={href} isChild={isChild}>
        {!isChild ? (
          <IconWrapper>
            <Icon icon={icon} />
          </IconWrapper>
        ) : null}
        <EntryLinkText isChild={isChild}>
          {title}
          {hasChildren ? (
            <span>
              {' '}
              <Icon icon="faCaretDown" />
            </span>
          ) : null}
        </EntryLinkText>
      </EntryLink>
    </li>
  )
}

const EntryLinkText = styled.span`
  display: inline-block;
  vertical-align: middle;
  margin-top: ${({ isChild }: { isChild?: boolean }) =>
    isChild ? '0' : '1rem'};
`

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;

  .Collapsible__trigger.is-open li a {
    background: ${transparentizeColor('brand', 0.8)};
  }
`

const Seperator = styled.li`
  height: 1.5rem;
  border-bottom: 1px solid ${getColor('lighterblue')};
`

const EntryLink = styled.a`
  background-color: ${getColor('bluewhite')};
  display: block;
  padding: 1em;
  color: ${getColor('brand')};
  border-bottom: 1px solid;
  border-color: ${getColor('lighterblue')};
  font-weight: bold;
  text-decoration: none;
  font-size: ${({ isChild }: { isChild?: boolean }) =>
    isChild ? '1rem' : '1.33rem'};

  &:hover,
  &:focus,
  &:active {
    background: ${transparentizeColor('brand', 0.8)};
  }

  &.is-open {
    color: red !important;
  }
`

const IconWrapper = styled(Box)`
  width: 2.5em;
  height: 2.5em;
  background-color: #d7ebf4;
  border-radius: 10em;
  display: inline-block;
  color: ${getColor('lightblue')};
  text-align: center;
  margin-right: 1em;

  svg {
    margin-top: 0.5em;
    width: 1.5em !important;
    height: 1.5em !important;
    vertical-align: middle;
  }
`

interface OverlayBoxProps {
  top: number
}

const OverlayBox = styled(Box)<OverlayBoxProps>`
  background-color: rgba(255, 255, 255, 0.5);

  position: absolute;
  top: ${props => props.top + 'px'};
  width: 100%;

  @media screen and (min-width: ${getBreakpoint('sm')}) {
    display: none !important;
  }

  /* height: calc(100vh - 11.5rem);
    // maxHeight: calc(100vh - 11.5rem);
    // overflow: auto; */
  /* overflow: visible; */
`

const GlobalStyle = createGlobalStyle`

  header {
    position: fixed !important;
    overflow: scroll;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index:99;
  }

  body {
    overflow: hidden;
  }
`
