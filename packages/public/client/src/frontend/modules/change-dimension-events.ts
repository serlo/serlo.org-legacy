/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { debounce } from 'lodash'

export function initChangeDimensionEvents() {
  let cachedHeight = getHeight()
  let cachedWidth = getWidth()
  let cachedContentHeight = getContentHeight()
  let cachedContentWidth = getContentWidth()

  notifyParent({
    contentHeight: cachedContentHeight,
    contentWidth: cachedContentWidth,
  })

  const handleResize = debounce(() => {
    const height = getHeight()
    const width = getWidth()
    const contentHeight = getContentHeight()
    const contentWidth = getContentWidth()

    if (width !== cachedWidth) {
      cachedWidth = width
      const event = new Event('change-width')
      window.dispatchEvent(event)
    }

    if (height !== cachedHeight) {
      cachedHeight = height
      const event = new Event('change-height')
      window.dispatchEvent(event)
    }

    if (contentHeight !== cachedContentHeight) {
      cachedContentHeight = contentHeight
      const event = new Event('change-content-height')
      window.dispatchEvent(event)
    }

    if (contentWidth !== cachedContentWidth) {
      cachedContentWidth = contentWidth
      const event = new Event('change-content-width')
      window.dispatchEvent(event)
    }

    if (
      contentHeight !== cachedContentHeight ||
      contentWidth !== cachedContentWidth
    ) {
      notifyParent({ contentHeight, contentWidth })
    }
  }, 500)

  window.addEventListener('resize', handleResize)

  function getHeight() {
    return window.document.body.offsetHeight
  }

  function getWidth() {
    return window.document.body.offsetWidth
  }

  function getContentHeight() {
    return window.document.body.scrollHeight
  }

  function getContentWidth() {
    return window.document.body.scrollWidth
  }

  function notifyParent(data: { contentWidth: number; contentHeight: number }) {
    window.parent.postMessage(
      {
        context: 'serlo',
        ...data,
      },
      '*'
    )
  }
}
