import { debounce } from 'lodash'

export function initChangeDimensionEvents() {
  let cachedHeight = getHeight()
  let cachedWidth = getWidth()
  let cachedContentHeight = getContentHeight()
  let cachedContentWidth = getContentWidth()

  notifyParent({
    contentHeight: cachedContentHeight,
    contentWidth: cachedContentWidth
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
        ...data
      },
      '*'
    )
  }
}
