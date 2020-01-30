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
  randomText,
  getByItemType, saveRevision
} from '../_utils'
import { navigation, pages, viewports } from '../_config'

const courseItemType = 'http://schema.org/Article'

test('view course', async () => {
  const path = '/math/example-content/example-topic-1/example-course'
  const title = 'Example Course | Example Course Page 1'
  const heading = 'Example Course Page 1'
  const content = 'This is example course Page 1'
  const page2Title = 'Example Course Page 2'

  const coursePage = await goto(path)
  await expect(coursePage).toHaveTitle(title)

  const course = await getByItemType(coursePage, courseItemType)
  await expect(course).toMatchElement('h1', { text: heading })

  await expect(course).toMatchElement('*', { text: content })
  await expect(course).toMatchElement('a', { text: page2Title })
})

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

    const success = await saveRevision(createPage)

    expect(success).toMatchElement('p', {
      text: 'Your revision has been saved and is available'
    })

    await expect(success).toMatchElement('h1', { text: coursePageTitle })
    await expect(success).toMatchElement('*', { text: coursePageContent })
    await expect(success).toHaveTitle(`${title} | ${coursePageTitle} (course)`)
  })
})
