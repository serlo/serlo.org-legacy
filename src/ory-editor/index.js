import React from 'react'
import ReactDOM from 'react-dom'

import { forEachObjIndexed } from 'ramda'
import Editor, { Editable, createEmptyState } from 'ory-editor-core'
import { HTMLRenderer } from 'ory-editor-renderer'
import 'ory-editor-core/lib/index.css' // we also want to load the stylesheets

import { Trash, DisplayModeToggle, Toolbar } from 'ory-editor-ui'
import 'ory-editor-ui/lib/index.css'

// Load some exemplary plugins:
import EditorPlugins, { defaultPlugin } from './plugins'
import 'ory-editor-plugins-slate/lib/index.css' // Stylesheets for the rich text area plugin
import 'ory-editor-plugins-image/lib/index.css'
import 'ory-editor-plugins-parallax-background/lib/index.css' // Stylesheets for parallax background images
import 'ory-editor-plugins-spacer/lib/index.css'
import 'ory-editor-plugins-divider/lib/index.css'
import 'ory-editor-plugins-video/lib/index.css'
import './components/plugins/layout/spoiler/index.css'
import 'katex/dist/katex.min.css'

import $ from 'jquery'
import t from '../modules/translator'
import Modals from '../modules/modals'
import convert from './converter'

require('react-tap-event-plugin')() // react-tap-event-plugin is required by material-ui which is used by ory-editor-ui so we need to call it here

export const renderEditable = () => {
  const $elements = $('.editable[data-edit-type="ory"] > div[data-raw-content]')
  $elements.each((i, element) => {
    const content = $(element).data('rawContent')
    ReactDOM.render(
      <HTMLRenderer state={content} plugins={EditorPlugins} />,
      element
    )
  })
}

const parse = content =>
  typeof content === 'string' ? JSON.parse(content) : content

const editor = new Editor({
  plugins: EditorPlugins,
  editables: [],
  defaultPlugin
})

let editorState = []
let lastPersisted = []
let $saveModalContent = $('<div></div>')

export const unloadEditor = id => {
  $('#ory-editor-meta-data').empty()
  $(`.editable[data-id="${id}"]`).each((i, editable) => {
    const type = $(editable).data('editType')
    const key = $(editable).data('editField')

    switch (type) {
      case 'ory':
        const element = $(editable).children()[0]
        console.log(lastPersisted[id][key])
        const content = parse(lastPersisted[id][key])
        ReactDOM.render(
          <HTMLRenderer state={content} plugins={EditorPlugins} />,
          element
        )
        break
      case 'text':
        const value = $('input', editable).val()
        $(editable).text(value)
        break
    }
  })
  ReactDOM.unmountComponentAtNode(document.getElementById('controls'))
  $('#subject-nav-wrapper').show()
  $('#ory-editor-toolbar').hide()
  $('#ory-editor-meta-data').hide()
  $(window).unbind('beforeunload')
  $('#ory-editor-save').off('click')
  $('#ory-editor-abort').off('click')
}

export const loadEditor = id => {
  $(`.editable[data-id="${id}"]`).each((i, editable) => {
    const type = $(editable).data('editType')
    const key = $(editable).data('editField')

    switch (type) {
      case 'ory':
        const element = $(editable).children()[0]
        const content = parse($(element).data('rawContent'))
        content.id = id + key
        editor.trigger.editable.add(content)

        ReactDOM.render(
          <Editable
            editor={editor}
            id={id + key}
            onChange={newState => {
              editorState[key] = newState
            }}
          />,
          element
        )
        break
      case 'text':
        const value = $(editable).text()
        $(editable).html(`<input type="text" name="${key}" value="${value}"/>`)
        break
    }
  })

  editor.trigger.mode.edit()

  ReactDOM.render(
    <div>
      <Trash editor={editor} />
      <DisplayModeToggle editor={editor} />
      <Toolbar editor={editor} />
    </div>,
    document.getElementById('controls')
  )
  $('#subject-nav-wrapper').hide()
  $('#ory-editor-toolbar').show()
  $('#ory-editor-meta-data').show()

  $(window).bind('beforeunload', function () {
    return t(
      'Are you sure you want to leave this page? All of your unsaved changes will be lost!'
    )
  })

  $.ajax({
    type: 'GET',
    url: `/entity/repository/form/${id}`
  }).done(response => {
    populateEditor(id, response)
    lastPersisted[id] = collectData(id)
  })

  $('#ory-editor-save').click(() => {
    Modals.show(
      {
        title: t('Save'),
        content: $saveModalContent.html(),
        cancel: t('Cancel'),
        okayLabel: t('Save')
      },
      'save-modal',
      () => save(id)
    )
  })
  $('#ory-editor-abort').click(() =>
    Modals.show(
      {
        type: 'danger',
        title: t('Cancel'),
        content: t(
          'Are you sure you want to abort editing? All of your unsaved changes will be lost!'
        ),
        cancel: t('Cancel'),
        okayLabel: t('Save')
      },
      'abort-modal',
      () => restore(id)
    )
  )
}

