/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import axios from 'axios'
import * as React from 'react'
import { render } from 'react-dom'
import styled, { createGlobalStyle } from 'styled-components'

const breakPoint = 1000
const smallScreens = `@media screen and (max-width: ${breakPoint}px)`
const bigScreens = `@media screen and (min-width: ${breakPoint + 1}px)`

const PreventBodyScroll = createGlobalStyle({
  body: {
    overflow: 'hidden'
  }
})

const Container = styled.div<{ expanded: boolean }>(({ expanded }) => {
  return {
    position: 'fixed',
    ...(expanded ? { top: '0' } : { bottom: '0' }),
    transition: 'transform .5s ease-in-out',
    zIndex: 999,
    [smallScreens]: {
      padding: '10px 10px 0',
      ...(expanded
        ? {
            height: '100%',
            overflow: 'scroll'
          }
        : {})
    }
  }
})
const Container2 = styled.div({
  padding: '45px 10px 5px',
  backgroundColor: '#fff',
  paddingRight: 0,
  [bigScreens]: {
    padding: '45px 60px 5px',
    paddingRight: 0,
    iframe: {
      marginTop: '-45px'
    }
  }
})

const Drawer = styled.div({
  width: '80px',
  height: '80px',
  borderRadius: '80px',
  backgroundColor: '#fff',
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%,-30px)',

  '&::after': {
    position: 'absolute',
    left: '50%',
    top: '30px',
    width: '12px',
    height: '12px',
    transform: 'translate(-50%,-100%) rotate(-45deg)',
    borderStyle: 'solid',
    borderWidth: '4px 4px 0 0',
    content: "' '",
    cursor: 'pointer'
  }
})

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  minHeight: '85px',
  [bigScreens]: {
    padding: '0 50px',
    paddingRight: 0
  }
})

const Call = styled.div({
  width: '66.7%',
  paddingRight: '30px',
  position: 'relative',
  fontSize: '17px',
  [smallScreens]: {
    width: '100%',
    paddingRight: '10px'
  }
})

const AccountWrapper = styled.div({
  fontSize: '12px'
})

const Form = styled.div<{ expanded: boolean }>(({ expanded }) => {
  return {
    display: expanded ? 'block' : 'none',
    width: '33.3%',
    position: 'relative',
    [smallScreens]: {
      width: '100%'
    }
  }
})

const Title = styled.p({
  fontSize: '21px',
  [smallScreens]: {
    fontSize: '19px'
  },
  color: '#007ec1'
})

const Logo = styled.span({
  position: 'absolute',
  top: '0',
  opacity: '0.15',
  fontSize: '100px',
  fontFamily: 'serlo',
  color: '#007ec1',
  [bigScreens]: {
    left: '15px'
  },
  [smallScreens]: {
    right: '15px',
    left: 'auto'
  }
})

const Close = styled.div({
  position: 'absolute',
  right: '20px',
  top: '20px',
  fontSize: '21px',
  fontWeight: 'bold',
  color: 'rgba(0,0,0,0.2)',
  textShadow: '0 1px 0 #fff',
  cursor: 'pointer',
  zIndex: 1000
})

const ProgressContainer = styled.div<{ desktop?: boolean; mobile?: boolean }>(
  ({ desktop, mobile }) => {
    return {
      [smallScreens]: {
        display: desktop ? 'none' : 'flex'
      },
      [bigScreens]: {
        display: mobile ? 'none' : 'flex'
      },
      width: '100%',
      height: '50px',
      borderRadius: '4px',
      backgroundImage:
        'linear-gradient(267deg, rgba(199, 223, 56, 0.27) 50%, rgba(149, 188, 26, 0.78))',
      fontSize: '14px'
    }
  }
)

const BarWrapper = styled.div<ProgressBarProps>(({ percentage }) => {
  return {
    width: `${percentage}%`,
    height: '50px',
    display: 'flex',
    flexDirection: 'row'
  }
})

const Bar = styled.div<{ center: boolean }>(({ center }) => {
  return {
    backgroundImage: 'linear-gradient(256deg, #95bc1a 91%, #82a317)',
    color: '#fff',
    lineHeight: '50px',
    paddingRight: center ? 0 : '20px',
    fontWeight: 'bold',
    flex: 1,
    borderRadius: '4px 0 0 4px',
    textAlign: center ? 'center' : 'right'
  }
})

const Triangle = styled.div({
  width: '0',
  height: '0',
  borderTop: '25px solid transparent',
  borderBottom: '25px solid transparent',
  borderLeft: '15px solid #95bc1a'
})

const Remaining = styled.div<{ center: boolean }>(({ center }) => {
  return {
    color: '#95bc1a',
    lineHeight: '50px',
    paddingRight: center ? 0 : '20px',
    fontWeight: 'bold',
    textAlign: center ? 'center' : 'right',
    flex: 1
  }
})

const GoalWrapper = styled.div({
  [bigScreens]: {
    display: 'none'
  },
  textAlign: 'right',
  fontSize: '12px'
})

