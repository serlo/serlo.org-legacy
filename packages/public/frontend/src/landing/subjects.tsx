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
import styled from 'styled-components'
import { Grid, Row } from 'react-styled-flexboxgrid'

import Subject from './subject'
import { getPath } from '../assets'

export interface SubjectProps {
  url: string
  iconSrc: string
  text: string
}

export default class Subjects extends React.Component {
  public render() {
    return (
      <SubjectsGrid fluid>
        <Row>
          <Subject
            text="Mathematik lernen"
            url="/mathe"
            iconSrc={getPath('/img/subjects-math.svg')}
          />
          <Subject
            text="Alphabetisierung"
            url="/abc"
            iconSrc={getPath('/img/subjects-abc.svg')}
          />
          <Subject
            text="Nachhaltigkeit lernen"
            url="/nachhaltigkeit"
            iconSrc={getPath('/img/subjects-sustainability.svg')}
          />
          <Subject
            text="Biologie lernen"
            url="/biologie"
            iconSrc={getPath('/img/subjects-biology.svg')}
          />
        </Row>
      </SubjectsGrid>
    )
  }
}

const SubjectsGrid = styled(Grid)`
  padding: 0 1rem;
`
