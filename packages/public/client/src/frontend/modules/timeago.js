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
/* global setInterval */
import $ from 'jquery'
import moment from 'moment'

var TimeAgo

function updateTime($elem, datetime) {
  $elem.text(datetime.fromNow())
}

TimeAgo = function() {
  return $(this).each(function() {
    var self = this
    var $self = $(self)
    var datetime = $self.attr('title') || null

    if (!datetime) {
      return
    }

    datetime = moment.utc(datetime).local()

    if (!datetime.isValid()) {
      return
    }

    // format as 1. Januar 1970 00:00:00
    $self.attr('title', datetime.format('LL, LTS'))

    updateTime($self, datetime)

    self.interval = setInterval(function() {
      updateTime($self, datetime)
    }, 45000)
  })
}

$.fn.TimeAgo = TimeAgo
