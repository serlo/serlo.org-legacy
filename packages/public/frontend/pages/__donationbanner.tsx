import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
import { DonationBanner } from '../src/donation-banner.component'
import axios from 'axios'

const tenant = window.location.hostname.split('.')[0]

export default function Index(props) {
  try {
    window
  } catch (e) {
    return null
  }
  if (tenant !== 'de') return null
  if (localStorage.getItem('donation-popup-donated') === '1') return null

  const disabledPages = [
    '/auth/login',
    '/user/register',
    '/community',
    '/spenden',
    '/eltern',
    '/lehrkraefte'
  ]
  if (
    disabledPages.indexOf(window.location.pathname) > -1 ||
    window.location.pathname.startsWith('/page/revision/create/') ||
    window.location.pathname.startsWith('/page/revision/create-old/')
  ) {
    return null
  }
  return (
    <Provider>
      <Normalize />
      <GlobalStyle assetPrefix={props.assetPrefix} />
    </Provider>
  )
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, { interests: '', authenticated: '' })
}

function DonationBannerWrapper(props) {
  const [data, setData] = React.useState({})
  React.useEffect(() => {
    // on mount
    axios
      .get('https://serlo-donation-campaign.serlo.workers.dev/', {
        withCredentials: true
      })
      .then(data => setData(data))
  }, [])
  return (
    <DonationBanner
      data={{
        ...data,
        ...props
      }}
    />
  )
}
