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
import base64 from 'base-64'

require('react-tap-event-plugin')() // react-tap-event-plugin is required by material-ui which is used by ory-editor-ui so we need to call it here

const editor = new Editor({
  plugins: EditorPlugins,
  editables: [],
  defaultPlugin
})

let editorState = []
let lastPersisted = []
let $saveModalContent = $('<div></div>')
const $editData = $('#first-data')

const parse = content =>
  typeof content === 'string' ? JSON.parse(content) : content

export const renderEditable = () => {
  const $elements = $('.editable[data-edit-type="ory"] > div[data-raw-content]')
  $elements.each((i, element) => {
    console.log($(element).data('rawContent'))
    const content = parse(base64.decode($(element).data('rawContent')))
    ReactDOM.render(
      <HTMLRenderer state={content} plugins={EditorPlugins} />,
      element
    )
  })
}

export const loadEditor = id => {
  $(`.editable[data-id="${id}"]`).each((i, editable) => {
    const type = $(editable).data('editType')
    const key = $(editable).data('editField')

    switch (type) {
      case 'ory':
        const element = $(editable).find('.ory-content')[0]

        if (!editorState[key]) {
          console.log($(element).data('rawContent'))
          let data = parse(base64.decode($(element).data('rawContent')))
          data.id = id + key
          editorState[key] = data
        }
        const content = editorState[key]

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

  if ($editData.length) {
    populateEditor(id, $editData[0].outerHTML)
    lastPersisted[id] = collectData(id)
  } else {
    $.ajax({
      type: 'GET',
      url: `/entity/repository/add-revision/${id}`
    }).done(response => {
      populateEditor(id, response)
      lastPersisted[id] = collectData(id)
    })
  }

  $('#ory-editor-save').click(showSaveModal(id))
  $('#ory-editor-abort').click(showCancelModal(id))
}

export const unloadEditor = id => {
  $('#ory-editor-meta-data').empty()
  $(`.editable[data-id="${id}"]`).each((i, editable) => {
    const type = $(editable).data('editType')
    const key = $(editable).data('editField')

    switch (type) {
      case 'ory':
        const element = $(editable).children()[0]
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


export const save = id => {
  const data = collectData(id)
  $.ajax({
    type: 'POST',
    url: `/entity/repository/add-revision/${id}`,
    data: data
  }).done(response => {
    if ($('.has-error', response).length > 0) {
      populateEditor(id, response)
      window.alert('There was something wrong, please try again')
      if ($saveModalContent.find('.has-error')) {
        showSaveModal(id)
      }
    } else {
      window.alert('Successfully saved revision. Changed meta-data will be visible after reloading the page.')
      lastPersisted[id] = data
      unloadEditor(id)
    }
  })
}

export const restore = id => {
  forEachObjIndexed((data, key) => {
    const $element = $(`.editable[data-id="${id}"][data-edit-field="${key}"]`)
    if ($element.data('editType') === 'ory') {
      editor.trigger.editable.update(parse(data))
    } else {
      $element.find('input,textarea,select').val(data)
    }
  }, lastPersisted[id])

  unloadEditor(id)
}

const populateEditor = (id, html) => {
  const $form = $('form', html)

  console.log($form)
  $('#ory-editor-meta-data').empty()
  $saveModalContent = $('<div></div>')
  // normal form inputs
  $form
    .find('input, textarea, select')
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
        : $editData.length
          ? $editData.parent()
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
    case 'SELECT':
      return 'select'
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
    $wrappedLabel.append('<div class="ory-content bordered"></div>')
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
    switch($(element).data('editType')) {
      case 'ory':
        data[key] = JSON.stringify(editorState[key])
        break
      case 'checkbox':
        if ($('input', element).is(':checked')) {
          data[key] = 1
        }
        break
      default:
        data[key] = $('input, textarea, select', element).val()
    }
  })
  return data
}

const showSaveModal = id => () => {
  Modals.show(
    {
      title: t('Save'),
      content: $saveModalContent.html(),
      cancel: t('Cancel'),
      label: t('Save')
    }, `save-${id}` ,
    () => save(id)
  )
}

const showCancelModal = id => () => {
  Modals.show(
    {
      type: 'danger',
      title: t('Cancel'),
      content: t(
        'Are you sure you want to abort editing? All of your unsaved changes will be lost!'
      )
    },
    'abort-modal',
    () => restore(id)
  )
}
