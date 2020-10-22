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
const bannerCode = `
  <div id="teacher-banner" style="position:fixed; top:calc(50% - 200px); right:-55px;">
    <a class="typeform-share button" href="https://serloeducation.typeform.com/to/JPSDcuU1#source=website"
       data-mode="side_panel"
       style="box-sizing:border-box;position:absolute;top:300px;width:310px;height:55px;padding:0 20px;
              margin:0;cursor:pointer;background:#017EC1;border-radius:4px 4px 0px 0px;
              box-shadow:0px 2px 12px rgba(0, 0, 0, 0.06), 0px 2px 4px rgba(0, 0, 0, 0.08);
              display:flex;align-items:center;justify-content:flex-start;transform:rotate(-90deg);
              transform-origin:bottom left;color:white;text-decoration:none;"
       data-width="320" data-height="500" target="_blank">
      <span class="fa fa-2x fa-comment" style="transform:rotate(90deg);"></span>
      <span style="text-decoration:none;font-size:22px;font-family:Helvetica,Arial,sans-serif;
                   white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;
                   text-align:center;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
        Umfrage für Lehrkräfte
      </span>
    </a>
  </div>
`

export function initTeacherSurveyBanner() {
  if (!window.location.hostname.startsWith('de')) return
  if (['/', '/auth/login', '/user/register'].includes(window.location.pathname))
    return

  // Look for notification button => user is authenticated
  if ($('#top-bar-collapse .nav.notifications li').length >= 1) return

  if ((window.innerWidth ?? 0) < 1350) return
  if ((window.innerHeight ?? 0) < 760) return

  const now = new Date()
  const endDateCampaign = new Date(2020, 9, 24, 22)
  if (
    1 <= now.getDay() &&
    now.getDay() <= 5 &&
    8 <= now.getHours() &&
    now.getHours() <= 12
  )
    return
  if (now > endDateCampaign) return

  const endDateCookie = new Date(2020, 10, 20)
  const cookieName = 'teacherSurvey202010StartTime'
  let startTime = parseInt(getCookieValue(cookieName) ?? '')

  if (Number.isNaN(startTime)) {
    startTime = Date.now()
    document.cookie = `${cookieName}=${startTime}; expires=${endDateCookie.toUTCString()}; path=/`
  }

  if (Date.now() - startTime > 4 * 60 * 1000) return

  $('body').append(bannerCode)

  setTimeout(() => $('#teacher-banner').animate({ right: 0 }, 700), 200)
}

// TODO: Outsource this function into utils
// See https://github.com/serlo/serlo.org-cloudflare-worker/blob/4ac008d222436ecc67ade58eb050bce9af1c806f/src/utils.tsx#L55-L66
function getCookieValue(name: string): string | null {
  return (
    document.cookie
      .split(';')
      .map((c) => c.trim())
      .filter((c) => c.startsWith(`${name}=`))
      .map((c) => c.substring(name.length + 1))[0] ?? null
  )
}
