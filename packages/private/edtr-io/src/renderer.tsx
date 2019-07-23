import { Renderer as Core, RendererProps } from '@edtr-io/renderer'
import * as React from 'react'

import { plugins } from './plugins'

export function Renderer({ state }: { state: RendererProps['state'] }) {
  return <Core plugins={plugins} state={state} />
}
