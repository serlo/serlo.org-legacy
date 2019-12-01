import * as React from 'react'
import styled from 'styled-components'
import { Col } from 'react-styled-flexboxgrid'
import { Icon } from '../icon.component'
import {
  getColor,
  getBreakpoint,
  lightenColor,
  getDefaultTransition
} from '../provider.component'

import SVG from 'react-inlinesvg'

export interface SubjectProps {
  url: string
  iconSrc: string
  text: string
}

export default class Subject extends React.Component<SubjectProps> {
  public render() {
    return (
      <SubjectCol xs={12} sm={6} lg={3}>
        <a href={this.props.url}>
          <SubjectSVG src={this.props.iconSrc} />
          <Header>
            {this.props.text}
            <SmallIcon icon="faArrowCircleRight" />
          </Header>
        </a>
      </SubjectCol>
    )
  }
}

const SubjectCol = styled(Col)`
  border-bottom: 1px solid ${getColor('lightblue')};
  padding-left: 0.5rem;

  &:hover {
    background-color: ${lightenColor('brand', 0.5)};
    cursor: pointer;
  }

  @media (min-width: ${getBreakpoint('sm')}) {
    border-bottom: 0;
    border-radius: 3rem;

    &:hover {
      background: transparent;
    }
  }

  @media (min-width: ${getBreakpoint('lg')}) {
    text-align: center;
  }

  > a {
    display: block;
  }
`

const Header = styled.h2`
  font-size: 1.5rem;
  line-height: 5.8rem;
  display: inline-block;
  padding: 0.1rem;
  vertical-align: top;
  margin-top: 1rem;
  color: ${getColor('brand')};

  @media (min-width: ${getBreakpoint('sm')}) {
    font-size: 1.5rem;
    line-height: 1.45;
    display: inline-block;
    width: auto;
    border-radius: 0.4em;
    margin-top: 2.5rem;
    transition: color 0.4s ease, background-color 0.4s ease;

    ${SubjectCol}:hover & {
      background-color: ${lightenColor('brand', 0.5)};
    }
  }

  @media (min-width: ${getBreakpoint('lg')}) {
    padding: 0.3rem 0.6rem;
    margin-top: 0;
  }
`

const SmallIcon = styled(Icon)`
  margin-left: 0.4rem;
  vertical-align: middle;

  @media (min-width: ${getBreakpoint('sm')}) {
    display: none;
  }
`

const SubjectSVG = styled(SVG)`

	.blue {
		fill: ${getColor('helperblue')};
		transition: ${getDefaultTransition()};
	}

	.green {
		fill: #becd2b;
    transition: ${getDefaultTransition()};
  }

  @media (min-width: ${getBreakpoint('sm')}) {
    .blue {
      fill: ${lightenColor('lighterblue', 0.07)};
    }
  }

  @media (min-width: ${getBreakpoint('lg')}) {
    display: block;
    margin: 0 auto;
    width: auto;
    height: auto;
  }

  /* animations */
  svg {
    width: 6rem;
    height: 6rem;
    margin-top: 1rem;
    margin-right: 1rem;
    transition: transform .4s cubic-bezier(0.175, 0.885, 0.320, 1.275);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    animation-play-state: paused;
    &.math { transition-duration: .6s; }
    &.sus path.water{
      transform: scale(0) translateY(-30px);
      transform-origin: 9% 60%;
      transition: transform .6s cubic-bezier(0.175, 0.6, 0.32, 1.275);
    }
  }

  ${SubjectCol}:hover & svg, ${SubjectCol}:focus & svg, ${SubjectCol}:active & svg {
    &.bio { animation: jump .7s ease-in-out; }
    &.abc { transform: scale(1.25) rotate(10deg); }
    &.math { transform: rotateY(-180deg) rotateX(-3deg); }
    &.sus { transform: rotate(-30deg); }
    &.sus .blue.water{ transform: scale(1.08); }

    @media (min-width: ${getBreakpoint('sm')}) {
      .blue { fill: ${getColor('helperblue')}; }
      .green { fill: #becd2b; }
    }
  }

  @keyframes jump {
    16% { transform: translateY(1rem); }
    33% { transform: translateY(-.6rem); }
    50% { transform: translateY(.4rem); }
    67% { transform: translateY(0); }
    100% { transform: translateY(0); }
  }


`
