import React from 'react'
// import './index.scoped.css'
import Display from './Display'
import Form from './Form'

const Injection = props =>
  props.readOnly ? <Display {...props} /> : <Form {...props} />

export default Injection
