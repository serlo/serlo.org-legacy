import React from 'react'
import Display from '../Display'

import TextField from 'material-ui/TextField'
import { BottomToolbar } from 'ory-editor-ui'

const handleChange = onChange => e => {
  const target = e.target
  if (target instanceof HTMLInputElement) {
    onChange({ src: target.value })
  }
}

const Form = props => (
  <div>
    <Display {...props} />
    <BottomToolbar open={props.focused}>
      <TextField
        hintText='/12345'
        floatingLabelText='Injection Element'
        inputStyle={{ color: 'white' }}
        floatingLabelStyle={{ color: 'white' }}
        hintStyle={{ color: 'grey' }}
        style={{ width: '512px' }}
        value={props.state.src}
        onChange={handleChange(props.onChange)}
      />
    </BottomToolbar>
  </div>
)

export default Form
