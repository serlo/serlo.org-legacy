import * as $ from 'jquery'

export const initContent = () => {
  const $elements = $('.editable[data-edit-type="ory"] > div[data-raw-content]')

  if ($elements.length === 0) {
    return
  }

  // prettier-ignore
  return import(
    /* webpackMode: "lazy-once" */
    // @ts-ignore FIXME:
    './init-element'
  ).then(({ initElement }) => {
    $elements.each((_i, element) => {
      initElement(element)
    })
  })
}
