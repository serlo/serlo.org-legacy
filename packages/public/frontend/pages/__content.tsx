import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
import { Renderer } from '../src/edtr-io'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { RendererProps } from '@edtr-io/renderer'
import { convert, isEdtr } from '../src/legacy/legacy-editor-to-editor'
import {
  Edtr,
  Legacy,
  Splish
} from '../src/legacy/legacy-editor-to-editor/splishToEdtr/types'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

export default function Index({ input }) {
  if (input === undefined) return null
  if (input === '') return null
  let data: Legacy | Splish | Edtr
  try {
    data = JSON.parse(input.trim().replace(/&quot;/g, '"'))
  } catch (e) {
    return null
  }
  const state = isEdtr(data) ? data : convert(data)
  return <Renderer state={state} />
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, {
    input: ''
  })
}
