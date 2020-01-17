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
import { Button } from './button.component'
import Modal from 'react-modal'
import ExecutionEnvironment from 'exenv'
const { forwardRef, useImperativeHandle } = React

import {
  getColor,
  getDefaultTransition,
  lightenColor,
  getBreakpoint,
  transparentizeColor
} from './provider.component'

Modal.setAppElement('body')

interface Props {
  // isOpen: boolean
  contentID?: string
}

const ShareModal: any = forwardRef((props: Props, ref) => {
  const [modalIsOpen, setIsOpen] = React.useState(false)

  if (!ExecutionEnvironment.canUseDOM) {
    return null
  }

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
    /* TODO: Get int8 string */
  }

  const url = props.contentID
    ? `https://serlo.org/${props.contentID}`
    : 'https://serlo.org/'

  const urlEncoded = encodeURIComponent(url)
  const titleEncoded = encodeURIComponent(document.title)

  const socialShare = [
    {
      title: 'E-Mail',
      icon: 'faEnvelope',
      href: `mailto:?subject=${titleEncoded}&body=${encodeURIComponent(
        document.title + '\n' + url
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
        document.title + ': ' + url
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
      {/* TODO: Get int8 string */}

      <p>
        <ShareInput ref={shareInputRef} onFocus={handleFocus} value={url} />{' '}
        {document.queryCommandSupported('copy') && (
          <Button
            label="Copy" /* TODO: Get int8 string */
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
      <CloseButton
        onClick={closeModal}
        title="Close" /* TODO: Get int8 string */
        iconName="faTimes"
        size={0.8}
        iconColor={getColor('dark-1')}
        activeIconColor={getColor('white')}
        backgroundColor="transparent"
        // activeBackgroundColor={getColor('lightblue')}
      />
    </Modal>
  )
})

const Button_: any = Button

function buildButtons(hosts) {
  let result = hosts.map(function(host) {
    return (
      <React.Fragment>
        <Button_
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
    borderRadius: '1.1rem',
    fontFamily: 'Karmilla'
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

  &:focus {
    outline: none;
    box-shadow: 0 0 4px 0 ${getColor('brand')};
  }
`

const CloseButton = styled(Button)`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
`
