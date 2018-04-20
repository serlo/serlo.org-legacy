import slateFactory from 'ory-editor-plugins-slate'
import { defaultPlugins as defaultSlatePlugins } from 'ory-editor-plugins-slate/lib/hooks'
import {
  serialize as slateSerialize,
  unserialize as slateUnserialize
} from './components/plugins/content/slate/src/slateUnserialize'
import KatexPlugin from './components/plugins/content/slate/src/plugins/katex'
import { P } from 'ory-editor-plugins-slate/lib/plugins/paragraph'

import image from 'ory-editor-plugins-image'
import spacer from 'ory-editor-plugins-spacer'
import divider from 'ory-editor-plugins-divider'
import video from 'ory-editor-plugins-video'
import parallax from 'ory-editor-plugins-parallax-background'
import injection from './components/plugins/content/injection'
import geogebra from './components/plugins/content/geogebra'
import spoiler from './components/plugins/layout/spoiler'
const slate = slateFactory([...defaultSlatePlugins, new KatexPlugin({ P })])
// slate.unserialize = slateUnserialize
// slate.serialize = slateSerialize

export default {
  content: [slate, image, injection, geogebra],
  layout: [spoiler({ defaultPlugin: slate })]
}

export const defaultPlugin = slate