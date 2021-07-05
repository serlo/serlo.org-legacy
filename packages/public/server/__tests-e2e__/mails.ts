/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { getDocument, queries } from 'pptr-testing-library'
import fetch from 'node-fetch'

test('Reset password mail renders correctly', async () => {
  const username = 'admin'
  const email = 'admin@localhost'

  await fetch('http://de.serlo.localhost:4567/mails/clear')
  const mailPage = await browser.newPage()
  await mailPage.goto('http://de.serlo.localhost:4567/auth/password/restore')
  const $document = await getDocument(mailPage)
  // FIXME: should work but doesn't. We aren't using the "for" attribute correctly
  // const $email = await queries.getByLabelText($document, 'E-Mail-Adresse:')
  // await $email.type(email)
  await mailPage.evaluate((email) => {
    const $email = document.getElementsByName('email')[0] as HTMLInputElement
    $email.value = email
  }, email)
  const $submit = await queries.getByText($document, 'Wiederherstellen')
  await Promise.all([mailPage.waitForNavigation(), $submit.click()])
  const data = await fetch(
    'http://de.serlo.localhost:4567/mails/list'
  ).then((response) => response.json())
  expect(data.flushed).toHaveLength(1)
  const { to, mail } = data.flushed[0] as {
    to: string
    mail: { body: string; plain: string }
  }
  expect(to).toEqual(email)
  expect(mail.body).toMatch('<')
  expect(mail.body).not.toMatch('&lt')
  expect(mail.body).toMatch(username)
  expect(mail.body).toMatch(
    /<a href="http:\/\/de\.serlo\.(.*?)\/auth\/password\/restore\/(\w*?)">/
  )
  expect(mail.plain).not.toMatch('<')
  expect(mail.plain).not.toMatch('&lt')
  expect(mail.plain).toMatch(username)
  expect(mail.plain).toMatch(
    /http:\/\/de\.serlo\.(.*?)\/auth\/password\/restore\/(\w*?)/
  )
  await mailPage.close()
})
