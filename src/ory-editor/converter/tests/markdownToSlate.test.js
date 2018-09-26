import unexpected from 'unexpected'
import markdownToSlate from '../src/markdownToSlate'
import image from '@splish-me/editor-plugin-image'
import spoiler from '@serlo-org/editor-plugin-spoiler'
import { slatePlugin } from '@serlo-org/editor-plugins/lib/slate'

const expect = unexpected.clone()

const cases = [
  {
    description: 'Transform multiple cells to slate',
    input: {
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
                          layout: {
                            plugin: {
                              name: spoiler.name,
                              version: spoiler.version
                            },
                            state: {
                              title: 'title'
                            }
                          },
                          rows: [
                            {
                              cells: [
                                {
                                  markdown: '# header'
                                }
                              ]
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
                                      alt: 'image',
                                      src: 'url'
                                    }
                                  }
                                }
                              ]
                            },
                            {
                              cells: [
                                {
                                  markdown: '**bold text**'
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
                          layout: {
                            plugin: {
                              name: spoiler.name,
                              version: spoiler.version
                            },
                            state: {
                              title: 'title'
                            }
                          },
                          rows: [
                            {
                              cells: [
                                {
                                  content: {
                                    plugin: {
                                      name: slatePlugin.name,
                                      version: slatePlugin.version
                                    },
                                    state: slatePlugin.serialize(
                                      slatePlugin.unserialize({
                                        importFromHtml:
                                          '<h1 id="header">header</h1>'
                                      })
                                    )
                                  }
                                }
                              ]
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
                                      alt: 'image',
                                      src: 'url'
                                    }
                                  }
                                }
                              ]
                            },
                            {
                              cells: [
                                {
                                  content: {
                                    plugin: {
                                      name: slatePlugin.name,
                                      version: slatePlugin.version
                                    },
                                    state: slatePlugin.serialize(
                                      slatePlugin.unserialize({
                                        importFromHtml:
                                          '<p><strong>bold text</strong></p>'
                                      })
                                    )
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
          ]
        }
      ]
    }
  }
]

cases.forEach(testcase => {
  describe('Transformes Serlo Layout to new Layout', () => {
    it(testcase.description, () => {
      expect(markdownToSlate(testcase.input), 'to equal', testcase.output)
    })
  })
})
