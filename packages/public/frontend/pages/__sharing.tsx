import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
// import {  } from '../__stories__/dummycontent'
import { EditBox } from '../src/editbox.component'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

export default function Index(props) {
  return (
    <Provider>
      <Normalize />
      <GlobalStyle assetPrefix={props.assetPrefix} />
      <EditBox />
    </Provider>
  )
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, {})
}
