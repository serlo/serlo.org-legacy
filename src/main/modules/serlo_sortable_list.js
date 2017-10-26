import $ from 'jquery'
import _ from 'underscore'

import Common from '../../modules/common'
import SystemNotification from '../../modules/system_notification'
import t from '../../modules/translator'

var SortableList

SortableList = function () {
  return $(this).each(function (group) {
    var $instance = $(this)
    var $saveBtn = $('.sortable-save-action', this)
    var $activateBtn = $('.sortable-activate-action', this)
    var $abortBtn = $('.sortable-abort-action', this)
    var activeClass = 'sortable-active'
    var dataUrl
    var dataDepth
    var dataActive
    var originalHTML
    var originalData
    var updatedData

    dataUrl = $instance.attr('data-action')

    if (!dataUrl) {
      throw new Error('No sort action given for sortable wrapper.')
    }

    dataActive = $instance.attr('data-active') || 'true'
    dataActive = dataActive === 'true'

    dataDepth = $instance.attr('data-depth') || 50

    /**
             * @function cleanEmptyChildren
             * @param {Array}
             *
             * Removes empty children arrays from serialized nestable,
             * to be able to hide the $saveBtn
             **/
    function cleanEmptyChildren (array) {
      _.each(array, function (child) {
        if (child.children) {
          if (child.children.length) {
            cleanEmptyChildren(child.children)
          } else {
            delete child.children
          }
        }
      })
      return array
    }

    function storeOriginalData () {
      originalHTML = $instance
        .find('> ol')
        .first()
        .html()
      originalData = cleanEmptyChildren($instance.nestable('serialize'))
    }

    function activate () {
      $instance.addClass(activeClass)

      $activateBtn.hide()
      $abortBtn.show()

      $instance.nestable({
        rootClass: 'sortable',
        listClass: 'sortable-list',
        itemClass: 'sortable-item',
        dragClass: 'sortable-dragel',
        handleClass: 'sortable-handle',
        collapsedClass: 'sortable-collapsed',
        placeClass: 'sortable-placeholder',
        noDragClass: 'sortable-nodrag',
        emptyClass: 'sortable-empty',

        expandBtnHTML: '',
        collapseBtnHTML: '',
        group: group,
        maxDepth: dataDepth,
        threshold: 20
      })

      storeOriginalData()
    }

    function deactivate () {
      // Router.reload();
      $instance
        .removeClass(activeClass)
        .nestable('destroy')
        .find('> ol')
        .first()
        .html(originalHTML)

      $saveBtn.hide()
      $abortBtn.hide()
      $activateBtn.show()
    }

    $instance.on('change', function () {
      updatedData = cleanEmptyChildren($instance.nestable('serialize'))
      if (!_.isEqual(updatedData, originalData)) {
        $saveBtn.show()
      } else {
        $saveBtn.hide()
      }
    })

    $saveBtn.click(function (e) {
      e.preventDefault()
      $.ajax({
        url: dataUrl,
        data: {
          sortable: updatedData,
          csrf: $('#sort-csrf').val()
        },
        method: 'post'
      })
        .then(function () {
          SystemNotification.notify(t('Order successfully saved'), 'success')

          storeOriginalData()

          if (!dataActive) {
            deactivate()
          }

          $saveBtn.hide()
        })
        .fail(function () {
          Common.genericError(arguments)
        })
    })

    $abortBtn.click(function () {
      if (!dataActive) {
        deactivate()
      }
    })

    $activateBtn.click(function () {
      activate()
    })

    if (dataActive) {
      activate()
    }
  })
}

$.fn.SortableList = SortableList
