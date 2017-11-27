import React, { Component } from 'react'
import debounce from 'lodash.debounce'
import request from 'superagent'
// import ImageIcon from 'material-ui/svg-icons/image/panorama'

class Display extends Component {
  constructor (props) {
    super(props)
    this.createRequest = debounce(this.createRequest, 500)
  }

  state = {
    loaded: null
  }

  componentDidMount () {
    if (!this.state.loaded && this.props.state.src) {
      this.createRequest(this.props.state)
    }
  }

  createRequest = ({ src, alt }) => {
    request.get(src).end((err, res) => {
      if (err || !res.ok) {
        this.setState({
          loaded: <div className='injection'>{alt}</div>
        })
      } else {
        this.setState({ loaded: res.text })
        return true
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.state.src !== nextProps.state.src) {
      this.createRequest(nextProps.state)
    }
  }

  render () {
    return this.state.loaded ? (
      <div
        className='injection'
        dangerouslySetInnerHTML={{ __html: this.state.loaded }}
      />
    ) : (
      <div className='injection' />
    )
  }
}

export default Display
