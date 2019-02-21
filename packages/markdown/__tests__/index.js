import { converter } from '../src'

test("Converter doesn't throw", () => {
  const html = converter.makeHtml('# Heading')
  expect(html).toEqual('<h1 id="heading">Heading</h1>')
})
