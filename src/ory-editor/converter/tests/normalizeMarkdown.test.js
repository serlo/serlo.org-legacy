/**
 * Created by benny on 17.11.16.
 */
import unexpected from 'unexpected'
import normalizeMarkdown from '../src/normalizeMarkdown'

const expect = unexpected.clone()

const cases = [
  {
    description: 'Split spoilers',
    input: 'Lorem \n/// title\nmarkdowntext\n///\n ipsum',
    output: {
      normalized: 'Lorem \n§0§\n ipsum',
      elements: [
        {
          name: 'spoiler',
          title: 'title',
          content: {
            normalized: 'markdowntext',
            elements: []
          }
        }
      ]
    }
  },
  {
    description: 'split injections',
    input: 'Lorem \n>[alttext](url)\n ipsum',
    output: {
      normalized: 'Lorem \n§0§\n ipsum',
      elements: [
        {
          name: 'injection',
          alt: 'alttext',
          src: 'url'
        }
      ]
    }
  },
  {
    description: 'split images',
    input: 'Lorem ![image](url) ipsum',
    output: {
      normalized: 'Lorem §0§ ipsum',
      elements: [
        {
          name: 'image',
          alt: 'image',
          src: 'url'
        }
      ]
    }
  },
  {
    description: 'split images in spoilers',
    input: '/// title\nmarkdowntext with image ![image](url)\n///',
    output: {
      normalized: '§0§',
      elements: [
        {
          name: 'spoiler',
          title: 'title',
          content: {
            normalized: 'markdowntext with image §0§',
            elements: [
              {
                name: 'image',
                alt: 'image',
                src: 'url'
              }
            ]
          }
        }
      ]
    }
  },
  {
    description: 'split multiple elements',
    input:
      'some markdown text with image\n![image](url)\n some more markdown\n![image2](url2)',
    output: {
      normalized:
        'some markdown text with image\n§0§\n some more markdown\n§1§',
      elements: [
        {
          name: 'image',
          alt: 'image',
          src: 'url'
        },
        {
          name: 'image',
          alt: 'image2',
          src: 'url2'
        }
      ]
    }
  },
  {
    description: 'split geogebra injection',
    input: 'Lorem \n>[alttext](ggt/url)\n ipsum',
    output: {
      normalized: 'Lorem \n§0§\n ipsum',
      elements: [
        {
          name: 'geogebra',
          alt: 'alttext',
          src: 'url'
        }
      ]
    }
  },
  {
    description: 'split linked images',
    input: 'Lorem [![image](imageurl)](linkurl) ipsum',
    output: {
      normalized: 'Lorem §0§ ipsum',
      elements: [
        {
          name: 'image',
          alt: 'image',
          src: 'imageurl',
          href: 'linkurl'
        }
      ]
    }
  },
  {
    description: 'parse escape parameters correctly',
    input: 'Lorem \\!\\[image](imageurl) ipsum',
    output: {
      normalized: 'Lorem \\!\\[image](imageurl) ipsum',
      elements: []
    }
  }
]

cases.forEach(testcase => {
  describe('Transformes Serlo Layout to new Layout', () => {
    it(testcase.description, () => {
      expect(normalizeMarkdown(testcase.input), 'to equal', testcase.output)
    })
  })
})
