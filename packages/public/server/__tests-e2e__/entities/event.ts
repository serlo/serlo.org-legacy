/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import * as assert from 'assert'
import { getDocument, queries } from 'pptr-testing-library'
import { Browser, launch, Page, ElementHandle } from 'puppeteer'
import * as R from 'ramda'

function getBySelector(
  element: ElementHandle,
  selector: string
): Promise<ElementHandle> {
  return element.$$(selector).then(queryResults => {
    assert.ok(queryResults.length > 0, `No element for ${selector} found`)
    assert.ok(
      queryResults.length < 2,
      `More than one element for ${selector} found`
    )

    return queryResults[0]
  })
}

function getInnerHTML(element: ElementHandle): Promise<string> {
  return element.evaluate(e => e.innerHTML)
}

describe('events', () => {
  let browser: Browser
  let page: Page

  const eventUrl = 'http://de.serlo.localhost:4567/35554'

  beforeAll(async () => {
    browser = await launch()
  })

  beforeEach(async () => {
    page = await browser.newPage()
  })

  afterEach(async () => {
    await page.close()
  })

  afterAll(async () => {
    await browser.close()
  })

  test('view page of an event', async () => {
    await page.goto(eventUrl)

    const doc = await getDocument(page)
    const eventSelector = '[itemtype="http://schema.org/Event"]'
    const event = await getBySelector(doc, eventSelector)

    await queries.getByText(event, 'Beispielveranstaltung', {
      selector: 'h1[itemprop="name"]'
    })

    const descriptionSelector = 'article[itemprop=description] p'
    expect(
      await getBySelector(event, descriptionSelector).then(getInnerHTML)
    ).toBe('<strong>Jeden Donnerstag:</strong> Redaktionssitzung in Münster')
  })
})
