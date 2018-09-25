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
          description: 'alttext',
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
          description: 'image',
          src: 'url'
        }
      ]
    }
  },
  {
    description: 'split images with title',
    input: 'Lorem ![image](url "title") ipsum',
    output: {
      normalized: 'Lorem §0§ ipsum',
      elements: [
        {
          name: 'image',
          description: 'image',
          src: 'url',
          title: 'title'
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
                description: 'image',
                src: 'url'
              }
            ]
          }
        }
      ]
    }
  },
  {
    description: 'split images with title in spoilers',
    input: '/// title\nmarkdowntext with image ![image](url "title")\n///',
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
                description: 'image',
                src: 'url',
                title: 'title'
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
          description: 'image',
          src: 'url'
        },
        {
          name: 'image',
          description: 'image2',
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
          description: 'alttext',
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
          description: 'image',
          src: 'imageurl',
          href: 'linkurl'
        }
      ]
    }
  },
  {
    description: 'split linked images with title',
    input: 'Lorem [![image](imageurl "imagetitle")](linkurl) ipsum',
    output: {
      normalized: 'Lorem §0§ ipsum',
      elements: [
        {
          name: 'image',
          description: 'image',
          src: 'imageurl',
          title: 'imagetitle',
          href: 'linkurl'
        }
      ]
    }
  },
  {
    description: 'split tables',
    input:
      'Lorem \n|header1|header2 | \n|--|--|\n| row1 col1 | row1 *col2* | \n|row2 col1 | row2 col2| row2 col3|\n ipsum',
    output: {
      normalized: 'Lorem §0§ ipsum',
      elements: [
        {
          name: 'table',
          src:
            '\n|header1|header2 | \n|--|--|\n| row1 col1 | row1 *col2* | \n|row2 col1 | row2 col2| row2 col3|\n'
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
