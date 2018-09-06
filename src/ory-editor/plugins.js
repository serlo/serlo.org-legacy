// import { defaultPlugins, defaultPlugin, exercisePlugins } from '@serlo-org/ory-editor-plugins-workspace/.storybook/helpers/Renderer'
import createSlate from '@splish-me/editor-plugin-slate'
import image from '@splish-me/editor-plugin-image'
import divider from '@splish-me/editor-plugin-divider'
import spacer from '@splish-me/editor-plugin-spacer'
import spoiler from '@serlo-org/editor-plugin-spoiler'
import geogebra from '@serlo-org/editor-plugin-geogebra'
import license from '@serlo-org/editor-plugin-license'
import injection from '@serlo-org/editor-plugin-injection'
import scMcExercise from '@serlo-org/editor-plugin-sc-mc-exercise'
import textfield from '@serlo-org/editor-plugin-input-exercise'
import solution from '@serlo-org/editor-plugin-solution'
import hint from '@serlo-org/editor-plugin-hint'
import table from '@serlo-org/editor-plugin-table'

const defaultPlugins = [
  createSlate(),
  spacer,
  image,
  divider,
  geogebra,
  // highlight,
  // infobox,
  spoiler,
  license,
  injection,
  table
]

const exercisePlugins = [scMcExercise, textfield, solution, hint]


export default (type) => {
  if (type === 'text-exercise' || type === 'grouped-text-exercise') {
    return [...defaultPlugins, ...exercisePlugins]
  }

  return defaultPlugins
}


const defaultPlugin = createSlate()

export { defaultPlugin }
