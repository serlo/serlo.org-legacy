import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
import { DonationBanner } from '../src/donation-banner.component'
import axios from 'axios'

export default function Index(props) {
  if (typeof window === 'undefined') return null
  return (
      <DonationBannerWrapper {...props} />
  )
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, { interests: '', authenticated: '' })
}

function DonationBannerWrapper(props) {
  const [data, setData] = React.useState({})
  React.useEffect(() => {
    // on mount
    const tenant = window.location.hostname.split('.')[0]
    if (!window.location.hostname.includes('localhost') && tenant !== 'de')
      return
    if (localStorage.getItem('donation-popup-donated') === '1') return

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
      return
    }
    axios
      .get('https://serlo-donation-campaign.serlo.workers.dev/', {
        withCredentials: true
      })
      .then(res => {
        setData(res.data)
      })
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
