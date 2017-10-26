/* global Element */
import $ from 'jquery'

import eventScope from '../../libs/eventscope'
import Common from '../../modules/common'
import t from '../../modules/translator'

var TextEditorHelper

TextEditorHelper = function (textEditor, settings) {
  var that = this

  that.settings = $.extend(
    {
      cursorDelta: 0,
      icon: undefined
    },
    settings
  )

  eventScope(that)

  that.textEditor = textEditor

  that.$el = $('<a>')
    .addClass('btn btn-default helper')
    .attr({
      href: '#',
      title: that.settings.title
    })

  if (that.settings.description) {
    that.$el.attr({
      'data-toggle': 'tooltip',
      'data-placement': 'bottom',
      title: that.settings.description
    })
  }

  if (that.settings.icon) {
    that.$el.html('<i class="fa fa-' + that.settings.icon + '"></i>')
  } else {
    that.$el.html(settings.title)
  }

  that.$el.click(function (e) {
    e.preventDefault()
    that.action()
  })

  if (that.settings.shortcut) {
    that.addEventListener(that.settings.shortcut, function (e) {
      e.stopPropagation()
      e.preventDefault()
      that.action()
    })
  }
}

TextEditorHelper.prototype.action = function () {
  if (this.textEditor.options.readOnly === false) {
    if (this.settings.action) {
      return this.settings.action.apply(this, arguments)
    }

    var cursor = this.textEditor.getCursor(false)
    var selection = Common.trim(this.textEditor.getSelection())
    var anchor = { line: cursor.line, ch: cursor.ch }
    var head = null

    if (selection) {
      this.textEditor.replaceSelection(
        this.settings.replaceBefore + selection + this.settings.replaceAfter
      )
      anchor.ch = cursor.ch + this.settings.cursorDelta - selection.length
    } else {
      this.textEditor.replaceRange(
        this.settings.replaceBefore + this.settings.replaceAfter,
        cursor
      )
      anchor.ch = cursor.ch + this.settings.cursorDelta
    }

    if (this.settings.selectionDelta) {
      head = {
        line: cursor.line
      }

      if (this.settings.selectionDelta === 'selection') {
        head.ch = anchor.ch + (selection ? selection.length : 0)
      } else {
        head.ch = anchor.ch + this.settings.selectionDelta
      }
    }

    this.textEditor.setSelection(anchor, head)
    this.textEditor.focus()
  }
}

TextEditorHelper.Bold = function (textEditor) {
  return new TextEditorHelper(textEditor, {
    title: 'Bold',
    icon: 'bold',
    replaceBefore: '**',
    replaceAfter: '**',
    cursorDelta: 2,
    selectionDelta: 'selection',
    shortcut: 'cmd+66',
    description: t('Make selected text bold')
  })
}

TextEditorHelper.Italic = function (textEditor) {
  return new TextEditorHelper(textEditor, {
    title: 'Italic',
    icon: 'italic',
    replaceBefore: '*',
    replaceAfter: '*',
    cursorDelta: 1,
    selectionDelta: 'selection',
    shortcut: 'cmd+73',
    description: t('Make selected text italic')
  })
}

TextEditorHelper.List = function (textEditor) {
  return new TextEditorHelper(textEditor, {
    title: 'List',
    icon: 'list',
    replaceBefore: '* ',
    replaceAfter: '\n* ',
    cursorDelta: 2,
    selectionDelta: 'selection',
    description: t('Insert a list')
  })
}

TextEditorHelper.Link = function (textEditor) {
  return new TextEditorHelper(textEditor, {
    title: 'Link',
    icon: 'link',
    replaceBefore: '[',
    replaceAfter: ']()',
    cursorDelta: 1,
    selectionDelta: 'selection',
    description: t('Insert a link')
  })
}

TextEditorHelper.Injection = function (textEditor) {
  return new TextEditorHelper(textEditor, {
    title: 'Injection',
    icon: 'code',
    replaceBefore: '>[',
    replaceAfter: ']()',
    cursorDelta: 2,
    selectionDelta: 'selection',
    description: t('Insert an injection or geogebra')
  })
}

