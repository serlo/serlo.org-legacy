import React from 'react'
import ReactDOM from 'react-dom'

import {forEach, map, zipWith} from 'ramda'
import Editor, {Editable, createEmptyState} from 'ory-editor-core'
import {HTMLRenderer} from 'ory-editor-renderer'
import 'ory-editor-core/lib/index.css' // we also want to load the stylesheets

import {Trash, DisplayModeToggle, Toolbar} from 'ory-editor-ui'
import 'ory-editor-ui/lib/index.css'

// Load some exemplary plugins:
import EditorPlugins from './plugins'
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

require('react-tap-event-plugin')() // react-tap-event-plugin is required by material-ui which is used by ory-editor-ui so we need to call it here

export const renderContent = () => {
  const $elements = $('.editable[data-edit-type="ory"] > div[data-raw-content]')
  $elements.each((i, element) => {
    const content = $(element).data('rawContent')
    ReactDOM.render(<HTMLRenderer state={content} plugins={EditorPlugins} />, element)
  })
}

const editor = new Editor({
  plugins: EditorPlugins,
  editables: []
})

let editorState = []
let lastPersisted = []

export const loadEditor = (id) => {
  $(`.editable[data-id="${id}"]`).each((i, editable) => {
    const type = $(editable).data('editType')
    const key = $(editable).data('editField')

    switch (type) {
      case 'ory':
        const element = $(editable).children()[0]
        const content = $(element).data('rawContent')
        content.id = id + key
        editor.trigger.editable.add(content)

        ReactDOM.render(
          <Editable
            editor={editor}
            id={id + key}
            onChange={(newState) => {
              editorState[key] = newState
            }}
          />, element)
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
      <Trash editor={editor}/>
      <DisplayModeToggle editor={editor}/>
      <Toolbar editor={editor}/>
    </div>
    ,
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
  }).done((response) => {
    populateEditor(id, response)
  })

  $('#ory-editor-save').click(() => save(id))
}

const populateEditor = (id, formHTML) => {
  const $form = $(formHTML)
  // normal form inputs
  $form
    .find('input, textarea')
    .filter((i, el) => {
      const name = el.getAttribute('name')
      return $(`.editable[data-id="${id}"][data-edit-field="${name}"]`).length === 0
    })
    .each((i, el) => {
      const name = el.getAttribute('name')
      const type = el.tagName === 'TEXTAREA' ? 'textarea' : el.getAttribute('type')
      $('#ory-editor-meta-data').append(createFormElement(el, id, name, type))
    })
}

const createFormElement = (el, id, name, type) => {
  return $(`<div class="editable" data-id="${id}" data-edit-type="${type}" data-edit-field="${name}"></div>`)
    .html(type === 'hidden' ? el : $(el).parents('.form-group'))
}

/*    forEach(content => {
      editor.trigger.editable.add(content)
      lastPersisted[content.id] = content
    }, contents)
*/

export const save = (id) => {
  let data = {}
  $(`.editable[data-id="${id}"]`).each(
    (i, element) => {
      const key = $(element).data('editField')
      if ($(element).data('editType') === 'ory') {
        data[key] = JSON.stringify(editorState[key])
      } else {
        data[key] = $('input, textarea', element).val()
      }
    }
  )

  console.log(data)

  $.ajax({
    type: 'POST',
    url: `/entity/repository/add-revision/${id}`,
    data: data
  }).done(() => {
    window.alert('Successfully saved revision')
    lastPersisted[id] = data
  })
}
