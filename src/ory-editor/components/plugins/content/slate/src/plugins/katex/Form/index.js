import React, { Component } from 'react'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField'
import debounce from 'lodash.debounce'
import Portal from 'react-portal'
import position from 'selection-position'
import { darkBlack } from 'material-ui/styles/colors'

class Form extends Component {
  constructor (props) {
    super(props)
    const { formula } = this.props
    this.state = {
      formula: formula
    }
    this.renderMath = debounce(this.renderMath, 500)
  }

  componentWillReceiveProps (nextProps) {
    const { formula } = nextProps
    this.setState({
      formula: formula
    })
  }

  handleChange = (e, newFormula) => {
    this.setState({
      formula: newFormula
    })

    this.renderMath(newFormula)
  }

  renderMath = newFormula => {
    const { editor, node } = this.props
    const { key } = node

    const next = this.props.editor
      .getState()
      .transform()
      .setNodeByKey(key, {
        data: {
          formula: newFormula
        }
      })
      .apply()

    editor.onChange(next)
    this.focusTextfield()
  }

  focusTextfield = () => {
    setTimeout(() => {
      this.input && this.input.focus()
    }, 0)
  }

  handleOpen = portal => {
    const textfield = portal.firstChild
    const { top } = position()
    textfield.style.opacity = 1
    textfield.style.top = `${top + window.scrollY - textfield.offsetHeight}px`
    textfield.style.left = `${document.body.clientWidth / 2 -
      textfield.offsetWidth / 2}px`
  }

  focusReference = input => {
    if (input) this.input = input
  }

  render () {
    const { node, state } = this.props
    const isActive = state.isFocused && state.selection.hasEdgeIn(node)

    return (
      <Portal isOpened={isActive} onOpen={this.handleOpen}>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div
            className='ory-prevent-blur ory-plugins-content-slate-inline-toolbar'
            style={{
              display: 'inline-block',
              border: `${darkBlack} 1px solid`,
              borderRadius: '4px 4px 0',
              backgroundColor: darkBlack,
              padding: '0 12px'
            }}
          >
            <TextField
              ref={this.focusReference}
              hintText={'\\frac{1}{2}'}
              floatingLabelText='Formula'
              inputStyle={{ color: 'white' }}
              floatingLabelStyle={{ color: 'white' }}
              hintStyle={{ color: 'grey' }}
              style={{ width: '800px' }}
              value={this.state.formula}
              onChange={this.handleChange}
            />
          </div>
        </MuiThemeProvider>
      </Portal>
    )
  }
}

export default Form
