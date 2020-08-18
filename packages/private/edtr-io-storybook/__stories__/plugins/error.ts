import { addPluginStory } from '../helpers'
import { license } from '../fixtures'

addPluginStory({
  name: 'Error',
  initialState: {
    id: 1337,
    license,
    changes: '',
    title: 'Error Tests',
    content: JSON.stringify({
      plugin: 'error',
      state: {
        plugin: 'type',
        state: {
          foo: 'bar',
        },
      },
    }),
  },
})
