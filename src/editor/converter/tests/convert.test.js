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
