import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'

import { Breadcrumb } from '../src/breadcrumb.component'

import * as bodyParser from 'body-parser'

export default function Index(props: any) {
  return (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Breadcrumb entries={props.entries} />
    </Provider>
  )
}
Index.getInitialProps = async ({ req, res }: { req: any; res: any }) => {
  const props = {
    entries: [
      { url: '#', label: 'Fach' },
      { url: '#', label: 'Bereich' },
      { url: '#', label: 'Thema' },
      {
        url: '#',
        label: 'Kapitel'
      }
    ]
  }
  if (req && res) {
    // parsing body
    await new Promise(resolve => {
      bodyParser.json()(req, res, resolve)
    })
    const json = req.body
    // requiring valid key
    if (
      process.env.ATHENE_NEXTJS_KEY &&
      json.key === process.env.ATHENE_NEXTJS_KEY
    ) {
      if (json.entries) {
        props.entries = json.entries
      }
    }
  }
  return props
}
