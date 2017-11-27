import React from 'react'
import Display from './Display'
import Form from './Form'
const Geogebra = props =>
  props.readOnly ? <Display {...props} /> : <Form {...props} />

export default Geogebra
