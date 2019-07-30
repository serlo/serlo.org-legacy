import { htmlToSlate } from '../../src/splishToEdtr/convertSlate'

describe('slate serializer and deserializer work', () => {

  it('can handle empty paragraphs', () => {
    const html = '<p></p>'

    expect(htmlToSlate(html)).toEqual(JSON.parse('{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","nodes":[]}]}}'))
  })
  it('works with normal text.', () => {
    const html = 'This was created with'

    expect(htmlToSlate(html)).toEqual(JSON.parse('{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","data":{},"type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"This was created with"}]}]}]}}'))
  })

  it('works with normal paragraphs and marks.', () => {
    const html = '<p>This was created with <strong>Splish</strong> editor.</p>'
    expect(htmlToSlate(html)).toEqual(JSON.parse('{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"This was created with "}]},{"object":"text","leaves":[{"object":"leaf","text":"Splish","marks":[{"type":"@splish-me/strong"}]}]},{"object":"text","leaves":[{"object":"leaf","text":" editor."}]}]}]}}'))
  })

  it('works with list', () => {
    const html = '<ul><li><p>foo</p></li><li><p>bar</p></li></ul>'
    expect(htmlToSlate(html)).toEqual(JSON.parse('{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"unordered-list","nodes":[{"object":"block","type":"list-item","nodes":{"object":"block","type":"list-item-child","nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"foo"}]}]}]}},{"object":"block","type":"list-item","nodes":{"object":"block","type":"list-item-child","nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"bar"}]}]}]}}]}]}}'))
  })

  it('works with real html from splish slate', () => {
    const html = '<p>This was created with <strong>Splish</strong> editor.</p><ul><li><p>foo</p></li><li><p>bar</p></li></ul>'
    expect(htmlToSlate(html)).toEqual(JSON.parse('{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"This was created with "}]},{"object":"text","leaves":[{"object":"leaf","text":"Splish","marks":[{"type":"@splish-me/strong"}]}]},{"object":"text","leaves":[{"object":"leaf","text":" editor."}]}]},{"object":"block","type":"unordered-list","nodes":[{"object":"block","type":"list-item","nodes":{"object":"block","type":"list-item-child","nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"foo"}]}]}]}},{"object":"block","type":"list-item","nodes":{"object":"block","type":"list-item-child","nodes":[{"object":"block","type":"paragraph","nodes":[{"object":"text","leaves":[{"object":"leaf","text":"bar"}]}]}]}}]}]}}'))
  })
})
