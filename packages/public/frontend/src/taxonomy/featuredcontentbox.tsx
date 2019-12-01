import * as React from 'react'
import styled from 'styled-components'
import { Anchor } from 'grommet'
import { Heading } from '../heading.component'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
import { getColor, lightenColor } from '../provider.component'
import { Icon } from '../icon.component'

//TODO: Define Props when data structure from athene is clear

export function FeaturedContentBox() {
  return (
    <React.Fragment>
      <Grid fluid style={{ padding: '0', alignItems: 'center' }}>
        <Row>
          <Heading level={2}>Passende Inhalte</Heading>
        </Row>

        <Row>
          <AContentBox
            title="Prozent- und Zinsrechnung"
            desc="Ein Kreissektor ist eine Teilfläche des Kreises, die von einem
        Kreisbogen und zwei daran ..."
          />
          <AContentBox
            title="Prozentrechnung mittels Dreisatz"
            desc="Ein Kreissektor ist eine Teilfläche des Kreises, die von einem
        Kreisbogen und zwei daran ..."
          />
        </Row>

        <Row>
          <Col md={6} lg={4}>
            <Heading level={3}>Aufgaben</Heading>
            <StyledAnchor>
              <Icon icon="faCopy" /> Aufgaben zur Zinsrechnung
              <br />
            </StyledAnchor>
            <StyledAnchor>
              <Icon icon="faCopy" /> Aufgaben zur Prozentrechnung
              <br />
            </StyledAnchor>
          </Col>
          <Col md={6} lg={4}>
            <Heading level={3}>Kurse</Heading>
            <StyledAnchor>
              <Icon icon="faGraduationCap" /> Einführung in Grundwert,
              Prozentwert und Prozentsatz <br />
            </StyledAnchor>
            <StyledAnchor>
              <Icon icon="faGraduationCap" /> Einführung in den verminderten und
              <br />
              vermehrten Grundwert
            </StyledAnchor>
          </Col>
          <Col md={6} lg={4}>
            <Heading level={3}>Artikel</Heading>
            <StyledAnchor>
              <Icon icon="faNewspaper" /> Prozent
              <br />
            </StyledAnchor>
            <StyledAnchor>
              <Icon icon="faNewspaper" /> Prozentrechnung mittels Dreisatz
              <br />
            </StyledAnchor>
            <StyledAnchor>
              <Icon icon="faNewspaper" /> Zinsrechnung
              <br />
            </StyledAnchor>
          </Col>
        </Row>
      </Grid>
    </React.Fragment>
  )
}

interface AContentBoxProps {
  title: string
  desc: string
}

function AContentBox(props: AContentBoxProps) {
  return (
    <Col xs={12} md={6} lg={4}>
      <ContentRow
        onClick={() => {
          // alert('clicked')
        }}
      >
        <Placeholder xs={5} md={12}>
          <Icon icon="faNewspaper" size="2x" />
        </Placeholder>
        <TitleCol xs={7} md={12}>
          <Anchor>{props.title}</Anchor>
        </TitleCol>
        <DescriptionCol xs={12} md={12}>
          {props.desc}
        </DescriptionCol>
      </ContentRow>
    </Col>
  )
}

const StyledAnchor = styled(Anchor)``

const ContentRow = styled(Row)`
  margin-bottom: 3rem;
  margin-top: 0.5rem;
  cursor: pointer;
`

const Placeholder = styled(Col)`
  background-color: ${lightenColor('brand', 0.55)};
  color: ${getColor('lighterblue')};
  height: 6rem;
  border-right: 1rem solid white;

  display: flex !important;
  align-items: center;
  text-align: center;

  > svg {
    margin: 0 auto;
  }

  @media screen and (min-width: ${props => props.theme.md}) {
    /* width: 100%;
    flex-basis: 100%; */
  }
`

const DescriptionCol = styled(Col)`
  padding-left: 0;

  @media screen and (max-width: ${props => props.theme.md}) {
    margin-top: 1rem;
  }
`

const TitleCol = styled(Col)`
  @media screen and (max-width: ${props => props.theme.md}) {
    align-items: center;
    display: flex;
  }

  @media screen and (min-width: ${props => props.theme.md}) {
    padding-left: 0;
    margin-top: 1rem;
  }
`
