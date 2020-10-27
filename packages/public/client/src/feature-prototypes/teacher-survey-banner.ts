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
import Cookie from 'js-cookie'
import { getAuthenticatedUserID } from '../frontend/modules/user'
import { getSaEvent } from '../modules/analytics'

const surveyLink =
  'https://serloeducation.typeform.com/to/JPSDcuU1#source=website'
const bannerCode = `
  <div id="teacher-banner" style="position:fixed; top:calc(50% - 100px); right: 0; z-index: 100;">
    <a class="typeform-share button" href="${surveyLink}"
       data-mode="side_panel"
       style="box-sizing:border-box;position:absolute;width:250px;height:250px;
              margin:0;cursor:pointer;background:#017EC1;border-radius:4px 0px 0px 4px;
              box-shadow:0px 2px 12px rgba(0, 0, 0, 0.06), 0px 2px 4px rgba(0, 0, 0, 0.08);
              color:white;text-decoration:none;">
      <span style="display:flex; align-items:center; justify-content:space-evenly;
                   flex-flow:column wrap; width: 100%; height: 100%; padding: 0 20px;">
        <span class="fa fa-5x fa-comment"></span>
        <span style="text-decoration:none;font-size:23px;font-family:Helvetica,Arial,sans-serif;
                     white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;font-weight: 600;
                     text-align:center;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
          Deine Meinung als<br>Lehrkraft ist uns<br>wichtig
        </span>
      </span>
    </a>
  </div>
`

export function initTeacherSurveyBanner() {
  if (!window.location.hostname.startsWith('de')) return
  if (['/', '/auth/login', '/user/register'].includes(window.location.pathname))
    return

  if (getAuthenticatedUserID()) return

  const isMobile = window.innerWidth < 1300 || window.innerHeight < 550
  if (isMobile) return

  if (new Date() > new Date(2020, 10, 1, 23)) return

  const saEvent = getSaEvent()
  const endDateCookie = new Date(2020, 10, 20)
  const cookieName = 'teacherSurvey20201101StartTime'
  let startTime = parseInt(Cookie.get(cookieName) ?? '')

  if (Number.isNaN(startTime)) {
    saEvent('teacher_survey_20201101_session_started')
    startTime = Date.now()
    Cookie.set(cookieName, startTime.toString(), {
      path: '/',
      expires: endDateCookie,
    })
  }

  if (Date.now() - startTime > 5 * 60 * 1000) return

  saEvent('teacher_survey_20201101_banner_showed')
  $('body').append(bannerCode)
  $('#teacher-banner a > span').on('click', () => {
    saEvent('teacher_survey_20201101_banner_clicked', () => {
      window.location.href = surveyLink
    })

    return false
  })

  setTimeout(() => $('#teacher-banner').animate({ right: 250 }, 700), 200)
}
