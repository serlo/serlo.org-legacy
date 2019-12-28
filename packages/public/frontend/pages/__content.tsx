import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
import { Renderer } from '@serlo/edtr-io'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

export default function Index(props) {
  return (
    <Provider>
      <Normalize />
      <GlobalStyle assetPrefix={props.assetPrefix} />
      <Renderer state={props.content} />
    </Provider>
  )
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, { content: [] })
}
