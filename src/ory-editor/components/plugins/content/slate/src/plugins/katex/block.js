import React from 'react'
import MathComponent from './mathComponent'

import Form from './Form'

const Block = props => {
  const { attributes, children, node } = props
  const { data } = node
  const formula = data.get('formula')

  return (
    <div {...attributes} contentEditable={false}>
      <MathComponent formula={formula} />
      <Form formula={formula} {...props} />
      {children}
    </div>
  )
}

// Fixme
/* Block.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.oneOf([PropTypes.func, PropTypes.element, PropTypes.array]).isRequired,
  node: PropTypes.shape({
    data: PropTypes.any
  })
} */

export default Block
