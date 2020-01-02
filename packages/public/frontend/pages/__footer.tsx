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
import { exampleFooterProps } from '../__stories__/dummycontent'
import { Footer, FooterProps } from '../src/footer'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

import { setAssetPrefix } from '../src/assets'

export default function Index(props) {
  setAssetPrefix(props.assetPrefix)
  return (
    <Provider>
      <Normalize />
      <GlobalStyle assetPrefix={props.assetPrefix} />
      <Footer {...props} />
    </Provider>
  )
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, exampleFooterProps)
}

/* example usage:

    $env:ATHENE_NEXTJS_KEY = "somesecretkey"

    curl
      localhost:3000/__footer
      -X POST
      -H 'Content-Type: application/json'
      -d '{
        "key": "somesecretkey",
        "footerNavEntries": [
          {
            "title": "Allgemein",
            "children": [
              {
                "title": "Über Serlo",
                "url": "/serlo"
              },
              {
                "title": "Mitmachen",
                "url": "/mitmachen"
              },
              {
                "title": "Spenden",
                "url": "/spenden"
              },
              {
                "title": "Presse",
                "url": "/presse"
              },
              {
                "title": "Kontakt",
                "url": "/kontakt"
              },
              {
                "title": "Serlo in anderen Sprachen",
                "url": "/93321"
              },
              {
                "title": "API",
                "url": "/105250"
              }
            ]
          },
          {
            "title": "Fächer",
            "children": [
              {
                "title": "Mathematik",
                "url": "/mathe"
              },
              {
                "title": "Informatik",
                "url": "/informatik"
              },
              {
                "title": "Biologie",
                "url": "/biologie"
              },
              {
                "title": "Angewandte Nachhaltigkeit",
                "url": "/nachhaltigkeit"
              },
              {
                "title": "Fächer im Aufbau",
                "url": "/neue-faecher"
              }
            ]
          },
          {
            "title": "Dabei bleiben",
            "children": [
              {
                "title": "Newsletter",
                "url": "https://serlo.us7.list-manage.com/subscribe?u=23f4b04bf70ea485a766e532d&amp;id=a7bb2bbc4f",
                "icon": "faEnvelope"
              },
              {
                "title": "Facebook",
                "url": "https://www.facebook.com/serlo.org",
                "icon": "faFacebookSquare"
              },
              {
                "title": "Twitter",
                "url": "https://twitter.com/de_serlo",
                "icon": "faTwitterSquare"
              }
            ]
          },
          {
            "title": "Rechtlich",
            "children": [
              {
                "title": "Datenschutz",
                "url": "/datenschutz"
              },
              {
                "title": "Nutzungsbedingungen und Urheberrecht",
                "url": "/nutzungsbedingungen"
              },
              {
                "title": "Impressum",
                "url": "/impressum"
              },
              {
                "title": "Diese Plattform basiert auf Open Source Technologie von ORY.",
                "url": "https://www.ory.am/"
              }
            ]
          }
        ],
        "serloSlogan": "Die freie Lernplattform",
        "missionStatement": Serlo.org ist die Wikipedia fürs Lernen.',
         learnMoreLink: { title: 'Mehr erfahren', url: '/serlo' },
         participateLink: { title: 'Mitmachen', url: '/mitmachen' },
         donateLink: { title: 'Spenden', url: '/spenden' },
      }'
*/
