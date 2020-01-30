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
  getByItemType,
  goto,
  getBySelector,
  login,
  logout,
  randomText,
  getByPlaceholderText,
  saveRevision,
  addContent,
  openDropdownMenu
} from '../_utils'
import { pages, viewports, notifications } from '../_config'

const appletItemType = 'http://schema.org/VideoObject'

test('view example applet page', async () => {
  const appletPath = '/math/example-content/example-topic-1/example-applet'
  const appletTitle = 'Example applet'
  const appletDescription = 'This is an example applet.'
  const geogebraUrl = 'https://www.geogebra.org/material/iframe/id/kWgUBF2y'

  const appletPage = await goto(appletPath)
  const applet = await getByItemType(appletPage, appletItemType)

  await expect(applet).toMatchElement('h1', { text: appletTitle })
  await expect(applet).toMatchElement('*', { text: appletDescription })
  await expect(applet).toHaveTitle(`${appletTitle} (applet)`)

  const iframe = await getBySelector(applet, 'iframe')
  await expect(iframe).toHaveAttribute('src', geogebraUrl)
})

describe('create/update applet pages', () => {
  afterEach(async () => {
    await logout()
  })

  test('create applet page', async () => {
    await page.setViewport(viewports.desktop)
    const user = 'admin'

    const title = randomText('applet')
    const description = randomText()
    const appletId = 'kWgUBF2y'

    await login(user)
    const topic = await goto(pages.e2eTopic.path)
    const createPage = await openDropdownMenu(topic).then(addContent('applet'))

    await getByPlaceholderText(createPage, 'Titel').then(e => e.type(title))

    const appletUrlField = await getBySelector(
      createPage,
      '#editor article > div:nth-child(1) > div > div'
    )
    await appletUrlField.click()
    await appletUrlField.type(`https://www.geogebra.org/m/${appletId}`)

    const descriptionField = await getBySelector(
      createPage,
      '#editor article > div:nth-child(2) > div > div'
    )
    await descriptionField.click()
    await descriptionField.click()
    await descriptionField.type(description)

    const success = await saveRevision(createPage)
    await expect(success).toHaveSystemNotification(
      notifications.savedAndCheckedOut
    )

    await expect(success).toMatchElement('h1', { text: title })
    await expect(success).toMatchElement('*', { text: description })
    await expect(success).toHaveTitle(`${title} (applet)`)

    const iframe = await getBySelector(success, 'iframe')
    const embedUrl = `https://www.geogebra.org/material/iframe/id/${appletId}`
    await expect(iframe).toHaveAttribute('src', embedUrl)
  })
})
