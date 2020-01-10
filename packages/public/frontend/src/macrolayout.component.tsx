/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
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
