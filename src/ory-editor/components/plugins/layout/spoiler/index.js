// @flow
import React, { Component } from 'react'
import uuid from 'uuid'
import FilterFrames from 'material-ui/svg-icons/image/filter-frames'
import type {
  LayoutPluginProps,
  ContentPlugin
} from 'ory-editor-core/lib/service/plugin/classes'

import TextField from 'material-ui/TextField'
import { BottomToolbar } from 'ory-editor-ui'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class PluginComponent extends Component {
  state = { hidden: true }
  props: LayoutPluginProps<{}> & { children: any }

  onToggle = () => {
    this.setState({ hidden: !this.state.hidden })
  }

  render () {
    const { children, focused, onChange, state: { title = ' ' } } = this.props
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div className='ory-plugins-layout-spoiler spoiler'>
          <div className='spoiler-title' onClick={this.onToggle}>
            <span
              className={
                this.state.hidden
                  ? 'fa fa-caret-square-o-down'
                  : 'fa fa-caret-square-o-up'
              }
            />
            {title}
          </div>

          <div
            className='spoiler-content'
            style={{ display: this.state.hidden ? 'none' : 'block' }}
          >
            {children}
          </div>

          {/* <BottomToolbar open={focused}>
            <TextField
              hintText="Title"
              floatingLabelText="Title of spoiler"
              inputStyle={{ color: 'white' }}
              floatingLabelStyle={{ color: 'white' }}
              hintStyle={{ color: 'grey' }}
              style={{ width: '256px' }}
              value={title}
              onChange={(e, value) => onChange({ title: value })}
            />
          </BottomToolbar> */}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default ({ defaultPlugin }: { defaultPlugin: ContentPlugin }) => ({
  Component: PluginComponent,
  name: 'serlo/layout/spoiler',
  version: '0.0.1',

  text: 'Hidden Text',
  IconComponent: <FilterFrames />,

  createInitialChildren: () => ({
    id: uuid(),
    rows: [
      {
        id: uuid(),
        cells: [
          {
            content: {
              plugin: defaultPlugin,
              state: defaultPlugin.createInitialState()
            },
            id: uuid()
          }
        ]
      }
    ]
  })
})
