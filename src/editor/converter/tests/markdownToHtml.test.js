import { expect } from './common'
import renderMarkdown from '../src/markdownToHtml'

const cases = [
  {
    description: 'Showdown renders markdown as expected',
    input: '# header \n\n**bold text**',
    output: '<h1 id="header">header</h1><p><strong>bold text</strong></p>'
  },
  {
    description: 'Renders markdown with complex latex formula as expected',
    input:
      'Addition der einzelnen Elementarwahrscheinlichkeiten:\n\n$$P(A)=P\\left(\\left\\{(T;T)\\right\\}\\right)+P\\left(\\left\\{(T;N)\\right\\}\\right)+P\\left(\\left\\{(N;T)\\right\\}\\right)$$\n\n%%P(A)=\\frac5{20}+\\frac{15}{20}\\cdot\\frac5{19}=\\frac{17}{38}=44,7\\%%%',
    output:
      '<p>Addition der einzelnen Elementarwahrscheinlichkeiten:</p><p><katexblock>P(A)=P\\left(\\left\\{(T;T)\\right\\}\\right)+P\\left(\\left\\{(T;N)\\right\\}\\right)+P\\left(\\left\\{(N;T)\\right\\}\\right)</katexblock></p><p><katexinline>P(A)=\\frac5{20}+\\frac{15}{20}\\cdot\\frac5{19}=\\frac{17}{38}=44,7\\% </katexinline></p>'
  }
]

cases.forEach(testcase => {
  describe('Transformes Serlo Layout to new Layout', () => {
    it(testcase.description, () => {
      expect(renderMarkdown(testcase.input), 'to equal', testcase.output)
    })
  })
})
