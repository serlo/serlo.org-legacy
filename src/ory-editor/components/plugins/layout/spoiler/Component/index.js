import React, { Component } from 'react'

class Spoiler extends Component {
  state = {
    hidden: true
  }

  onToggle = () => {
    this.setState({ hidden: !this.state.hidden })
  }

  render () {
    const { children, state: { title } } = this.props
    return (
      <div className='spoiler panel panel-default' onClick={this.onToggle}>
        <div className='spoiler-teaser panel-heading'>
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
          className='spoiler-content panel-body'
          style={{ display: this.state.hidden ? 'none' : 'block' }}
        >
          {children}
        </div>
      </div>
    )
  }
}

export default Spoiler
