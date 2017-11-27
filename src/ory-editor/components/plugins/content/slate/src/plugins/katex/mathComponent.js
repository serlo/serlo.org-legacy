import React from 'react'
import { InlineMath, BlockMath } from 'react-katex'

const handleError = (formula, error, inline, oldErrorPosition) => {
  const errorStyle = {
    color: '#CC0000'
  }

  if (error.position === oldErrorPosition) {
    return <span style={errorStyle}>{formula}</span>
  }

  const beforeError = formula.substring(0, error.position)
  const afterError = formula.substring(error.position)
  return (
    <span
      style={{
        display: 'inline-block'
      }}
    >
      <MathComponent
        formula={beforeError}
        inline={inline}
        oldErrorPosition={error.position}
      />
      <span style={errorStyle}>{afterError}</span>
      <div style={errorStyle}>
        <b>
          {error.name}: {error.message}
        </b>
      </div>
    </span>
  )
}

const MathComponent = ({ inline, formula, oldErrorPosition }) => {
  const Component = inline ? InlineMath : BlockMath
  return (
    <Component
      math={formula}
      renderError={error =>
        handleError(formula, error, inline, oldErrorPosition)
      }
    />
  )
}

export default MathComponent
