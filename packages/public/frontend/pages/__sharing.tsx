import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
// import {  } from '../__stories__/dummycontent'
import { EditBox } from '../src/editbox.component'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { setAssetPrefix } from '../src/assets'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

export default function Index(props) {
  setAssetPrefix(props.assetPrefix)
  return (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <EditBox contentID={props.contentID} />
    </Provider>
  )
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, { contentID: '123' })
}
