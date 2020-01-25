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
import * as assert from 'assert'
import { printReceived, printDiffOrStringify } from 'jest-matcher-utils'
import { ElementHandle } from 'puppeteer'
import { queries, getDocument } from 'pptr-testing-library'
import { testingServerUrl, pages } from './_config'

export { getDocument } from 'pptr-testing-library'

export const getByText = queries.getByText
export const queryByText = queries.queryByText
export const getByPlaceholderText = queries.getByPlaceholderText

export async function getByItemType(element: ElementHandle, itemType: string) {
  return getBySelector(element, `[itemtype="${itemType}"]`)
}

export async function getBySelector(element: ElementHandle, selector: string) {
  const queryResults = await element.$$(selector)

  assert.ok(
    queryResults.length > 0,
    `No element for selector \`${selector}\` found`
  )
  assert.ok(
    queryResults.length < 2,
    `More than one element for selector \`${selector}\` found`
  )

  return queryResults[0]
}

export async function goto(site: string): Promise<ElementHandle> {
  await page.goto(testingServerUrl + site)

  return getDocument(page)
}

export async function clickForNewPage(
  element: ElementHandle
): Promise<ElementHandle> {
  await element.click()
  await page.waitForNavigation()

  return getDocument(page)
}

function just<T>(x: T): NonNullable<T> {
  assert.ok(x !== null)

  return x!
}

export async function getText(element: ElementHandle): Promise<string> {
  return element.evaluate(e => e.textContent).then(just)
}

export async function login(user: string): Promise<void> {
  await logout()

  const loginPage = await goto(pages.login.path)

  const { buttonLogin, inputUser, inputPassword } = pages.login.identifier
  await getByPlaceholderText(loginPage, inputUser).then(e => e.type(user))
  await getByPlaceholderText(loginPage, inputPassword).then(e =>
    e.type(pages.login.defaultPassword)
  )

  await getByText(loginPage, buttonLogin).then(clickForNewPage)
}

export async function logout(): Promise<void> {
  await goto(pages.logout.path)
}

export function toHaveUrlPath(
  this: jest.MatcherUtils,
  page: ElementHandle,
  expectedPage: string
): jest.CustomMatcherResult {
  const expectedUrl = testingServerUrl + expectedPage
  const currentUrl = page
    .executionContext()
    //@ts-ignore
    .frame()!
    .url()

  if (expectedUrl === currentUrl) {
    return {
      pass: true,
      message: () => `Current URL should not be ${printReceived(currentUrl)}`
    }
  } else {
    return {
      pass: false,
      message: () =>
        printDiffOrStringify(
          expectedUrl,
          currentUrl,
          'Expected URL',
          'Current URL',
          this.expand
        )
    }
  }
}
