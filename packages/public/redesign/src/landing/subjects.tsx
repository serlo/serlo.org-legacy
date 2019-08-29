import * as React from 'react'
import styled from 'styled-components'
import { Grid, Row } from 'react-styled-flexboxgrid'

import Subject from './subject'

const iconMath = require('../img/subjects-math.svg')
const iconABC = require('../img/subjects-abc.svg')
const iconSustainability = require('../img/subjects-sustainability.svg')
const iconBiology = require('../img/subjects-biology.svg')

export interface SubjectProps {
  url: string,
  iconSrc: string,
  text: string
}

export default class Subjects extends React.Component {
  public render() {
    return (
      <SubjectsGrid fluid >
        <Row>
          <Subject text='Mathematik lernen' url='/mathe' iconSrc={iconMath} />
          <Subject text='Alphabetisierung' url='/abc' iconSrc={iconABC} />
          <Subject text='Nachhaltigkeit lernen' url='/nachhaltigkeit' iconSrc={iconSustainability} />
          <Subject text='Biologie lernen' url='/biologie' iconSrc={iconBiology} />
        </Row>
      </SubjectsGrid>
    )
  }
}

const SubjectsGrid = styled(Grid) `
  padding: 0 1rem;
`
