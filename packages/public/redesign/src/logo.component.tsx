import * as React from 'react'
import styled from 'styled-components'
import {
  getColor,
  lightenColor,
  transparentizeColor
} from './provider.component'

const logoSrc = require('./img/serlo-logo.svg')
const logoWhiteSrc = require('./img/serlo-logo-white.svg')

export interface Props {
  subline?: string
  dark?: boolean
  //link href
}

export default function Logo(props: Props) {
  return (
    <React.Fragment>
      <Header>
        <Link href=".">
          <Image alt="Serlo" src={props.dark ? logoWhiteSrc : logoSrc} />
        </Link>
      </Header>
      {!props.subline ? null : (
        <h2>
          <SublineLink
            className="subline icon"
            href="#subject"
            dark={props.dark}
          >
            {props.subline}
          </SublineLink>
        </h2>
      )}
    </React.Fragment>
  )
}

const Header = styled.h1`
  padding-bottom: 0;
  margin-bottom: -0.85rem;
`

const Link = styled.a`
  border: 0 !important;
  padding-bottom: 0;
`

interface SublineLinkProps {
  dark?: boolean
}

const SublineLink = styled(Link)<SublineLinkProps>`
  color: ${props =>
    props.dark
      ? transparentizeColor('white', 0.6)
      : lightenColor('darkGray', 0.25)};
  font-weight: 500;
  font-size: 1.66rem;
  padding-left: 0.5rem;
  /* display: block; */
  line-height: 1.4;
  letter-spacing: 0.04rem;
  text-decoration: none;

  &:hover {
    color: ${props => (props.dark ? '#fff' : getColor('brand'))};
  }

  @media screen and (min-width: 35rem) {
    padding-left: 3.5rem;
  }
`

const Image = styled.img`
  width: 9rem;
  padding: 0.8rem 0 0 0.67rem;
`
