import * as React from 'react'
import styled from 'styled-components'
import { Button, DropButton } from './button.component'
import { Box } from 'grommet'
import {
  getColor,
  getDefaultTransition,
  lightenColor,
  getBreakpoint
} from './provider.component'
import { useScrollYPosition } from 'react-use-scroll-position'

export const EditBox: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = props => {
  const scrollY = useScrollYPosition()
  const summary = scrollY > 30 ? false : true

  return (
    <React.Fragment>
      <Summary show={summary}>
        {/* Bearbeitungen: <b>5</b> */}
        <div>
          <SummaryButton
            label="Inhalt bearbeiten"
            iconName="faPencilAlt"
            fontColor={getColor('brandGreen')}
            backgroundColor="transparent"
            activeBackgroundColor={getColor('brandGreen')}
            size={0.8}
          />
          <SummaryDropButton
            dropContent={renderItems()}
            iconName="faCog"
            fontColor={getColor('brandGreen')}
            backgroundColor="transparent"
            activeBackgroundColor={getColor('brandGreen')}
            size={0.8}
            label="Weitere Funktionen"
            dropAlign={{ bottom: 'top', right: 'right' }}
            {...(!summary && { open: false })}
          />
        </div>
      </Summary>
      <StyledButton
        className={props.className}
        a11yTitle={props.title}
        plain
        iconName="faPencilAlt"
        hiddenLabel={'Artikel bearbeiten'}
        show={!summary}
        activeBackgroundColor={getColor('brandGreen')}
      />
    </React.Fragment>
  )
}

const renderItems = () => (
  <DropContent>
    <DropContentButton
      iconName="faVolumeUp"
      label="Abbonieren"
      backgroundColor="transparent"
      activeBackgroundColor={getColor('brandGreen')}
      fontColor={getColor('darkGray')}
      size={0.8}
    />
    <DropContentButton
      iconName="faHistory"
      label="Bearbeitungsverlauf"
      backgroundColor="transparent"
      activeBackgroundColor={getColor('brandGreen')}
      fontColor={getColor('darkGray')}
      size={0.8}
    />
    <DropContentButton
      iconName="faPencilAlt"
      label="Konvertieren"
      backgroundColor="transparent"
      activeBackgroundColor={getColor('brandGreen')}
      fontColor={getColor('darkGray')}
      size={0.8}
    />
    <DropContentButton
      iconName="faMapMarkerAlt"
      label="Zuweisung zu Themen und Lehrplänen bearbeiten"
      backgroundColor="transparent"
      activeBackgroundColor={getColor('brandGreen')}
      fontColor={getColor('darkGray')}
      size={0.8}
    />
    <DropContentButton
      iconName="faLink"
      label="Zugehörige Inhalte verwalten"
      backgroundColor="transparent"
      activeBackgroundColor={getColor('brandGreen')}
      fontColor={getColor('darkGray')}
      size={0.8}
    />
    <DropContentButton
      iconName="faFlag"
      label="Inhalt melden"
      backgroundColor="transparent"
      activeBackgroundColor={getColor('brandGreen')}
      fontColor={getColor('darkGray')}
      size={0.8}
    />
    <DropContentButton
      iconName="faSpinner"
      label="Verlauf"
      backgroundColor="transparent"
      activeBackgroundColor={getColor('brandGreen')}
      fontColor={getColor('darkGray')}
      size={0.8}
    />
  </DropContent>
)

const SummaryButton = styled(Button)`
  margin-left: -0.3em;
  svg {
    width: 1em !important;
    height: 1em !important;
  }
`

const SummaryDropButton = styled(DropButton)`
  margin-left: -0.3em;
  svg {
    width: 1em !important;
    height: 1em !important;
  }
`

interface SummaryProps {
  show: boolean
}

const Summary = styled.div<SummaryProps>`
  display: none;

  @media screen and (min-width: ${getBreakpoint('md')}) {
    display: block;
    position: absolute;
    bottom: 2rem;
    right: 2rem;

    font-size: 0.8rem;
    width: 10rem;
    color: ${getColor('brandGreen')};
    font-weight: bold;

    /* border-left: 0.15rem solid ${lightenColor('lightblue', 0.3)}; */
    padding: 0.2rem 0 0.2rem 0.5rem;

    > div {
      margin-bottom: 0;
    }

    /* transition: opacity 0.2s ease-in-out; */
    opacity: ${props => (props.show ? 1 : 0)};
    pointer-events: ${props => (props.show ? 'all' : 'none')};
  }
`

interface StyledButtonProps {
  show: boolean
  hiddenLabel: string
}

const StyledButton = styled(Button)<StyledButtonProps>`
  display: none;
  @media screen and (min-width: ${getBreakpoint('md')}){
    display: block;
    position: fixed;
    bottom: 4rem;
    right: 7rem;
    text-align: right;

    transition: opacity .2s ease-in-out;
    opacity: ${props => (props.show ? 1 : 0)};
    pointer-events: ${props => (props.show ? 'all' : 'none')};

    @media screen and (hover: hover) {
      &:hover {
        width: 7.5rem;
      }
      &:before {
        position: absolute;
        text-align: right;
        font-size: 0.8rem;
        line-height: 1.2;
        width: 5rem;
        left: 0;
        top: .27rem;
        content: "${props => props.hiddenLabel}";
        display: inline-block;
        color: #fff;
        transition: none;
        transition-delay: 0;
        opacity: 0;
      }

      &:hover:before {
        opacity: 1;
        transition: ${getDefaultTransition()};
        transition-delay: 0.05s;
      }
    }

    > svg {
      width: 1.3rem !important;
      height: 1.3rem !important;
      vertical-align: -0.2em;
      margin-right: .6rem;
    }
  }
`

const DropContentButton = styled(Button)`
  display: inline-block;
`

const DropContent = styled(Box)`
  background-color: ${getColor('bluewhite')};
  background-color: ${lightenColor('brandGreen', 0.45)};

  padding: 1rem 0.5rem 0.5rem 0.5rem;
  > div {
    text-align: right;
  }
`
