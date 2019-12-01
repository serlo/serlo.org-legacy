import * as React from 'react'
import styled from 'styled-components'
import { Icon } from '../icon.component'
import { getColor, transparentizeColor } from '../provider.component'
import { Button, DropButton } from '../button.component'

export interface MenuEntry {
  title: string
  icon?: string
  class?: string
  url?: string
  children?: MenuEntry[]
  highlight?: boolean
}

export interface Props {
  links: MenuEntry[]
  className?: string
}

export default function Menu({ links, className }: Props) {
  return (
    <List className={className}>
      {links.map((entry, index) => {
        const icon = entry.icon

        if (!entry.title) return null //seperator
        return (
          <Entry
            childKey={'_' + index}
            key={'_' + index}
            url={entry.url}
            icon={icon}
            title={entry.title}
            children={entry.children}
            highlight={entry.highlight}
          />
        )
      })}
    </List>
  )
}

interface EntryProps extends MenuEntry {
  childKey: string
  isChild?: boolean
}

function Entry({
  url,
  title,
  childKey,
  icon,
  children,
  highlight,
  isChild
}: EntryProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Li key={childKey} isChild={isChild}>
      <Link
        label={
          !children ? (
            title
          ) : (
            <React.Fragment>
              {title}&thinsp;
              <Icon icon="faCaretDown" />
            </React.Fragment>
          )
        }
        size={1}
        href={url}
        iconName={highlight && icon ? icon : undefined}
        active={highlight ? true : false}
        backgroundColor={highlight ? getColor('brandGreen') : 'transparent'}
        fontColor={highlight ? '#fff' : getColor('lightblue')}
        activeBackgroundColor={highlight ? getColor('brand') : 'transparent'}
        activeFontColor={highlight ? '#fff' : getColor('darkGray')}
        iconColor={highlight ? '#fff' : getColor('brand')}
        activeIconColor="#fff"
        as={!children ? Button : DropButton}
        a11yTitle={children ? 'Untermenü ' + title + ' öffnen' : title}
        dropContent={children ? <Submenu entries={children} /> : undefined}
        dropAlign={children ? { top: 'bottom', right: 'right' } : undefined}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      />
    </Li>
  )
}

function Submenu({ entries }: { entries: MenuEntry[] }) {
  return (
    <SubmenuList>
      {entries.map((entry, index) => {
        if (!entry.title) return null //seperator
        return (
          <Entry
            childKey={'__' + index}
            key={'__' + index}
            url={entry.url}
            icon={entry.icon}
            title={entry.title}
            isChild={true}
          />
        )
      })}
    </SubmenuList>
  )
}

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: right;

  .Collapsible__trigger.is-open li a {
    background: ${transparentizeColor('brand', 0.8)};
  }
`

const SubmenuList = styled.ul`
  background-color: ${'#fff'};
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  margin: 0;
  text-align: right;
`

interface LiProps {
  isChild?: boolean
}

const Li = styled.li<LiProps>`
  display: inline-block;
  ${props =>
    props.isChild
      ? `
      text-align:right;
    display: block;

    >div {
      display: block;
    }
   `
      : null}
`

interface LinkProps {
  open: boolean
}

const Link = styled(Button)<LinkProps>`
  margin-right: 0.6rem;
  font-weight: bold;
  text-align: right;
  ${props =>
    props.open
      ? `
    color: ${getColor('darkGray')};
   `
      : null}
`
