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
import {
  click,
  clickForNewPage,
  getByRole,
  getByText,
  getAllByText,
  typeIntoEditor,
  goto,
  login,
  randomText,
  isVisible,
  saveRevision,
  addContent,
  openDropdownMenu,
} from '../_utils'

import {
  exampleApiParameters,
  pages,
  viewports,
  notifications,
  elements,
} from '../_config'

describe('view exercises', () => {
  const data = {
    exercise: {
      id: '35573',
      content: 'Example test exercise',
      solutionContent: 'Example solution',
    },
    exerciseGroup: {
      id: '35580',
      content: 'Example group exercise',
    },
    groupedExercises: [
      {
        id: '35581',
        content: 'Subexercise 1',
        solutionContent: 'Solution subexercise 1',
      },
      {
        id: '35584',
        content: 'Subexercise 2',
        solutionContent: 'Solution subexercise 2',
      },
      {
        id: '35586',
        content: 'Subexercise 3',
        solutionContent: 'Solution subexercise 3',
      },
    ],
  }

  beforeEach(async () => {
    await page.setViewport(viewports.desktop)
  })

  describe('view text exercise', () => {
    const path = `/math/example-content/example-topic-1/example-topic-folder/${data.exercise.id}`

    test('text exercise with solution', async () => {
      const page = await goto(path)
      await expect(page).not.toMatchElement('h1')
      await expect(page).toMatchElement('*', { text: data.exercise.content })

      await expect(page).toHaveCollapsable(
        data.exercise.solutionContent,
        'Show solution'
      )
    })

    describe('text exercise has no heading on content-api requests', () => {
      test.each(exampleApiParameters)(
        'parameter %p is set',
        async (contentApiParam) => {
          const page = await goto(`${path}?${contentApiParam}`)
          await expect(page).not.toMatchElement('h1')
        }
      )
    })
  })

  describe('view text exercise group', () => {
    const path = `/math/example-content/example-topic-1/example-topic-folder/${data.exerciseGroup.id}`

    test('text exercise group with subexercises', async () => {
      const page = await goto(path)
      await expect(page).not.toMatchElement('h1')
      await expect(page).toMatchElement('*', {
        text: data.exerciseGroup.content,
      })
      for (const groupedExercise of data.groupedExercises) {
        await expect(page).toMatchElement('*', {
          text: groupedExercise.content,
        })
      }

      const solutionHandles = await getAllByText(page, 'Show solution')
      for (const solutionHandle of solutionHandles) {
        await click(solutionHandle)
      }
      for (const groupedExercise of data.groupedExercises) {
        const solution = await getByText(page, groupedExercise.solutionContent)
        const solutionVisible = await isVisible(solution)
        expect(solutionVisible).toBe(true)
      }
    })

    describe('text exercise group has no heading on content-api requests', () => {
      test.each(exampleApiParameters)(
        'parameter %p is set',
        async (contentApiParam) => {
          const page = await goto(`${path}?${contentApiParam}`)
          await expect(page).not.toMatchElement('h1')
        }
      )
    })
  })

  describe('view grouped text exercise', () => {
    const { id, content, solutionContent } = data.groupedExercises[0]
    const path = `/math/example-content/example-topic-1/example-topic-folder/${data.exerciseGroup.id}/${id}`

    test('grouped exercise with solution', async () => {
      const page = await goto(path)
      await expect(page).toMatchElement('*', { text: content })

      await expect(page).toHaveCollapsable(solutionContent, 'Show solution')
    })

    test('grouped exercise has page header with backlink', async () => {
      const page = await goto(path)
      await expect(page).toMatchElement('h1', { text: id })
      await expect(page).not.toMatchElement('*', {
        text: data.exerciseGroup.content,
      })

      const exerciseGroup = await elements
        .getBackLink(page)
        .then(clickForNewPage)
      await expect(exerciseGroup).toMatchElement('*', {
        text: data.exerciseGroup.content,
      })
    })

    describe('grouped exercise has no heading on content-api requests', () => {
      test.each(exampleApiParameters)(
        'parameter %p is set',
        async (contentApiParam) => {
          const page = await goto(`${path}?${contentApiParam}`)
          await expect(page).not.toMatchElement('h1', { text: id })
        }
      )
    })
  })
})

describe('create text-exercise', () => {
  test.each(['admin', 'english_langhelper'])('user is %p', async (user) => {
    const exercise = randomText('exercise content')
    const solution = randomText('solution')

    await login(user)
    const topic = await goto(pages.e2eTopic.path)
    const createPage = await openDropdownMenu(topic).then(
      addContent('text-exercise')
    )

    await getByRole(createPage, 'textbox').then((e) => e.type(exercise))

    await getByText(createPage, 'Create solution').then(click)
    await typeIntoEditor(createPage, 2, solution)

    const success = await saveRevision(createPage)

    expect(success).toMatchElement('p', {
      text: 'Your revision has been saved and is available',
    })

    await expect(success).toHaveTitle('Math text-exercise')
    await expect(success).toMatchElement('*', { text: exercise })

    await expect(success).toHaveCollapsable(solution, 'Show solution')
  })
})

describe('create grouped text-exercise', () => {
  test.each(['admin', 'english_langhelper'])('user is %p', async (user) => {
    const exercise = randomText('exercise content')
    const subexercise1 = randomText('subexercise1')
    const subexercise2 = randomText('subexercise2')
    const solution1 = randomText('solution1')

    await login(user)
    const topic = await goto(pages.e2eTopic.path)
    const createPage = await openDropdownMenu(topic).then(
      addContent('text-exercise-group')
    )

    await getByRole(createPage, 'textbox').then((e) => e.type(exercise))

    await getByText(createPage, 'Add exercise').then(click)
    await typeIntoEditor(createPage, 1, subexercise1)

    await getByText(createPage, 'Create solution').then(click)
    await typeIntoEditor(createPage, 4, solution1)

    await getByText(createPage, 'Add exercise').then(click)
    await typeIntoEditor(createPage, 5, subexercise2)

    const success = await saveRevision(createPage)
    await expect(success).toHaveSystemNotification(
      notifications.savedAndCheckedOut
    )

    const result = await elements.getBackLink(success).then(clickForNewPage)
    await expect(result).toHaveTitle('Math text-exercise-group')

    await expect(result).toMatchElement('*', { text: exercise })
    await expect(result).toMatchElement('*', { text: subexercise1 })
    await expect(result).toMatchElement('*', { text: subexercise2 })
    await expect(result).toMatchElement('*', { text: solution1 })
  })
})
