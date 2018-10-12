import { expect, expectSlate } from './common'
import markdownToSlate from '../src/markdownToSlate'

const cases = [
  {
    description: 'Transform markdown header to slate plugin',
    input: '# header',
    output: expectSlate('<h1 id="header">header</h1>')
  },
  {
    description: 'Transform bold paragraph to slate plugin',
    input: '**bold text**',
    output: expectSlate('<p><strong>bold text</strong></p>')
  }
]

cases.forEach(testcase => {
  describe('Transformes Serlo Layout to new Layout', () => {
    it(testcase.description, () => {
      expect(markdownToSlate(testcase.input), 'to equal', testcase.output)
    })
  })
})