const populateEditor = (id, html) => {
  const $form = $('form', html)

  $('#ory-editor-meta-data').empty()
  $saveModalContent = $('<div></div>')
  // normal form inputs
  $form
    .find('input, textarea')
    .filter((i, el) => {
      const name = el.getAttribute('name')
      return (
        $(`.editable[data-id="${id}"][data-edit-field="${name}"]`).length === 0
      )
    })
    .each((i, el) => {
      const name = el.getAttribute('name')
      const type = getType(el)
      const $destination = el.classList.contains('control')
        ? $saveModalContent
        : $('#ory-editor-meta-data')

      $destination.append(createFormElement(el, id, name, type))
    })
}

const getType = el => {
  switch (el.tagName) {
    case 'INPUT':
      return el.getAttribute('type')
    case 'TEXTAREA':
      return el.classList.contains('plain') ? 'plaintext' : 'ory'
  }
}

const createFormElement = (el, id, name, type) => {
  const $wrapper = $(
    `<div class="editable" data-id="${id}" data-edit-type="${
      type
    }" data-edit-field="${name}"></div>`
  )
  if (type === 'ory') {
    let data = $(el).val()
    if (data === '') {
      data = createEmptyState()
    } else {
      data = parse(data)
      if (data.cells === undefined) {
        data = convert(data)
      }
    }
    data.id = id + name
    editor.trigger.editable.add(data)
    editorState[name] = data


    const $label = $(el)
      .parents('.form-group')
      .find('.control-label')
    const $wrappedLabel = $('<div class="form-group"></div>').html($label)
    $wrappedLabel.append('<div class="ory-content"></div>')
    $wrapper.html($wrappedLabel)
    setTimeout(() => {
      ReactDOM.render(
        <Editable
          editor={editor}
          id={id + name}
          onChange={newState => {
            editorState[name] = newState
          }}
        />,
        $(
          `.editable[data-id="${id}"][data-edit-type="${
            type
          }"][data-edit-field="${name}"] .ory-content`
        )[0]
      )
    })
    return $wrapper
  } else {
    return $wrapper.html(type === 'hidden' ? el : $(el).parents('.form-group'))
  }
}

const collectData = id => {
  const data = {}
  $(`.editable[data-id="${id}"]`).each((i, element) => {
    const key = $(element).data('editField')
    if ($(element).data('editType') === 'ory') {
      data[key] = JSON.stringify(editorState[key])
    } else {
      data[key] = $('input, textarea', element).val()
    }
  })
  return data
}

export const save = id => {
  const data = collectData(id)
  console.log(data)
  $.ajax({
    type: 'POST',
    url: `/entity/repository/add-revision/${id}`,
    data: data
  }).done(response => {
    if ($('.has-error', response).length > 0) {
      populateEditor(id, response)
      window.alert('There was something wrong, please try again')
    } else {
      window.alert('Successfully saved revision')
      lastPersisted[id] = data
    }
    unloadEditor(id)
  })
}

export const restore = id => {
  forEachObjIndexed((data, key) => {
    const $element = $(`.editable[data-id="${id}"][data-edit-field="${key}"]`)
    if ($element.data('editType') === 'ory') {
      editor.trigger.editable.update(parse(data))
      /*ReactDOM.render(
        <Editable
          editor={editor}
          id={id + key}
          onChange={newState => {
            editorState[key] = newState
          }}
        />,
        $element.get(0)
      )*/
    } else {
      $element.find('input,textarea').val(data)
    }
  }, lastPersisted[id])

  unloadEditor(id)
}
