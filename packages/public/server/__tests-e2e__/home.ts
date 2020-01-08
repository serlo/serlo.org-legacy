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

describe('Home', () => {
  test('de.serlo.localhost has the correct document title', async () => {
    await page.goto('http://de.serlo.localhost:4567/')

    expect(await page.title()).toEqual('Serlo – Die freie Lernplattform')
  })

  test('en.serlo.localhost has the correct document title', async () => {
    await page.goto('http://en.serlo.localhost:4567/')

    expect(await page.title()).toEqual('Serlo – The Open Learning Platform')
  })

  test('es.serlo.localhost has the correct document title', async () => {
    await page.goto('http://es.serlo.localhost:4567/')

    expect(await page.title()).toEqual(
      'Serlo – La Plataforma para el Aprendizaje Abierto'
    )
  })

  test('hi.serlo.localhost has the correct document title', async () => {
    await page.goto('http://hi.serlo.localhost:4567/')

    expect(await page.title()).toEqual('सेर्लो – ओपन लर्निंग प्लेटफॉर्म')
  })
})
