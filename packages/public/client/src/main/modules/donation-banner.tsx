import axios from 'axios'
import * as React from 'react'
import { render } from 'react-dom'
import styled, { createGlobalStyle } from 'styled-components'

const breakPoint = 780
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
      paddingRight: 0
    }
  }
})
const Container2 = styled.div({
  padding: '45px 10px 5px',
  maxHeight: 'calc(100vh - 20px)',
  overflowY: 'scroll',
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
  position: 'relative',
  fontSize: '17px',
  [smallScreens]: {
    width: '100%'
  }
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
  }
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

const ProgressContainer = styled.div({
  width: '100%',
  height: '50px',
  borderRadius: '4px',
  backgroundImage:
    'linear-gradient(267deg, rgba(199, 223, 56, 0.27) 50%, rgba(149, 188, 26, 0.78))',
  margin: '20px 0'
})

const BarWrapper = styled.div<ProgressBarProps>(({ percentage }) => {
  return {
    position: 'absolute',
    width: `${percentage}%`,
    height: '50px',
    display: 'flex',
    flexDirection: 'row'
  }
})

const Bar = styled.div({
  backgroundImage: 'linear-gradient(256deg, #95bc1a 91%, #82a317)',
  color: '#fff',
  lineHeight: '50px',
  textAlign: 'right',
  paddingRight: '20px',
  fontWeight: 'bold',
  flex: 1,
  borderRadius: '4px 0 0 4px'
})

const Triangle = styled.div({
  width: '0',
  height: '0',
  borderTop: '25px solid transparent',
  borderBottom: '25px solid transparent',
  borderLeft: '15px solid #95bc1a'
})

const Remaining = styled.div({
  color: '#95bc1a',
  textAlign: 'right',
  lineHeight: '50px',
  paddingRight: '20px',
  fontWeight: 'bold'
})

function DonationProgress({ data }: DonationBannerProps) {
  const progress = `${data.progress.value} €`
  const remaining = `es fehlen noch ${data.progress.max -
    data.progress.value} €`
  return (
    <ProgressContainer>
      <BarWrapper
        percentage={(data.progress.value / data.progress.max) * 100}
        title={progress}
      >
        <Bar>{progress}</Bar>
        <Triangle />
      </BarWrapper>
      <Remaining title={remaining}>{remaining}</Remaining>
    </ProgressContainer>
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

  const localStorageKey = 'donation-popup'
  const state = localStorage.getItem(localStorageKey)
  if (state === 'closed') return null
  if (!visible) return null

  const campaignId = `${data.id}-${data.group}-${
    data.authenticated ? 'user' : 'guest'
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
              <Title>
                <strong>{data.text.heading}</strong>
              </Title>
              {expanded ? (
                <>
                  <p>{data.text.body}</p>
                  <DonationProgress data={data} />
                </>
              ) : null}
            </Call>
            <Form expanded={expanded}>
              <iframe
                src={`${data.widget}?tw_rhythm=yearly&tw_campaign_id=${campaignId}`}
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
    localStorage.setItem(localStorageKey, 'closed')
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
          authenticated: div.getAttribute('data-authenticated') !== ''
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
    widget: string
    authenticated: boolean
  }
}

interface ProgressBarProps {
  percentage: number
  title: string
}
