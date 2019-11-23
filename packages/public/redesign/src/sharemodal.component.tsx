import * as React from 'react'
import styled from 'styled-components'
import { Button } from './button.component'
import Modal from 'react-modal'
const { forwardRef, useImperativeHandle } = React

import {
  getColor,
  getDefaultTransition,
  lightenColor,
  getBreakpoint,
  transparentizeColor
} from './provider.component'

Modal.setAppElement('#root')

interface Props {
  // isOpen: boolean
}

const ShareModal: React.FunctionComponent<
  React.HTMLAttributes<HTMLDivElement>
> = forwardRef((props, ref) => {
  const [modalIsOpen, setIsOpen] = React.useState(false)

  useImperativeHandle(ref, () => ({
    openModal() {
      setIsOpen(true)
    }
  }))

  function afterOpenModal() {}
  
  function closeModal() {
    setIsOpen(false)
  }

  const handleFocus = event => event.target.select()
  const [copySuccess, setCopySuccess] = React.useState('')
  const shareInputRef = React.useRef(null)

  function copyToClipboard(e) {
    shareInputRef.current.select()
    document.execCommand('copy')
    e.target.focus()
    setCopySuccess('Copied!')
  }

  const urlEncoded = encodeURIComponent(window.location.href)
  const titleEncoded = encodeURIComponent(document.title)

  const socialShare = [
    {
      title: 'E-Mail',
      icon: 'faEnvelope',
      href: `mailto:?subject=${titleEncoded}&body=${encodeURIComponent(
        document.title + '\n' + window.location.href
      )}`
    },
    {
      title: 'Facebook',
      icon: 'faFacebookSquare',
      href: `https://www.facebook.com/sharer.php?u=${urlEncoded}`
    },
    {
      title: 'Whatsapp',
      icon: 'faWhatsappSquare',
      href: `whatsapp://send?text=${encodeURIComponent(
        document.title + ': ' + window.location.href
      )}`
    }
  ]

  const lmsShare = [
    {
      title: 'Google Classroom',
      icon: 'faGoogle',
      href: `https://classroom.google.com/u/0/share?url=${urlEncoded}&title=${titleEncoded}&body=`
    },
    {
      title: 'Mebis',
      icon: 'faCompass',
      href: 'https://www.facebook.com/sharer.php?u={url}'
    }
  ]

  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={ModalStyles}
      contentLabel="Example Modal"
    >
      <h2>Yeah Teilen!</h2>
      <p>
        <ShareInput
          ref={shareInputRef}
          onFocus={handleFocus}
          value={window.location.href}
        />{' '}
        {document.queryCommandSupported('copy') && (
          <Button
            label="Copy"
            iconName="faCopy"
            fontColor={getColor('brandGreen')}
            backgroundColor="transparent"
            activeBackgroundColor={getColor('brandGreen')}
            size={1}
            onClick={copyToClipboard}
          />
        )}{' '}
        <br />
        <Gray>{copySuccess}&nbsp;</Gray>
      </p>
      <p>{buildButtons(socialShare)} </p>
      <p>{buildButtons(lmsShare)} </p>
      {/* <ModalFooter>Site ID: asdasd</ModalFooter> */}
    </Modal>
  )
})

function buildButtons(hosts) {
  let result = hosts.map(function(host) {
    return (
      <React.Fragment>
        <Button
          label={host.title}
          iconName={host.icon}
          fontColor={getColor('brandGreen')}
          backgroundColor="transparent"
          activeBackgroundColor={getColor('brandGreen')}
          size={1.1}
          href={host.href}
          target="_blank"
          rel="noopener"
        />{' '}
      </React.Fragment>
    )
  })

  return result
}

export default ShareModal

const ModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '30rem',
    borderRadius: '1.1rem'
  }
}

const Gray = styled.small`
  opacity: 0.6;
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
  display: block;
`

// const ModalFooter = styled.footer`
//   margin-top: 3rem;
//   font-size: 0.8rem;
//   opacity: 0.6;
// `

const ShareInput = styled.input`
  border-radius: 1.1rem;
  border: 0;
  padding: 0.36rem;
  width: 15rem;
  /* margin-bottom: 1.5rem; */

  background-color: ${lightenColor('brandGreen', 0.45)};
`
