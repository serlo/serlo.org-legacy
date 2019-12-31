import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
import { Renderer } from '../src/edtr-io'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { RendererProps } from '@edtr-io/renderer'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

export default function Index(props) {
  // TODO: handle invalid states somewhere (e.g. numbers, super annoying)
  // console.log(input)
  const state: RendererProps['state'] = JSON.parse(
    props.input.trim().replace(/&quot;/g, '"')
  )
  // TODO: handle convert?
  // const state = isEdtr(data) ? data : convert(data)

  return (
    <Provider>
      <Normalize />
      <GlobalStyle assetPrefix={props.assetPrefix} />
      <Renderer state={state} />
    </Provider>
  )
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, {
    input: ''
  })
}
