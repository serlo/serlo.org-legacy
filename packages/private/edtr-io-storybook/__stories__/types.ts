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
import { license } from './fixtures'
import { addContentTypeStories } from './helpers'

addContentTypeStories('Applet', 'applet', {
  id: 1337,
  license,
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
  license,
  changes: '',
  title: 'Title',
  content: '',
  reasoning: '',
  meta_title: '',
  meta_description: ''
})

addContentTypeStories('Course', 'course', {
  id: 1337,
  license,
  changes: '',
  title: 'Title',
  reasoning: '',
  meta_description: '',
  'course-page': [
    {
      id: 1338,
      license,
      changes: '',
      title: 'Page 1',
      icon: 'explanation',
      content: ''
    },
    {
      id: 1339,
      license,
      changes: '',
      title: 'Page 2',
      icon: 'explanation',
      content: ''
    }
  ]
})

addContentTypeStories('Course Page', 'course-page', {
  id: 1337,
  license,
  changes: '',
  title: 'Title',
  icon: 'explanation',
  content: ''
})

addContentTypeStories('Event', 'event', {
  id: 1337,
  license,
  changes: '',
  title: 'Title',
  content: '',
  meta_title: '',
  meta_description: ''
})

addContentTypeStories('Math Puzzle', 'math-puzzle', {
  id: 1337,
  license,
  changes: '',
  content: '',
  source: ''
})

addContentTypeStories('Page', 'page', {
  id: 1337,
  license,
  title: 'Title',
  content: ''
})

addContentTypeStories('Text Exercise', 'text-exercise', [
  {
    name: 'default',
    state: {
      id: 1337,
      license,
      changes: '',
      content: ''
    }
  },
  {
    name: 'w/ solution',
    state: {
      id: 1337,
      license,
      changes: '',
      content: '',
      'text-solution': {
        id: 1338,
        license,
        content: ''
      }
    }
  },
  {
    name: 'w/ solution and hint',
    state: {
      id: 1337,
      license,
      changes: '',
      content: '',
      'text-hint': {
        id: 1338,
        license,
        changes: '',
        content: ''
      },
      'text-solution': {
        id: 1339,
        license,
        changes: '',
        content: ''
      }
    }
  }
])

addContentTypeStories('Text Exercise Group/simple', 'text-exercise-group', {
  id: 1337,
  license,
  changes: '',
  content: '',
  'grouped-text-exercise': [
    {
      id: 1338,
      license,
      changes: '',
      content: ''
    },
    {
      id: 1339,
      license,
      changes: '',
      content: '',
      'text-solution': {
        id: 1340,
        license,
        changes: '',
        content: ''
      }
    },
    {
      id: 1341,
      license,
      changes: '',
      content: '',
      'text-hint': {
        id: 1342,
        license,
        changes: '',
        content: ''
      },
      'text-solution': {
        id: 1343,
        license,
        changes: '',
        content: ''
      }
    }
  ]
})

addContentTypeStories('Text Exercise Group/empty', 'text-exercise-group', {
  id: 1337,
  license,
  changes: '',
  content: '',
  'grouped-text-exercise': []
})

addContentTypeStories('User', 'user', {
  id: 1337,
  description: ''
})

addContentTypeStories('Video', 'video', {
  id: 1337,
  license,
  title: 'Title',
  description: '',
  content: 'https://www.youtube.com/watch?v=cIzM2XBduuY'
})
