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
import {
  logout,
  toHaveAttribute,
  toHaveHTMLContent,
  toHaveTitle,
  toHaveUrlPath,
  toHaveCollapsable,
  toHaveSystemNotification,
} from './packages/public/server/__tests-e2e__/_utils'

setTimeout(600)
page.setDefaultTimeout(60000)

beforeAll(() => {
  page.on('dialog', (dialog) => {
    if (dialog.type() === 'beforeunload') {
      dialog.accept()
    }
  })
})

afterEach(async () => {
  await logout()
})

expect.extend({
  toHaveAttribute,
  toHaveHTMLContent,
  toHaveTitle,
  toHaveUrlPath,
  toHaveCollapsable,
  toHaveSystemNotification,
})

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toHaveAttribute(attribute: string, value: any): Promise<R>
      toHaveHTMLContent(content: string): Promise<R>
      toHaveTitle(pageTitle: string): Promise<R>
      toHaveUrlPath(urlPath: string): R
      toHaveCollapsable(
        collapsedContent: string,
        toggleContent: string
      ): Promise<R>
      toHaveSystemNotification(notification: string): Promise<R>
    }
  }
}

function setTimeout(seconds: number) {
  jest.setTimeout(seconds * 1000)
}
