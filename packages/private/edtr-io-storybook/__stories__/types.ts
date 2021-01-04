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
import { license } from './fixtures'
import { addContentTypeStory } from './helpers'

addContentTypeStory({
  name: 'Applet',
  type: 'applet',
  initialState: {
    id: 1337,
    license,
    changes: '',
    title: 'Title',
    url: '',
    content: '',
    reasoning: '',
    meta_title: '',
    meta_description: '',
  },
})

addContentTypeStory({
  name: 'Article',
  type: 'article',
  initialState: {
    id: 1337,
    license,
    changes: '',
    title: 'Title',
    content: '',
    reasoning: '',
    meta_title: '',
    meta_description: '',
  },
})

addContentTypeStory({
  name: 'Course',
  type: 'course',
  initialState: {
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
        content: '',
      },
      {
        id: 1339,
        license,
        changes: '',
        title: 'Page 2',
        icon: 'explanation',
        content: '',
      },
    ],
  },
})

addContentTypeStory({
  name: 'Course Page',
  type: 'course-page',
  initialState: {
    id: 1337,
    license,
    changes: '',
    title: 'Title',
    icon: 'explanation',
    content: '',
  },
})

addContentTypeStory({
  name: 'Event',
  type: 'event',
  initialState: {
    id: 1337,
    license,
    changes: '',
    title: 'Title',
    content: '',
    meta_title: '',
    meta_description: '',
  },
})

addContentTypeStory({
  name: 'Math Puzzle',
  type: 'math-puzzle',
  initialState: {
    id: 1337,
    license,
    changes: '',
    content: '',
    source: '',
  },
})

addContentTypeStory({
  name: 'Page',
  type: 'page',
  initialState: {
    id: 1337,
    license,
    title: 'Title',
    content: '',
  },
})

addContentTypeStory({
  name: 'Text Exercise',
  type: 'text-exercise',
  initialState: [
    {
      name: 'default',
      state: {
        id: 1337,
        license,
        changes: '',
        content: '{"plugin":"exercise"}',
      },
    },
    {
      name: 'w/ solution',
      state: {
        id: 1337,
        license,
        changes: '',
        content: '{"plugin":"exercise"}',
        'text-solution': {
          id: 1338,
          license,
          content: '{"plugin":"solution"}',
        },
      },
    },
  ],
})

addContentTypeStory({
  name: 'Text Exercise Group',
  type: 'text-exercise-group',
  initialState: {
    id: 1337,
    license,
    changes: '',
    content: '',
    'grouped-text-exercise': [
      {
        id: 1338,
        license,
        changes: '',
        content: '{"plugin":"exercise"}',
      },
      {
        id: 1339,
        license,
        changes: '',
        content: '{"plugin":"exercise"}',
        'text-solution': {
          id: 1340,
          license,
          changes: '',
          content: '{"plugin":"solution"}',
        },
      },
      {
        id: 1341,
        license,
        changes: '',
        content: '{"plugin":"exercise"}',
        'text-solution': {
          id: 1343,
          license,
          changes: '',
          content: '{"plugin":"solution"}',
        },
      },
    ],
  },
})

addContentTypeStory({
  name: 'User',
  type: 'user',
  initialState: {
    id: 1337,
    description: '',
  },
})

addContentTypeStory({
  name: 'Video',
  type: 'video',
  initialState: {
    id: 1337,
    license,
    title: 'Title',
    description: '',
    content: 'https://www.youtube.com/watch?v=cIzM2XBduuY',
  },
})

addContentTypeStory({
  name: 'Taxonomy',
  type: 'taxonomy',
  initialState: {
    id: 1337,
    term: {
      name: 'Term name',
    },
    taxonomy: 1,
    parent: 2,
    position: 3,
    description: '',
  },
})
