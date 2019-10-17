import * as React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

const breakPoint = 780
const smallScreens = `@media screen and (max-width: ${breakPoint}px)`
const bigScreens = `@media screen and (min-width: ${breakPoint + 1}px)`

const Container = styled.div<{ expanded: boolean }>(({ expanded }) => {
  return {
    position: 'fixed',
    ...(expanded ? { top: '0' } : { bottom: '0' }),
    transition: 'transform .5s ease-in-out',
    zIndex: 999,
    [smallScreens]: {
      padding: '10px 10px 0'
    }
  }
})
const Container2 = styled.div({
  padding: '45px 10px 5px',
  maxHeight: 'calc(100vh - 20px)',
  overflowY: 'scroll',
  backgroundColor: '#fff',
  [bigScreens]: {
    padding: '45px 60px 5px'
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
    padding: '0 50px'
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

function DonationProgress(props: DonationBannerProps) {
  const progress = `${props.amount} Spenden`
  const remaining = `es fehlen noch ${props.goal - props.amount}`
  return (
    <ProgressContainer>
      <BarWrapper
        percentage={(props.amount / props.goal) * 100}
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
  top: '0'
})
const DonationBanner: React.FunctionComponent<DonationBannerProps> = props => {
  const [visible, setVisible] = React.useState(true)
  const [expanded, setExpanded] = React.useState(
    window.document.body.offsetWidth > breakPoint
  )

  // const localStorageKey = 'consent'

  // const consent = localStorage.getItem(localStorageKey)
  //
  // if (consent === 'closed') {
  //   return
  // }

  if (!visible) {
    return null
  }

  return (
    <>
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
              // localStorage.setItem(localStorageKey, "closed")
              setVisible(false)
            }}
          >
            X
          </Close>
          <Wrapper>
            <Call>
              <Title>
                <strong>
                  Ist Dir der Erhalt unserer hochwertigen, werbefreien und frei
                  verfügbaren Lernseite 5€ im Monat wert?
                </strong>
              </Title>
              {expanded ? (
                <>
                  <p>
                    Lieber Nutzerin / Lieber Nutzer, bitte entschuldige die
                    Störung. Serlo.org hilft einer Million jungen Menschen im
                    Monat beim lernen - kostenlos, werbefrei und ohne Anmeldung.
                    Um dieses Angebot zu ermöglichen, sind wir auf Spenden
                    angewiesen. Wir brauchen nur 500 Spender*innen, damit wir
                    unseren offenen Finanzbedarf im nächsten Jahr decken können
                    und serlo.org für alle frei verfügbar bleibt!
                  </p>
                  <DonationProgress {...props} />
                </>
              ) : null}
            </Call>
            <Form expanded={expanded}>
              <iframe
                src={`https://spenden.twingle.de/serlo-education-e-v/wkp-bannerwidget-2019/tw5da828fb550c6/widget?tw_rhythm=${props.rhythm}`}
                style={{
                  width: '100%',
                  border: 'none',
                  overflow: 'hidden',
                  height: '410px',
                  position: 'relative',
                  zIndex: 2,
                  display: 'block'
                }}
                scrolling="no"
              ></iframe>
              <script src="https://spenden.twingle.de/embed/generic"></script>
            </Form>
          </Wrapper>
        </Container2>
      </Container>
      <BlurBackground />
    </>
  )
}

export function initDonationBanner() {
  const div = window.document.getElementById('donation-banner')
  if (div) {
    const goal = div.getAttribute('data-goal')
    const amount = div.getAttribute('data-amount')
    const rhythm = div.getAttribute('data-rhythm')
    render(
      <DonationBanner
        goal={goal ? parseInt(goal, 10) : 100}
        amount={amount ? parseInt(amount, 10) : 30}
        rhythm={rhythm || 'yearly'}
      />,
      div
    )
  }
}

interface DonationBannerProps {
  goal: number
  amount: number
  rhythm: string
}

interface ProgressBarProps {
  percentage: number
  title: string
}
