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
  click,
  clickForNewPage,
  getByItemType,
  getByLabelText,
  getByText,
  goto,
  getBySelector,
  login,
  logout,
  randomText,
  getByPlaceholderText
} from '../_utils'
import { pages, navigation, viewports } from '../_config'

const appletItemType = 'http://schema.org/VideoObject'

describe('view applet page', () => {
  const appletPath = '/35569'
  const appletTitle = 'Example applet'
  const appletDescription = 'This is an example applet.'
  const geogebraUrl = 'https://www.geogebra.org/material/iframe/id/kWgUBF2y'

  test('view example applet page', async () => {
    const appletPage = await goto(appletPath)
    const applet = await getByItemType(appletPage, appletItemType)

    await expect(applet).toMatchElement('h1', { text: appletTitle })
    await expect(applet).toMatchElement('*', { text: appletDescription })
    await expect(applet).toHaveTitle(`${appletTitle} (applet)`)

    const iframe = await getBySelector(applet, 'iframe')
    await expect(iframe).toHaveAttribute('src', geogebraUrl)
  })
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

    await getBySelector(topic, navigation.dropdownToggle).then(click)
    await page.waitForSelector('#subject-nav-wrapper .dropdown-menu')
    await getByText(topic, navigation.addContent).then(e => e.hover())
    const createPage = await getByText(topic, 'applet').then(clickForNewPage)

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

    await getBySelector(createPage, navigation.saveButton).then(click)
    await getByLabelText(createPage, 'Änderungen').then(e =>
      e.type(randomText())
    )
    await createPage.$$('input[type=checkbox]').then(c => c[0].click())
    await createPage.$$('input[type=checkbox]').then(c => c[3].click())

    const success = await getByText(createPage, 'Speichern', {
      selector: 'button'
    }).then(clickForNewPage)

    expect(success).toMatchElement('p', {
      text: 'Your revision has been saved and is available'
    })

    await expect(success).toMatchElement('h1', { text: title })
    await expect(success).toMatchElement('*', { text: description })
    await expect(success).toHaveTitle(`${title} (applet)`)

    const iframe = await getBySelector(success, 'iframe')
    const embedUrl = `https://www.geogebra.org/material/iframe/id/${appletId}`
    await expect(iframe).toHaveAttribute('src', embedUrl)
  })
})
