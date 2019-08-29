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
import { OverlayContext } from '@edtr-io/editor-ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { Editor } from '../src/editor'
import { Container, mockSave } from './helpers'

const ccBy = {
  agreement:
    'Mit dem Speichern dieser Seite versicherst du, dass du deinen Beitrag (damit sind auch Änderungen gemeint) selbst verfasst hast bzw. dass er keine fremden Rechte verletzt. Du willigst ein, deinen Beitrag unter der <a href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution/Share-Alike Lizenz 4.0</a> (http://creativecommons.org/licenses/by-sa/4.0/) und/oder unter einer gleichwertigen Lizenz zu veröffentlichen, welche die Gesellschaft für freie Bildung e. V. entsprechend der Regelungen in den <a href="/21654">Nutzungsbedingungen</a> (http://de.serlo.org/21654) festlegen darf. Falls du den Beitrag nicht selbst verfasst hast, muss er unter den <a href="/21654">Nutzungsbedingungen</a> (http://de.serlo.org/21654) verfügbar sein und du stimmst zu, notwendigen Lizenzanforderungen zu folgen.',
  iconHref: 'https://i.creativecommons.org/l/by-sa/4.0/88x31.png',
  id: 1,
  title: 'Dieses Werk steht unter der freien Lizenz cc-by-sa-4.0',
  url: 'https://creativecommons.org/licenses/by-sa/4.0/'
}

addContentTypeStories('Applet', 'applet', {
  id: 1337,
  license: ccBy,
  changes: '',
  title: 'Title',
  url: '',
  content: '',
  reasoning: '',
  meta_title: '',
  meta_description: ''
})

addContentTypeStories('Article', 'article', {
  id: 1337,
  license: ccBy,
  changes: '',
  title: 'Title',
  content: '',
  reasoning: '',
  meta_title: '',
  meta_description: ''
})

addContentTypeStories('Course', 'course', {
  id: 1337,
  license: ccBy,
  changes: '',
  title: 'Title',
  reasoning: '',
  meta_description: '',
  'course-page': [
    {
      id: 1338,
      license: ccBy,
      changes: '',
      title: 'Page 1',
      icon: 'explanation',
      content: ''
    },
    {
      id: 1339,
      license: ccBy,
      changes: '',
      title: 'Page 2',
      icon: 'explanation',
      content: ''
    }
  ]
})

addContentTypeStories('Course Page', 'course-page', {
  id: 1337,
  license: ccBy,
  changes: '',
  title: 'Title',
  icon: 'explanation',
  content: ''
})

addContentTypeStories('Event', 'event', {
  id: 1337,
  license: ccBy,
  changes: '',
  title: 'Title',
  content: '',
  meta_title: '',
  meta_description: ''
})

addContentTypeStories('Math Puzzle', 'math-puzzle', {
  id: 1337,
  license: ccBy,
  changes: '',
  content: '',
  source: ''
})

addContentTypeStories('Page', 'page', {
  id: 1337,
  license: ccBy,
  title: 'Title',
  content: ''
})

addContentTypeStories('Text Exercise', 'text-exercise', [
  {
    name: 'default',
    state: {
      id: 1337,
      license: ccBy,
      changes: '',
      content: ''
    }
  },
  {
    name: 'w/ solution',
    state: {
      id: 1337,
      license: ccBy,
      changes: '',
      content: '',
      'text-solution': {
        id: 1338,
        license: ccBy,
        content: ''
      }
    }
  },
  {
    name: 'w/ solution and hint',
    state: {
      id: 1337,
      license: ccBy,
      changes: '',
      content: '',
      'text-hint': {
        id: 1338,
        license: ccBy,
        changes: '',
        content: ''
      },
      'text-solution': {
        id: 1339,
        license: ccBy,
        changes: '',
        content: ''
      }
    }
  }
])

addContentTypeStories('Text Exercise Group', 'text-exercise-group', {
  id: 1337,
  license: ccBy,
  changes: '',
  content: '',
  'grouped-text-exercise': [
    {
      id: 1338,
      license: ccBy,
      changes: '',
      content: ''
    },
    {
      id: 1339,
      license: ccBy,
      changes: '',
      content: '',
      'text-solution': {
        id: 1340,
        license: ccBy,
        changes: '',
        content: ''
      }
    },
    {
      id: 1341,
      license: ccBy,
      changes: '',
      content: '',
      'text-hint': {
        id: 1342,
        license: ccBy,
        changes: '',
        content: ''
      },
      'text-solution': {
        id: 1343,
        license: ccBy,
        changes: '',
        content: ''
      }
    }
  ]
})

addContentTypeStories('User', 'user', {
  id: 1337,
  description: ''
})

addContentTypeStories('Video', 'video', {
  id: 1337,
  license: ccBy,
  title: 'Title',
  description: '',
  content: 'https://www.youtube.com/watch?v=cIzM2XBduuY'
})

function addContentTypeStories(
  name: string,
  type: string,
  initialState: unknown | { name: string; state: unknown }[]
) {
  const stories = storiesOf(`Content Types/${name}`, module)
  const initialStates = (initialState as {
    name: string
    state: unknown
  }[]).length
    ? (initialState as { name: string; state: unknown }[])
    : [{ name: '', state: initialState }]

  initialStates.forEach(({ name, state }) => {
    stories.add(`${name} Editor`, () => {
      return (
        <Container>
          <Editor type={type} initialState={state} onSave={mockSave} />
        </Container>
      )
    })
  })
}
