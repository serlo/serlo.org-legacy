import * as React from 'react'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'

interface MacroLayoutProps {
  main: React.ReactNode
  nav?: React.ReactNode
  aside?: React.ReactNode
}

export function MacroLayout(props: MacroLayoutProps) {
  return (
    <>
      <Grid fluid>
        <Row center={'xs'} style={{ maxWidth: 1300, margin: 'auto' }}>
          <Col xs={false} lg={3}>
            {props.nav}
          </Col>
          <Col xs={12} md={8} lg={6} style={{ maxWidth: 800 }}>
            {props.main}
          </Col>
          <Col xs={false} md={4} lg={3}>
            {props.aside}
          </Col>
        </Row>
      </Grid>
    </>
  )
}