function DonationProgress({ data }: DonationBannerProps) {
  const progress = `${data.progress.value.toLocaleString('de-DE')} €`
  const remaining = `${(data.progress.max - data.progress.value).toLocaleString(
    'de-DE'
  )} €`
  const remainingFull = `es fehlen noch ${remaining}`
  const percentage = (data.progress.value / data.progress.max) * 100
  return (
    <>
      <ProgressContainer mobile>
        <BarWrapper percentage={percentage} title={progress}>
          <Bar center>{percentage < 25 ? null : progress}</Bar>
          <Triangle />
        </BarWrapper>
        <Remaining title={remainingFull} center>
          {percentage > 80 ? null : remaining}
        </Remaining>
      </ProgressContainer>
      <ProgressContainer desktop>
        <BarWrapper percentage={percentage} title={progress}>
          <Bar center={percentage > 60 && percentage <= 85}>
            {percentage <= 20
              ? null
              : percentage > 85
              ? remainingFull
              : progress}
          </Bar>
          <Triangle />
        </BarWrapper>
        <Remaining title={remainingFull} center={percentage > 60}>
          {percentage > 85 ? null : percentage > 60 ? remaining : remainingFull}
        </Remaining>
      </ProgressContainer>
      <GoalWrapper>
        Spendenziel {data.progress.max.toLocaleString('de-DE')} €
      </GoalWrapper>
      <AccountWrapper>
        Spendenkonto Serlo Education e.V.:{' '}
        <strong>DE98 4306 0967 8204 5906 00</strong>{' '}
        <a href="https://www.paypal.me/serlo">via PayPal spenden</a>
      </AccountWrapper>
    </>
  )
}

const BlurBackground = styled.div({
  width: '100vw',
  height: '100vh',
  zIndex: 998,
  backgroundColor: 'rgba(100,100,100,0.6)',
  position: 'fixed',
  top: '0',
  '&:hover': {
    cursor: 'pointer'
  }
})

function DonationBanner({ data }: DonationBannerProps) {
  const [visible, setVisible] = React.useState(true)
  const [expanded, setExpanded] = React.useState(
    window.document.body.offsetWidth > breakPoint
  )

  React.useEffect(() => {
    const localStorageKey = `donation-popup/${data.id}`
    const localStorageKeyValue = localStorage.getItem(localStorageKey)
    const oldValue = localStorageKeyValue
      ? parseInt(localStorageKeyValue, 10)
      : 0
    const newValue = (oldValue + 1) % data.frequency
    localStorage.setItem(localStorageKey, `${newValue}`)
  }, [data.frequency])

  const localStorageKey = `donation-popup/${data.id}`
  const localStorageKeyValue = localStorage.getItem(localStorageKey)
  const pagesUntilNextPopup = localStorageKeyValue
    ? parseInt(localStorageKeyValue, 10)
    : 0

  if (pagesUntilNextPopup !== 0) return null
  if (!visible) return null

  const interests = data.interests || 'none'
  const campaignId = `${data.id}-${data.group}-${
    data.authenticated ? `user-${interests}` : 'guest'
  }`

  return (
    <>
      {visible ? <PreventBodyScroll /> : null}
      <Container expanded={expanded}>
        {!expanded ? (
          <Drawer
            onClick={() => {
              setExpanded(true)
            }}
          />
        ) : null}
        <Container2>
          <Logo>V</Logo>
          <Close
            onClick={() => {
              close()
            }}
          >
            X
          </Close>
          <Wrapper>
            <Call>
              <div>
                <Title>
                  <strong>{data.text.heading}</strong>
                </Title>
                {expanded ? (
                  <p dangerouslySetInnerHTML={{ __html: data.text.body }} />
                ) : null}
              </div>
              {expanded ? <DonationProgress data={data} /> : null}
            </Call>
            <Form expanded={expanded}>
              <iframe
                src={`${data.widget.url}?tw_rhythm=${data.widget.rhythm}&tw_amount=${data.widget.amount}&tw_cid=${campaignId}`}
                style={{
                  width: '100%',
                  border: 'none',
                  overflow: 'hidden',
                  height: '410px',
                  position: 'relative',
                  zIndex: 2,
                  display: 'block'
                }}
              />
              <script src="https://spenden.twingle.de/embed/generic" />
            </Form>
          </Wrapper>
        </Container2>
      </Container>
      <BlurBackground
        onClick={() => {
          close()
        }}
      />
    </>
  )

  function close() {
    setVisible(false)
  }
}

export async function initDonationBanner() {
  const { data } = await axios.get(
    'https://serlo-donation-campaign.serlo.workers.dev/',
    {
      withCredentials: true
    }
  )
  if (!data.enabled) return

  const div = window.document.getElementById('donation-banner')
  if (div) {
    render(
      <DonationBanner
        data={{
          ...data,
          authenticated: div.getAttribute('data-authenticated') !== '',
          interests: div.getAttribute('data-interests')
        }}
      />,
      div
    )
  }
}

interface DonationBannerProps {
  data: {
    id: string
    progress: {
      value: number
      max: number
    }
    group: string
    text: {
      heading: string
      body: string
    }
    widget: {
      url: string
      amount: string
      rhythm: string
    }
    authenticated: boolean
    frequency: number
    interests: string
  }
}

interface ProgressBarProps {
  percentage: number
  title: string
}
