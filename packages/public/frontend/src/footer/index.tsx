import * as React from 'react'
import { About, AboutProps } from './about'
import { Nav, NavProps } from './nav'

export type FooterProps = NavProps & AboutProps

export function Footer(props: FooterProps) {
  return (
    <footer>
      <About {...props} />
      <Nav navEntries={props.navEntries} />
    </footer>
  )
}
