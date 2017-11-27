import React from 'react'

// You are obviously not limited to material-ui, but we really enjoy
// the material-ui svg icons!
import CropSquare from 'material-ui/svg-icons/image/crop-square'

// This is the ReactJS component which you can find below this snippet
import Spoiler from './Component'
import uuid from 'uuid'
import Slate from 'ory-editor-plugins-slate'

const defaultPlugin = new Slate()

export default {
  Component: Spoiler,
  IconComponent: <CropSquare />,
  name: 'serlo/layout/spoiler',
  version: '0.0.1',
  text: 'Spoiler',
  createInitialChildren: () => ({
    id: uuid.v4(),
    rows: [
      {
        id: uuid.v4(),
        cells: [
          {
            content: {
              plugin: defaultPlugin,
              state: defaultPlugin.createInitialState()
            },
            id: uuid.v4()
          }
        ]
      }
    ]
  })
}
