import * as React from 'react'
import styled from 'styled-components'

const MyH1 = styled.h1<any>`
  font-size: ${props => props._fontSize}px;
`

export default function Index(props) {
  const [prop, setProp] = React.useState(12)
  return (
    <MyH1
      onClick={() => {
        setProp(prop + 1)
        console.log('Hi')
      }}
      _fontSize={prop}
    >
      Hallooooo
    </MyH1>
  )
}
