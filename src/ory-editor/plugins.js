import { defaultPlugins, exercisePlugins } from '@serlo-org/ory-editor-plugins-workspace/.storybook/helpers/Renderer'

export default (type) => {
  if (type === 'text-exercise' || type === 'grouped-text-exercise') {
    return [...defaultPlugins, ...exercisePlugins]
  }

  return defaultPlugins
}

export const defaultPlugin = editorPlugins.content[0]
