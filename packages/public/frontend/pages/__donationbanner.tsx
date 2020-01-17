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
