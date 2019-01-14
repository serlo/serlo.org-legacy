import { createRendererPlugins } from '@serlo/editor-plugins-renderer'
import { HtmlRenderer } from '@serlo/html-renderer'
import * as React from 'react'
import { hydrate } from 'react-dom'

import { getStateFromElement } from '../helpers'

export const initElement = (element: HTMLElement) => {
  const content = getStateFromElement(element)

  hydrate(
    <div className="r">
      <div className="c24">
        <HtmlRenderer state={content} plugins={createRendererPlugins('all')} />
      </div>
    </div>,
    element
  )
}
