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
/* global window */
import $ from 'jquery'
import _ from 'underscore'

import SystemNotification from '../../modules/system_notification'
import t from '../../modules/translator'

var checkSupportFor = ['JSON', 'localStorage']
var fails = []

function check() {
  if ($('html').hasClass('old-ie')) {
    SystemNotification.notify(
      t('You are using an outdated web browser. Please consider an update!'),
      'danger'
    )
  }
  // check for browser support
  _.each(checkSupportFor, function (value) {
    if (typeof value === 'function') {
      var failed = value()
      if (failed) {
        fails.push(failed)
      }
    } else if (!window[value]) {
      fails.push('<strong>' + value + '</strong>')
    }
  })

  if (fails.length) {
    SystemNotification.notify(
      t(
        "Your browser doesn't support the following technologies: %s <br>Please update your browser!",
        fails.join(', ')
      ),
      'warning',
      true,
      'serlo-supporter'
    )
  }

  return fails
}

function add(support) {
  checkSupportFor.push(support)
}

const supp = {
  check: check,
  add: add,
}

export default supp
