import * as React from 'react'
import { About } from './about'
import { Nav, NavEntry } from './nav'

export interface Props {
  slogan: string
  navEntries: NavEntry[]
}

export function Footer(props: Props) {
  return (
    <footer>
      <About slogan={props.slogan} />
      <Nav navEntries={props.navEntries} />
    </footer>
  )
}
