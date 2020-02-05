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
import { ElementHandle, Cookie } from 'puppeteer'
import { queries, getDocument } from 'pptr-testing-library'
import * as R from 'ramda'
import { testingServerUrl, pages } from './_config'

export const getByAltText = queries.getByAltText
export const getByLabelText = queries.getByLabelText
export const getByPlaceholderText = queries.getByPlaceholderText
export const getByRole = queries.getByRole
export const getByText = queries.getByText
export const getAllByText = queries.getAllByText

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
  const url = site.startsWith('http') ? site : testingServerUrl + site

  await page.goto(url)

  return getDocument(page)
}

export async function click(element: ElementHandle): Promise<void> {
  await element.click()
  await page.waitFor(200)
}

export async function typeIntoEditor(
  root: ElementHandle,
  indexTextfield: number,
  text: string
): Promise<void> {
  await root.$$('[data-slate-editor=true]').then(s => click(s[indexTextfield]))
  await getByRole(root, 'textbox').then(t => t.type(text))
}

export async function clickForNewPage(
  element: ElementHandle
): Promise<ElementHandle> {
  await element.click()
  await page.waitForNavigation()
  await page.waitFor(300)

  return getDocument(page)
}

function just<T>(x: T): NonNullable<T> {
  assert.ok(x !== null)

  return x!
}

export async function isVisible(
  element: ElementHandle<HTMLElement>
): Promise<boolean> {
  return element.evaluate(
    e => !!(e && (e.offsetWidth || e.offsetHeight || e.getClientRects().length))
  )
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
  const cookies = await page.cookies(testingServerUrl)
  const isAuthenticationCookie = (cookie: Cookie) =>
    cookie['name'] === 'authenticated' && cookie['value'] === '1'

  if (R.any(isAuthenticationCookie, cookies)) {
    await goto(pages.logout.path)
  }
}

export async function openDropdownMenu(topic: ElementHandle) {
  await getBySelector(
    topic,
    '#subject-nav-wrapper button.dropdown-toggle'
  ).then(click)

  return await page.waitForSelector('#subject-nav-wrapper .dropdown-menu')
}
export function addContent(type: string) {
  return async (topic: ElementHandle) => {
    await getByText(topic, 'Add content').then(e => e.hover())

    return await getByText(topic, type).then(clickForNewPage)
  }
}
export async function organizeTaxonomy(topic: ElementHandle) {
  return await getByText(topic, 'Organize taxonomy').then(clickForNewPage)
}

export async function saveRevision(createPage: ElementHandle) {
  await getBySelector(createPage, '#subject-nav-wrapper .fa-save').then(click)
  await getByLabelText(createPage, 'Änderungen').then(e => e.type(randomText()))
  await createPage.$$('input[type=checkbox]').then(c => c[0].click())
  await createPage.$$('input[type=checkbox]').then(c => c[3].click())

  return await getByText(createPage, 'Speichern', {
    selector: 'button'
  }).then(clickForNewPage)
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
  root: ElementHandle,
  pageTitle: string
): Promise<jest.CustomMatcherResult> {
  return testStartsWith(
    pageTitle,
    await root
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
  root: ElementHandle,
  expectedPage: string
): jest.CustomMatcherResult {
  return testIsEqual(
    testingServerUrl + expectedPage,
    root
      .executionContext()
      //@ts-ignore
      .frame()!
      .url(),
    'URL',
    this.expand
  )
}

export async function toHaveCollapsable(
  this: jest.MatcherUtils,
  root: ElementHandle,
  collapsedContent: string,
  toggleText: string
): Promise<jest.CustomMatcherResult> {
  if (this.isNot) {
    await expect(root).not.toMatchElement('*', { text: collapsedContent })
    await expect(root).not.toMatchElement('*', { text: toggleText })

    return {
      pass: true,
      message: () => `Collapsable with toggle ${toggleText} should not exist`
    }
  }

  const element = await getByText(root, collapsedContent)
  const elementVisibleBeforeClick = await isVisible(element)
  expect(elementVisibleBeforeClick).toBe(false)

  await getByText(root, toggleText).then(click)
  const elementVisibleAfterClick = await isVisible(element)
  expect(elementVisibleAfterClick).toBe(true)

  return {
    pass: true,
    message: () =>
      `Collapsable with toggle ${toggleText} should toggle visibility.`
  }
}

export async function toHaveSystemNotification(
  this: jest.MatcherUtils,
  root: ElementHandle,
  notification: string
): Promise<jest.CustomMatcherResult> {
  const jestExpect = this.isNot ? expect(root).not : expect(root)
  await jestExpect.toMatchElement('.flasher p', { text: notification })

  return {
    pass: true,
    message: () => `System notifications should not show ${notification}`
  }
}

function testStartsWith(
  expected: string,
  current: string,
  label: string,
  expand: boolean
): jest.CustomMatcherResult {
  return testIsEqual(
    current.substring(0, expected.length),
    expected,
    'prefix of ' + label,
    expand
  )
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
