/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
import $ from 'jquery'
import * as R from 'ramda'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import 'ory-editor-core/lib/index.css'

import { createEditorPlugins, defaultPlugin } from '@serlo/editor-plugins'
import {
  createDocumentIdentifier,
  Document,
  EditorContext,
  Editor as E
} from '@splish-me/editor'
import {
  AddSidebar,
  ModeToolbar,
  PluginSidebar,
  Sidebar
} from '@splish-me/editor-ui'

import t from '../../modules/translator'
import Modals from '../../modules/modals'
import SystemNotification from '../../modules/system_notification'
import convert from '../converter'
import { getStateFromElement } from '../helpers'

let $saveModalContent = $('<div></div>')
const $formDataOnPage = $('#ory-edit-form')

class EditorComponent extends React.Component {
  state = {
    editables: []
  }

  editor = React.createRef()

  addEditable = editable => {
    this.setState(({ editables }) => {
      const existsAlready = R.find(e => e.id.id === editable.id, editables)

      if (existsAlready) {
        return null
      }

      editable.element.innerHTML = ''

      return {
        editables: [
          ...editables,
          {
            ...editable,
            id: createDocumentIdentifier(editable.id)
          }
        ]
      }
    })
  }

  getState = id => {
    return this.editor.current.serializeState({ id })
  }

  render() {
    const { type } = this.props
    const { editables } = this.state

    return (
      <E
        ref={this.editor}
        defaultPlugin={defaultPlugin}
        plugins={createEditorPlugins(type)}
      >
        <EditorContext.Consumer>
          {({ currentMode }) => {
            return (
              <React.Fragment>
                <ModeToolbar />
                <Sidebar
                  active={currentMode !== 'preview'}
                  hideToggle={currentMode === 'layout'}
                >
                  {currentMode === 'layout' ? (
                    <AddSidebar />
                  ) : (
                    <PluginSidebar />
                  )}
                </Sidebar>
              </React.Fragment>
            )
          }}
        </EditorContext.Consumer>
        {editables.map(editable => {
          return ReactDOM.createPortal(
            <div className="r">
              <div className="c24">
                <Document
                  state={editable.id}
                  initialState={editable.initialState}
                />
              </div>
            </div>,
            editable.element,
            editable.id.id
          )
        })}
      </E>
    )
  }
}

export class EntityEditor {
  constructor(id, editPath, type) {
    this.id = id
    this.editPath = editPath

    this.editorComponent = React.createRef()
    this.type = type // article, text-exercise, ..., page, user
    this.loadEditor()
    require('jquery.redirect')
  }

  prerenderExistingOryEditables = () => {
    $(`.editable[data-id="${this.id}"][data-edit-type="ory"]`).each(
      (i, editable) => {
        const key = $(editable).data('editField')
        const element = $(editable).find('.ory-content')[0]

        const content = getStateFromElement(element)
        content.id = this.id + key

        this.editorComponent.current.addEditable({
          id: content.id,
          initialState: content,
          element
        })
      }
    )
  }

  loadEditor() {
    ReactDOM.render(
      <EditorComponent ref={this.editorComponent} type={this.type} />,
      document.getElementById('controls')
    )

    this.prerenderExistingOryEditables()

    $('#subject-nav-wrapper').hide()
    $('#ory-editor-toolbar').show()
    $('#ory-editor-meta-data-wrapper').show()

    $(window).bind('beforeunload', function() {
      return t(
        'Are you sure you want to leave this page? All of your unsaved changes will be lost!'
      )
    })

    if ($formDataOnPage.length) {
      this.populateEditor($formDataOnPage.find('form'))
    } else {
      $.ajax({
        type: 'GET',
        url: `${this.editPath}`
      }).done(response => {
        this.populateEditor($('#ory-edit-form form', response))
      })
    }

    if ($('.has-error').length || $('.has-error', $saveModalContent).length) {
      SystemNotification.error(
        t(`Something went wrong. Please check the fields and send again`)
      )
      setTimeout(this.showSaveModal, 100)
    }
    $('#ory-editor-save').click(this.showSaveModal)
    $('#ory-editor-abort').click(this.showCancelModal)
  }

