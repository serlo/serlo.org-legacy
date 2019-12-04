import * as React from 'react'
import styled from 'styled-components'
import { Grid, Col, Row } from 'react-styled-flexboxgrid'
//import { Anchor } from 'grommet'
import { getColor } from '../provider.component'
import { Button } from '../button.component'

import Logo from '../logo.component'
import { NavChild } from './nav'
import { getPath } from '../assets'

export interface AboutProps {
  slogan: string
  missionStatementTitle: string
  missionStatement: string
  learnMoreLink: NavChild
  participateLink: NavChild
  donateLink: NavChild
}

export function About(props: AboutProps) {
  return (
    <AboutGrid fluid>
      <AboutWrap>
        <ColBrand xs={12} md={8}>
          <Logo subline={props.slogan} dark />
          <TopButton
            href="#top"
            onClick={e => {
              e.preventDefault()
              document.documentElement.scrollTop = 0
            }}
            title="Mit Serlo ganz nach oben ;)"
            iconName="faChevronUp"
            backgroundColor="transparent"
            activeBackgroundColor={getColor('lightblue')}
          />
        </ColBrand>

        <Col xs={12} md={4}>
          <Summary>
            {/* <Col xs={12}> */}
            <SummaryHeading>{props.missionStatementTitle}</SummaryHeading>
            <SummaryBox>{props.missionStatement}</SummaryBox>
            <SummaryBox>
              <LearnMoreButton
                label={props.learnMoreLink.title}
                iconName="faChevronCircleRight"
                backgroundColor="transparent"
                href={props.learnMoreLink.url}
              />
            </SummaryBox>
            {/* </Col> */}
          </Summary>

          <RowSupport>
            <Col xs>
              <ImageLink href={props.participateLink.url}>
                <img
                  alt="Icon: Participate"
                  src={getPath('/img/footer_participate.svg')}
                />
                <StyledButton label={props.participateLink.title} />
              </ImageLink>
            </Col>
            <Col xs>
              <ImageLink href={props.donateLink.url}>
                <img
                  alt="Icon: Spenden"
                  src={getPath('/img/footer_donate.svg')}
                />
                <StyledButton label={props.donateLink.title} />
              </ImageLink>
            </Col>
          </RowSupport>
        </Col>
      </AboutWrap>
    </AboutGrid>
  )
}

const AboutGrid = styled(Grid)`
  padding: 0;
`
const ImageLink = styled.a`
  > img {
    display: block;
    margin: 0 auto;
    max-width: 5rem;
  }
`

const StyledButton = styled(Button)`
  margin-top: 0.3rem;

  ${ImageLink}:hover & {
    background-color: ${getColor('brand')};
  }
` as typeof Button

const TopButton = styled(Button)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;

  > svg {
    vertical-align: -1.6em;
  }
` as typeof Button

const LearnMoreButton = styled(Button)`
  :hover {
    text-decoration: none;
  }
` as typeof Button

const ColBrand = styled(Col)`
  background-color: ${getColor('brand')};
  position: relative;
`

const Summary = styled.div`
  background-color: ${getColor('lightblue')};
  color: #fff;
  padding-top: 2.5rem;
  padding: 2.5rem 0.8rem 0.1rem 1.5rem;
`

/*const RowSummary = styled(Row)`
  background-color: ${getColor('lightblue')};
  color: #fff;
  padding-top: 2.5rem;

  @media (max-width: ${props => props.theme.md}) {
    padding-left: 0.5rem;
  }
`*/

const SummaryHeading = styled.h2`
  font-size: 1rem;
  font-weight: bold;
`

const SummaryBox = styled.div`
  margin: 2rem 0;
`

const RowSupport = styled(Row)`
  padding: 1rem 0;
  background-color: ${getColor('brandGreen')};
  color: #fff;
  text-align: center;
`

const AboutWrap = styled(Row)`
  margin-right: 0;
  margin-left: 0;
`
