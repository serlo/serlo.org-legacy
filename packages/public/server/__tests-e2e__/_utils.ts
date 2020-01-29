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

export const getByAltText = queries.getByAltText
export const getByLabelText = queries.getByLabelText
export const getByPlaceholderText = queries.getByPlaceholderText
export const getByText = queries.getByText
export const getByRole = queries.getByRole
export const queryByText = queries.queryByText

export async function getByItemType(element: ElementHandle, itemType: string) {
  return getBySelector(element, `[itemtype="${itemType}"]`)
}

export async function getByItemProp(element: ElementHandle, itemProp: string) {
  return getBySelector(element, `[itemprop="${itemProp}"]`)
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

export async function click(element: ElementHandle): Promise<void> {
  await element.click()
}

export async function clickForNewPage(
  element: ElementHandle
): Promise<ElementHandle> {
  await element.click()
  await page.waitForNavigation({ waitUntil: 'networkidle0' })

  return getDocument(page)
}

function just<T>(x: T): NonNullable<T> {
  assert.ok(x !== null)

  return x!
}

export async function getText(element: ElementHandle): Promise<string> {
  return element.evaluate(e => e.textContent).then(just)
}

export async function getMainContent(
  element: ElementHandle
): Promise<ElementHandle> {
  return getBySelector(element, '#page')
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

export function randomText(prefix?: string): string {
  return (prefix ?? 'Text') + ' ' + String(Math.floor(Math.random() * 1e12))
}

export async function toHaveAttribute(
  this: jest.MatcherUtils,
  element: ElementHandle,
  attribute: string,
  value: any
): Promise<jest.CustomMatcherResult> {
  return testIsEqual(
    String(value),
    await element.evaluate((e, x) => e.getAttribute(x), attribute).then(just),
    `attribute "${attribute}"`,
    this.expand
  )
}

export async function toHaveHTMLContent(
  this: jest.MatcherUtils,
  element: ElementHandle,
  content: string
): Promise<jest.CustomMatcherResult> {
  return testIsEqual(
    content,
    await element.evaluate(e => e.innerHTML).then(just),
    'HTML content',
    this.expand
  )
}

export async function toHaveTitle(
  this: jest.MatcherUtils,
  page: ElementHandle,
  pageTitle: string
): Promise<jest.CustomMatcherResult> {
  return testStartsWith(
    pageTitle,
    await page
      .executionContext()
      //@ts-ignore
      .frame()!
      .title(),
    'title',
    this.expand
  )
}

export function toHaveUrlPath(
  this: jest.MatcherUtils,
  page: ElementHandle,
  expectedPage: string
): jest.CustomMatcherResult {
  return testIsEqual(
    testingServerUrl + expectedPage,
    page
      .executionContext()
      //@ts-ignore
      .frame()!
      .url(),
    'URL',
    this.expand
  )
}

function testStartsWith(
  expected: string,
  current: string,
  label: string,
  expand: boolean
): jest.CustomMatcherResult {
  if (current.startsWith(expected)) {
    return {
      pass: true,
      message: () => `Current ${label} should not be ${printReceived(current)}`
    }
  } else {
    return {
      pass: false,
      message: () =>
        printDiffOrStringify(
          expected,
          current,
          `Expected ${label}`,
          `Current ${label}`,
          expand
        )
    }
  }
}

function testIsEqual(
  expected: string,
  current: string,
  label: string,
  expand: boolean
): jest.CustomMatcherResult {
  if (expected === current) {
    return {
      pass: true,
      message: () => `Current ${label} should not be ${printReceived(current)}`
    }
  } else {
    return {
      pass: false,
      message: () =>
        printDiffOrStringify(
          expected,
          current,
          `Expected ${label}`,
          `Current ${label}`,
          expand
        )
    }
  }
}
