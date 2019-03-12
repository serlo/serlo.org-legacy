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
/* eslint-env jest */
import { expect, expectSlate } from './common'
import split from '../src/split'

import { Plugin } from '@serlo/editor-plugins-registry'

const cases = [
  {
    description: 'Simple Layout no split',
    input: {
      cells: [
        {
          rows: [
            {
              cells: [{ size: 12, raw: 'Lorem ipsum' }]
            },
            {
              cells: [{ size: 12, raw: 'dolor adipiscing amet' }]
            }
          ]
        }
      ]
    },
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
                      cells: [expectSlate('Lorem ipsum')]
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
                      cells: [expectSlate('dolor adipiscing amet')]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    description: 'Layout with block element',
    input: {
      cells: [
        {
          rows: [
            {
              cells: [{ size: 12, raw: 'Lorem \n![image](url)\n ipsum' }]
            }
          ]
        }
      ]
    },
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
                      cells: [expectSlate('Lorem')]
                    },
                    {
                      cells: [
                        {
                          content: {
                            plugin: {
                              name: Plugin.Image,
                              version: '0.0.0'
                            },
                            state: {
                              description: 'image',
                              src: 'url'
                            }
                          }
                        }
                      ]
                    },
                    {
                      cells: [expectSlate('ipsum')]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    description: 'Layout with injection',
    input: {
      cells: [
        {
          rows: [
            {
              cells: [{ size: 12, raw: 'Lorem \n>[alttext](url)\n ipsum' }]
            }
          ]
        }
      ]
    },
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
                      cells: [expectSlate('Lorem')]
                    },
                    {
                      cells: [
                        {
                          content: {
                            plugin: {
                              name: Plugin.Injection,
                              version: '0.0.0'
                            },
                            state: {
                              description: 'alttext',
                              src: 'url'
                            }
                          }
                        }
                      ]
                    },
                    {
                      cells: [expectSlate('ipsum')]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    description: 'Layout with spoiler',
    input: {
      cells: [
        {
          rows: [
            {
              cells: [
                {
                  size: 12,
                  raw: 'Lorem \n/// title\nmarkdowntext\n///\n ipsum'
                }
              ]
            }
          ]
        }
      ]
    },
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
                      cells: [expectSlate('Lorem')]
                    },
                    {
                      cells: [
                        {
                          content: {
                            plugin: {
                              name: Plugin.Spoiler,
                              version: '0.0.0'
                            },
                            state: {
                              title: 'title',
                              content: {
                                type: '@splish-me/editor-core/editable',
                                state: {
                                  cells: [
                                    {
                                      rows: [
                                        {
                                          cells: [expectSlate('markdowntext')]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              }
                            }
                          }
                        }
                      ]
                    },
                    {
                      cells: [expectSlate('ipsum')]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    description: 'Layout with image in spoiler',
    input: {
      cells: [
        {
          rows: [
            {
              cells: [
                {
                  size: 12,
                  raw: '/// title\nmarkdowntext with image ![image](url)\n///'
                }
              ]
            }
          ]
        }
      ]
    },
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
                        {
                          content: {
                            plugin: {
                              name: Plugin.Spoiler,
                              version: '0.0.0'
                            },
                            state: {
                              title: 'title',
                              content: {
                                type: '@splish-me/editor-core/editable',
                                state: {
                                  cells: [
                                    {
                                      rows: [
                                        {
                                          cells: [
                                            expectSlate(
                                              'markdowntext with image'
                                            )
                                          ]
                                        },
                                        {
                                          cells: [
                                            {
                                              content: {
                                                plugin: {
                                                  name: Plugin.Image,
                                                  version: '0.0.0'
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
                              }
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
  },
  {
    description: 'Layout with geogebra injection',
    input: {
      cells: [
        {
          rows: [
            {
              cells: [{ size: 12, raw: 'Lorem \n>[alttext](ggt/url)\n ipsum' }]
            }
          ]
        }
      ]
    },
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
                      cells: [expectSlate('Lorem')]
                    },
                    {
                      cells: [
                        {
                          content: {
                            plugin: {
                              name: Plugin.Geogebra,
                              version: '0.0.0'
                            },
                            state: {
                              description: 'alttext',
                              src: 'url'
                            }
                          }
                        }
                      ]
                    },
                    {
                      cells: [expectSlate('ipsum')]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    description: 'Layout with linked block element',
    input: {
      cells: [
        {
          rows: [
            {
              cells: [
                {
                  size: 12,
                  raw: 'Lorem \n[![image](imageurl)](linkurl)\n ipsum'
                }
              ]
            }
          ]
        }
      ]
    },
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
                      cells: [expectSlate('Lorem')]
                    },
                    {
                      cells: [
                        {
                          content: {
                            plugin: {
                              name: Plugin.Image,
                              version: '0.0.0'
                            },
                            state: {
                              description: 'image',
                              src: 'imageurl',
                              href: 'linkurl'
                            }
                          }
                        }
                      ]
                    },
                    {
                      cells: [expectSlate('ipsum')]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    description: 'Empty columns layout',
    input: {
      cells: [
        {
          rows: [
            {
              cells: [
                { size: 3, raw: 'Lorem ipsum' },
                { size: 3, raw: 'dolor adipiscing amet' },
                { size: 3, raw: '' },
                { size: 3, raw: '' }
              ]
            }
          ]
        }
      ]
    },
    output: {
      cells: [
        {
          rows: [
            {
              cells: [
                {
                  size: 3,
                  rows: [
                    {
                      cells: [expectSlate('Lorem ipsum')]
                    }
                  ]
                },
                {
                  size: 3,
                  rows: [
                    {
                      cells: [expectSlate('dolor adipiscing amet')]
                    }
                  ]
                },
                {
                  size: 3,
                  rows: [
                    {
                      cells: [expectSlate('')]
                    }
                  ]
                },
                {
                  size: 3,
                  rows: [
                    {
                      cells: [expectSlate('')]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    description: 'Blockquote',
    input: {
      cells: [
        {
          rows: [
            {
              cells: [
                {
                  size: 12,
                  // raw: 'Ausgehend von der Normalparabelkann man jede beliebige Parabel konstruieren.Dazu benutzt man die  [Scheitelform](/2073): \n\n>%%f\\left(x\\right)=a(x-d)^2+e%%'
                  raw: 'Lorem \n> ipsum\n> dolor\n\n>sit amet\n\nconsectetur'
                }
              ]
            }
          ]
        }
      ]
    },
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
                      cells: [expectSlate('Lorem')]
                    },
                    {
                      cells: [
                        {
                          content: {
                            plugin: {
                              name: Plugin.Blockquote,
                              version: '0.0.0'
                            },
                            state: {
                              child: {
                                type: '@splish-me/editor-core/editable',
                                state: {
                                  cells: [
                                    {
                                      rows: [
                                        {
                                          cells: [
                                            expectSlate(
                                              '<p>ipsum dolor</p><p>sit amet</p>'
                                            )
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              }
                            }
                          }
                        }
                      ]
                    },
                    {
                      cells: [expectSlate('consectetur')]
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
      expect(split(testcase.input), 'to equal', testcase.output)
    })
  })
})
