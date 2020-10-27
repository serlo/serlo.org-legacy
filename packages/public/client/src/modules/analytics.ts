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
export function getSaEvent(): (event: string, callback?: () => void) => void {
  const w = (window as unknown) as any

  w.sa_event =
    w.sa_event ||
    function (_message: string, callback: () => void) {
      const a = [].slice.call(arguments)
      w.sa_event.q ? w.sa_event.q.push(a) : (w.sa_event.q = [a])

      // After 300ms we assume that the script of simpleanalytics could not
      // be fetched and we call the callback directly as a fallback
      setTimeout(callback, 300)
    }

  return w.sa_event
}
