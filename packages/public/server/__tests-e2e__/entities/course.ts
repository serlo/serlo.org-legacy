import {
  click,
  clickForNewPage,
  getByLabelText,
  getByPlaceholderText,
  getBySelector,
  getByText,
  getByRole,
  goto,
  login,
  logout,
  randomText
} from '../_utils'
import { navigation, pages, viewports } from '../_config'

describe('create/update course', () => {
  afterEach(async () => {
    await logout()
  })

  test('create course with course page', async () => {
    await page.setViewport(viewports.desktop)
    const user = 'admin'

    const title = randomText('course')
    const coursePageTitle = randomText('course-page')
    const coursePageContent = randomText()

    await login(user)
    const topic = await goto(pages.e2eTopic.path)

    await getBySelector(topic, navigation.dropdownToggle).then(click)
    await page.waitForSelector('#subject-nav-wrapper .dropdown-menu')
    await getByText(topic, navigation.addContent).then(e => e.hover())
    const createPage = await getByText(topic, 'course').then(clickForNewPage)

    await getByPlaceholderText(createPage, 'Titel').then(e => e.type(title))

    await getByText(createPage, 'Kursseite hinzufügen').then(click)

    const coursePage = await getBySelector(
      createPage,
      '#editor article article'
    )
    await getByPlaceholderText(coursePage, 'Titel').then(e =>
      e.type(coursePageTitle)
    )

    const coursePageContentField = await getByRole(coursePage, 'textbox')
    await coursePageContentField.click()
    await coursePageContentField.type(coursePageContent)

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

    await expect(success).toMatchElement('h1', { text: coursePageTitle })
    await expect(success).toMatchElement('*', { text: coursePageContent })
    await expect(success).toHaveTitle(`${title} | ${coursePageTitle} (course)`)
  })
})
