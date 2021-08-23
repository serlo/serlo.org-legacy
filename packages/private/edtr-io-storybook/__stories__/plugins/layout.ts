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
import { license } from '../fixtures'
import { addPluginStory } from '../helpers'

addPluginStory({
  name: 'Layout/Image on right',
  initialState: {
    id: 1337,
    license,
    changes: '',
    title: 'Layout Tests',
    content: JSON.stringify({
      plugin: 'layout',
      state: [
        {
          width: 6,
          child: {
            plugin: 'rows',
            state: [
              {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      {
                        text:
                          'Dies ist der Text des künftigen Multimedia-Plugins',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          width: 6,
          child: {
            plugin: 'rows',
            state: [
              {
                plugin: 'image',
                state: {
                  src:
                    'https://raw.githubusercontent.com/edtr-io/edtr-io/main/README_files/edtrio_full.svg?sanitize=true',
                  alt: 'Edtr.io Logo',
                },
              },
            ],
          },
        },
      ],
    }),
    reasoning: '',
    meta_title: '',
    meta_description: '',
  },
})

addPluginStory({
  name: 'Layout/Image on left',
  initialState: {
    id: 1337,
    license,
    changes: '',
    title: 'Layout Tests',
    content: JSON.stringify({
      plugin: 'layout',
      state: [
        {
          width: 6,
          child: {
            plugin: 'rows',
            state: [
              {
                plugin: 'image',
                state: {
                  src:
                    'https://raw.githubusercontent.com/edtr-io/edtr-io/main/README_files/edtrio_full.svg?sanitize=true',
                  alt: 'Edtr.io Logo',
                },
              },
            ],
          },
        },
        {
          width: 6,
          child: {
            plugin: 'rows',
            state: [
              {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      {
                        text:
                          'Dies ist der Text des künftigen Multimedia-Plugins',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    reasoning: '',
    meta_title: '',
    meta_description: '',
  },
})