TextEditorHelper.Strike = function (textEditor) {
  return new TextEditorHelper(textEditor, {
    title: 'Strike',
    icon: 'strikethrough',
    replaceBefore: '~~',
    replaceAfter: '~~',
    cursorDelta: 2,
    selectionDelta: 'selection',
    description: t('Strike selected text')
  })
}

TextEditorHelper.Image = function (textEditor) {
  return new TextEditorHelper(textEditor, {
    title: 'Image',
    icon: 'picture-o',
    replaceBefore: '![',
    replaceAfter: ']()',
    cursorDelta: 2,
    selectionDelta: 'selection',
    description: t('Insert an image')
  })
}

TextEditorHelper.Formula = function (textEditor) {
  return new TextEditorHelper(textEditor, {
    title: 'ƒ<i><sub>(x)</sub></i>',
    replaceBefore: '$$',
    replaceAfter: '$$',
    cursorDelta: 2,
    selectionDelta: 'selection',
    description: t('Insert a formula')
  })
}

TextEditorHelper.Undo = function (textEditor) {
  var that = this
  that.title = 'Undo'
  that.$el = $(
    '<a class="btn btn-default helper" data-toggle="tooltip" data-placement="bottom" href="#" title="' +
      that.title +
      '">'
  ).html('<i class="fa fa-undo"></i>')
  that.$el.click(function (e) {
    e.preventDefault()
    textEditor.undo()
  })
}

TextEditorHelper.Redo = function (textEditor) {
  var that = this
  that.title = 'Redo'
  that.$el = $(
    '<a class="btn btn-default helper" data-toggle="tooltip" data-placement="bottom" href="#" title="' +
      that.title +
      '">'
  ).html('<i class="fa fa-redo"></i>')
  that.$el.click(function (e) {
    e.preventDefault()
    textEditor.redo()
  })
}

TextEditorHelper.Fullscreen = function () {
  var that = this
  var fullScreenElement

  fullScreenElement = document.body

  if (
    !!fullScreenElement.webkitRequestFullScreen &&
    typeof Element !== 'undefined' &&
    Element.ALLOW_KEYBOARD_INPUT
  ) {
    that.title = 'Fullscreen'
    that.$el = $(
      '<a class="btn btn-default helper" data-toggle="tooltip" data-placement="bottom" href="#" title="' +
        that.title +
        '">'
    ).html('<i class="fa fa-expand"></i>')

    that.$el.click(function (e) {
      e.preventDefault()
      if (fullScreenElement.requestFullScreen) {
        fullScreenElement.requestFullScreen()
      } else if (fullScreenElement.mozRequestFullScreen) {
        fullScreenElement.mozRequestFullScreen()
      } else if (fullScreenElement.webkitRequestFullScreen) {
        fullScreenElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
      }
    })
  }
}

TextEditorHelper.HidePlugins = function (textEditor) {
  var that = this
  that.title = t('Hide Plugins')
  that.editor = textEditor
  that.hide = that.editor.hidePlugins = false
  that.$el = $('<div class="btn btn-default helper btn-labeled">').html(
    '<span class="btn-label"><span class="fa fa-eye-slash"></span></span>' +
      that.title
  )
  that.$el.click(function (e) {
    e.preventDefault()
    that.action()
  })
}

TextEditorHelper.HidePlugins.prototype.action = function () {
  this.active = this.editor.hidePlugins = !this.active
  // this.$el.toggleClass('active', this.active);
  if (this.active) {
    this.$el.html(
      '<span class="btn-label"><span class="fa fa-eye"></span></span>' +
        t('Show plugins')
    )
  } else {
    this.$el.html(
      '<span class="btn-label"><span class="fa fa-eye-slash"></span></span>' +
        t('Hide plugins')
    )
  }
}

TextEditorHelper.Spoiler = function (textEditor) {
  var titleText = t('Title')
  return new TextEditorHelper(textEditor, {
    title: 'Spoiler',
    replaceBefore: '/// ' + titleText + '\n',
    replaceAfter: '\n///',
    cursorDelta: 4,
    icon: 'caret-square-o-down',
    selectionDelta: titleText.length,
    description: t('Insert a spoiler')
  })
}

export default TextEditorHelper