  save = () => {
    const data = this.collectData()
    $(window).unbind('beforeunload')
    $.redirect(this.editPath, data)
  }

  restore = () => {
    $(window).unbind('beforeunload')
    if (window.location.pathname.startsWith(this.editPath)) {
      window.location.assign(`/${this.id}`)
    } else {
      window.location.reload(true)
    }
  }

  populateEditor = $form => {
    $('#ory-editor-meta-data').empty()
    $saveModalContent = $('<div></div>')

    $form.find('input, textarea, select').each((i, el) => {
      const name = el.getAttribute('name')
      const type = this.getType(el)
      const existingElement = $(
        `.editable[data-id="${
          this.id
        }"][data-edit-field="${name}"][data-edit-type="${type}"]`
      )
      const newElement = this.createFormElement(el, name, type)

      if (existingElement.length) {
        // ignore existing ory elements and replace others
        if (type !== 'ory') {
          existingElement.html(newElement)
        }
      } else {
        this.getDestination(el).append(newElement)
      }
    })
  }

  createFormElement = (el, name, type) => {
    const $wrapper = $(
      `<div class="editable" data-id="${
        this.id
      }" data-edit-type="${type}" data-edit-field="${name}"></div>`
    )
    if (type === 'ory') {
      let data = $(el).val()
      if (data === '') {
        data = null
      } else {
        data = typeof data === 'string' ? JSON.parse(data) : data

        if (data.cells === undefined) {
          data = convert(data)
        }
      }

      if (data) {
        data.id = this.id + name
      }

      const $label = $(el)
        .parents('.form-group')
        .find('.control-label')
      const $wrappedLabel = $('<div class="form-group"></div>').html($label)
      $wrappedLabel.append('<div class="ory-content bordered"></div>')
      $wrapper.html($wrappedLabel)

      setTimeout(() => {
        this.editorComponent.current.addEditable({
          id: this.id + name,
          initialState: data,
          element: $(
            `.editable[data-id="${
              this.id
            }"][data-edit-type="${type}"][data-edit-field="${name}"] .ory-content`
          )[0]
        })
      })
    } else {
      $wrapper.html(type === 'hidden' ? el : $(el).parents('.form-group'))
    }

    return $wrapper
  }

  getType = el => {
    switch (el.tagName) {
      case 'INPUT':
        return el.getAttribute('type')
      case 'TEXTAREA':
        return el.classList.contains('plain') ? 'plaintext' : 'ory'
      case 'SELECT':
        return 'select'
    }
  }

  getDestination = formElement => {
    if (formElement.classList.contains('control')) {
      return $saveModalContent
    } else if (formElement.classList.contains('meta')) {
      return $('#ory-editor-meta-data')
    } else {
      // main data
      if ($formDataOnPage.length) {
        return $formDataOnPage.parent()
      } else {
        const $editable = $(`.editable[data-id="${this.id}"]`)
        return $editable.closest('article').length
          ? $editable.closest('article')
          : $('#content-layout article')
      }
    }
  }

  collectData = () => {
    let data = {}
    $(`.editable[data-id="${this.id}"]`).each((_i, element) => {
      const key = $(element).data('editField')
      switch ($(element).data('editType')) {
        case 'ory':
          const state = this.editorComponent.current.getState(this.id + key)
          data[key] = JSON.stringify(state)
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

  showSaveModal = () => {
    Modals.show(
      {
        title: t('Save'),
        content: $saveModalContent.html(),
        cancel: t('Cancel'),
        label: t('Save')
      },
      `save`,
      this.save
    )
  }
  showCancelModal = () => {
    Modals.show(
      {
        type: 'danger',
        title: t('Cancel'),
        content: t(
          'Are you sure you want to abort editing? All of your unsaved changes will be lost!'
        )
      },
      'abort-modal',
      this.restore
    )
  }
}
