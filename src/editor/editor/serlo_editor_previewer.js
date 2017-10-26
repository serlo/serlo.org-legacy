import $ from 'jquery'

import eventScope from '../../libs/eventscope'
import Field from './serlo_formfield'

var Preview
var slice = Array.prototype.slice

Preview = function (options) {
  this.$el = options.$el
  this.formFields = []

  eventScope(this)

  this.init()
}

Preview.prototype.init = function () {
  var that = this

  that.$el.click(function () {
    that.trigger('blur')
  })
}

Preview.prototype.setLayoutBuilderConfiguration = function (
  layoutBuilderConfiguration
) {
  this.layoutBuilderConfiguration = layoutBuilderConfiguration
}

Preview.prototype.createFromForm = function ($form) {
  var self = this

  if ($form.children().length) {
    self.formFields = []

    $('input,textarea,select,button', $form).each(function () {
      var field
      var $label
      var type = self.getFieldType(this)

      if (type) {
        field = new Field[type](this)

        if (type === 'Checkbox') {
          $label = $(this).parent()
        } else {
          $label = $(
            'label[name="' +
              $(this).attr('name') +
              '"],label[for="' +
              $(this).attr('name') +
              '"]'
          )
        }

        if ($label.length) {
          field.setLabel($label.text())
        }

        field.addEventListener('column-add', function () {
          self.trigger.apply(self, ['column-add'].concat(slice.call(arguments)))
        })

        field.addEventListener('select', function (field) {
          self.activeField = field
          self.trigger.apply(
            self,
            ['field-select'].concat(slice.call(arguments))
          )
        })

        field.addEventListener('update', function () {
          self.trigger.apply(self, ['update'].concat(slice.call(arguments)))
        })

        if (type === 'Textarea') {
          if (!self.layoutBuilderConfiguration) {
            throw new Error('No Layout Builder Configuration set')
          }
          field.addLayoutBuilder(self.layoutBuilderConfiguration)
        }

        self.formFields.push(field)
        self.$el.append(field.$el)
      }
    })
  }
}

Preview.prototype.focusNextColumn = function () {
  if (this.activeField) {
    this.activeField.trigger('focus-next-column')
  }
}

Preview.prototype.focusPreviousColumn = function () {
  if (this.activeField) {
    this.activeField.trigger('focus-previous-column')
  }
}

Preview.prototype.focusNextRow = function () {
  if (this.activeField) {
    this.activeField.trigger('focus-next-row')
  }
}

Preview.prototype.focusPreviousRow = function () {
  if (this.activeField) {
    this.activeField.trigger('focus-previous-row')
  }
}

Preview.prototype.getFieldType = function (field) {
  var self = this
  var type

  switch (field.tagName) {
    case 'TEXTAREA':
      if (field.classList.contains('plain')) {
        type = 'PlainText'
      } else {
        type = 'Textarea'
      }
      break
    case 'INPUT':
      switch (field.type) {
        case 'hidden':
          return
        case 'submit':
          self.submit = field
          break
        case 'checkbox':
          type = 'Checkbox'
          break
        case 'radio':
          type = 'Radio'
          break
        default:
          type = 'Input'
          break
      }
      break
    case 'BUTTON':
      switch (field.type) {
        case 'submit':
          self.submit = field
          break
        default:
          type = 'Button'
          break
      }
      break
    case 'SELECT':
      type = 'Select'
      break
    case 'LABEL':
      type = 'Label'
      break
  }

  return type
}

Preview.prototype.scrollSync = function ($elem, percentage) {
  var $parent = this.$el.parent()
  var target
  var maxScroll
  var pos = $elem.offset().top + $parent.scrollTop() - 90
  var diff = $elem.height() - $parent.height() + 90

  if (diff > 0) {
    target = pos + diff * percentage
  } else if (
    pos + $elem.height() >
    $parent.height() + $parent.scrollTop() - 90
  ) {
    target = pos
  } else if (pos < $parent.scrollTop()) {
    target = pos
  }

  if (target) {
    maxScroll = $parent[0].scrollHeight - $parent[0].clientHeight
    if (target > maxScroll) {
      target = maxScroll
    } else if (target < 0) {
      target = 0
    }

    $parent.animate(
      {
        scrollTop: target
      },
      {
        queue: false
      }
    )
  }
}

Preview.prototype.scrollTo = function ($elem, offset) {
  offset = offset || 0

  var $parent = this.$el.parent()
  var top = $elem.offset().top + $parent.scrollTop()
  var target = (function () {
    var maxScroll = $parent[0].scrollHeight - $parent[0].clientHeight
    var elemTarget = top + offset

    return elemTarget < 0 ? 0 : elemTarget > maxScroll ? maxScroll : elemTarget
  })()

  $parent.animate({
    scrollTop: target
  })
}

export default Preview
