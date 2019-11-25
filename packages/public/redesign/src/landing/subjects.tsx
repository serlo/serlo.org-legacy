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
