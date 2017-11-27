import React, { Component } from 'react'
import { v4 } from 'uuid'
import request from 'superagent'
import dimensions from 'ory-editor-core/lib/components/Dimensions'
import debounce from 'lodash.debounce'

class Display extends Component {
  constructor (props) {
    super(props)
    this.requestHeight = debounce(this.requestHeight, 500)
  }

  state = {
    id: 'gtApplet' + v4(),
    width: 800,
    height: 500
  }

  componentDidMount () {
    if (!this.state.loaded && this.props.state.src) {
      this.requestHeight(this.props.state)
    }
  }

  requestHeight = ({ src }) => {
    const geogebraRequest = JSON.stringify({
      request: {
        '-api': '1.0.0',
        task: {
          '-type': 'fetch',
          fields: {
            field: [{ '-name': 'width' }, { '-name': 'height' }]
          },
          filters: {
            field: [{ '-name': 'id', '#text': src }]
          },
          limit: { '-num': '1' }
        }
      }
    })

    request
      .post('http://www.geogebra.org/api/json.php')
      .send(geogebraRequest)
      .end((err, res) => {
        if (!err && res.ok) {
          const { width, height } = res.body.responses.response.item
          this.setState(...this.state, {
            width: width,
            height: height
          })
        }
      })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.state.src !== nextProps.state.src) {
      this.requestHeight(nextProps.state)
    }
  }

  render () {
    const { containerWidth } = this.props
    return (
      <div>
        <iframe
          scrolling='no'
          src={
            'https://www.geogebra.org/material/iframe/id/' +
            this.props.state.src
          }
          width='100%'
          height={containerWidth * this.state.height / this.state.width}
          style={{
            border: '0px',
            pointerEvents: this.props.readOnly ? 'auto' : 'none'
          }}
        />
      </div>
    )
  }
}

export default dimensions()(Display)
