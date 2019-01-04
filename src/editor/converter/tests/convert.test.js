/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2019 Serlo Education e.V.
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
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
import { expect, expectSlate } from './common'
import convert from '../index'
import image from '@splish-me/editor-plugin-image'
import { slatePlugin } from '@serlo-org/editor-plugins/lib/slate'

const cases = [
  {
    description: 'Convert chains methods together correctly',
    input: [
      [
        {
          col: 24,
          content: '## Lorem ipsum'
        }
      ],
      [
        {
          col: 16,
          content: 'dolor **sit** amet.'
        },
        {
          col: 8,
          content: 'consecetur'
        }
      ],
      [
        {
          col: 24,
          content: 'markdown with ![image](url)'
        }
      ]
    ],
    output: {
      cells: [
        {
          rows: [
            {
              cells: [
                {
                  size: 12,
                  rows: [
                    {
                      cells: [
                        expectSlate('<h2 id="loremipsum">Lorem ipsum</h2>')
                      ]
                    }
                  ]
                }
              ]
            },
            {
              cells: [
                {
                  size: 8,
                  rows: [
                    {
                      cells: [
                        expectSlate('<p>dolor <strong>sit</strong> amet.</p>')
                      ]
                    }
                  ]
                },
                {
                  size: 4,
                  rows: [
                    {
                      cells: [expectSlate('<p>consecetur</p>')]
                    }
                  ]
                }
              ]
            },
            {
              cells: [
                {
                  size: 12,
                  rows: [
                    {
                      cells: [expectSlate('<p>markdown with</p>')]
                    },
                    {
                      cells: [
                        {
                          content: {
                            plugin: {
                              name: image.name,
                              version: image.version
                            },
                            state: {
                              description: 'image',
                              src: 'url'
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
]

cases.forEach(testcase => {
  describe('Transformes Serlo Layout to new Layout', () => {
    it(testcase.description, () => {
      expect(convert(testcase.input), 'to equal', testcase.output)
    })
  })
})
