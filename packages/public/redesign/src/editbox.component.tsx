import * as React from 'react'
import styled from 'styled-components'
import { Button, DropButton } from './button.component'
import { Box } from 'grommet'
import ShareModal from './sharemodal.component'

import {
  getColor,
  getDefaultTransition,
  lightenColor,
  getBreakpoint
} from './provider.component'
import { useScrollYPosition } from 'react-use-scroll-position'

const { useRef } = React

export const EditBox: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = props => {
  const scrollY = useScrollYPosition()
  //TODO: Hack, components needs real height value of footer component
  const minSpaceToBottom =
    document.documentElement.scrollHeight < 1800 ? 0 : 1800
  const posIsFixed =
    scrollY > document.documentElement.scrollHeight - minSpaceToBottom
      ? false
      : true

  const modalRef = useRef()

  return (
    <React.Fragment>
      <Summary isFixed={posIsFixed} minSpaceToBottom={minSpaceToBottom}>
        {/* Bearbeitungen: <b>5</b> */}
        <div>
          <ShareModal ref={modalRef}></ShareModal>
          <SummaryButton
            label="Inhalt bearbeiten"
            iconName="faPencilAlt"
            fontColor={getColor('brandGreen')}
            backgroundColor="transparent"
            activeBackgroundColor={getColor('brandGreen')}
            size={0.8}
          />
          <SummaryButton
            label="Teilen!"
            iconName="faShareAlt"
            fontColor={getColor('brandGreen')}
            backgroundColor="transparent"
            activeBackgroundColor={getColor('brandGreen')}
            size={0.8}
            onClick={() => modalRef.current.openModal()}
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
          />
        </div>
      </Summary>
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

const ModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

const SummaryButton = styled(Button)`
  margin-left: -0.3em;
  svg {
    width: 1em !important;
    height: 1em !important;
  }
`

const SummaryDropButton = styled(DropButton)`
  display: none;
  margin-left: -0.3em;
  svg {
    width: 1em !important;
    height: 1em !important;
  }
`

interface SummaryProps {
  isFixed: boolean
  minSpaceToBottom: number
}

const Summary = styled.nav<SummaryProps>`
  display: none;

  @media screen and (min-width: ${getBreakpoint('md')}) {
    display: block;
    position: ${props => (props.isFixed ? 'fixed' : 'absolute')};
    right: 2rem;
    bottom: ${props => (props.isFixed ? '2rem' : 'auto')};
      /*props.minSpaceToBottom + 'px'*/
    margin-top: ${props => (props.isFixed ? '0' : '-8rem')};


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
