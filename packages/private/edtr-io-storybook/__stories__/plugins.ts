import { license } from './fixtures'
import { addContentTypeStories } from './helpers'

addContentTypeStories('Plugins/Layout/image on right', 'article', {
  id: 1337,
  license,
  changes: '',
  title: 'Layout Tests',
  content: JSON.stringify({
    plugin: 'layout',
    state: [
      {
        width: 6,
        child: {
          plugin: 'rows',
          state: [
            {
              plugin: 'text',
              state: [
                {
                  type: 'p',
                  children: [
                    {
                      text: 'Dies ist der Text des künftigen Multimedia-Plugins'
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        width: 6,
        child: {
          plugin: 'rows',
          state: [
            {
              plugin: 'image',
              state: {
                src:
                  'https://raw.githubusercontent.com/edtr-io/edtr-io/master/README_files/edtrio_full.svg?sanitize=true',
                alt: 'Edtr.io Logo'
              }
            }
          ]
        }
      }
    ]
  }),
  reasoning: '',
  meta_title: '',
  meta_description: ''
})

addContentTypeStories('Plugins/Layout/image on left', 'article', {
  id: 1337,
  license,
  changes: '',
  title: 'Layout Tests',
  content: JSON.stringify({
    plugin: 'layout',
    state: [
      {
        width: 6,
        child: {
          plugin: 'rows',
          state: [
            {
              plugin: 'image',
              state: {
                src:
                  'https://raw.githubusercontent.com/edtr-io/edtr-io/master/README_files/edtrio_full.svg?sanitize=true',
                alt: 'Edtr.io Logo'
              }
            }
          ]
        }
      },
      {
        width: 6,
        child: {
          plugin: 'rows',
          state: [
            {
              plugin: 'text',
              state: [
                {
                  type: 'p',
                  children: [
                    {
                      text: 'Dies ist der Text des künftigen Multimedia-Plugins'
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  }),
  reasoning: '',
  meta_title: '',
  meta_description: ''
})
