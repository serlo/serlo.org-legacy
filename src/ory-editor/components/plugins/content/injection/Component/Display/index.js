import React, { Component } from 'react'
import debounce from 'lodash.debounce'
import $ from 'jquery'
import request from 'superagent'
// import ImageIcon from 'material-ui/svg-icons/image/panorama'

class Display extends Component {
  constructor (props) {
    super(props)
    this.createRequest = debounce(this.createRequest, 500)

    this.state = {
      loaded: null
    }
  }

  componentDidMount () {
    if (!this.state.loaded && this.props.state.src) {
      this.createRequest(this.props.state)
    }
  }


  // Corrects relative urls with missing leading slash
  correctUrl (url) {
    url = url.split('/')
    // Url does start with http
    if (url[0] === 'http:' || url[0] === 'https:') {
      // is invalid for injections, but do nothing
      return url.join('/')
    }

    // first item is empty, means there already is a leading slash
    if (url[0] === '') {
      url.shift()
    }

    // Url does not start with / or http
    return '/' + url.join('/')
  }

  createRequest = ({ src, alt }) => {
    src = this.correctUrl(src);
    $.ajax(src)
      .done((input) => {
        try {
          const data = JSON.parse(input);
          this.setState({loaded: data.response})
        } catch (e) {
          this.setState({loaded: '<div class="alert alert-info">Illegal injection found </div>'})
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
      <div className="panel panel-default">
        <div
          className="panel-body"
          dangerouslySetInnerHTML={{ __html: this.state.loaded }}
        />
      </div>
    ) : (
      <div >
        <a href={this.props.state.src}>{this.props.state.alt}</a>
      </div>
    )
  }
}

export default Display
