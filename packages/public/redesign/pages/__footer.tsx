import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'

import { footerNavEntries } from '../__stories__/dummycontent'

import { Footer } from '../src/footer'

import * as bodyParser from 'body-parser'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

export default function Index(props: any) {
  return (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Footer navEntries={props.footerNavEntries} slogan={props.serloSlogan} />
    </Provider>
  )
}
Index.getInitialProps = async ({ req, res }: { req: any; res: any }) => {
  const props = {
    footerNavEntries,
    serloSlogan: 'Wunderschöner Slogan'
  }
  if (req && res) {
    // parsing body
    await new Promise(resolve => {
      bodyParser.json()(req, res, resolve)
    })
    const json = req.body
    console.log(json)
    // requiring valid key
    if (
      process.env.ATHENE_NEXTJS_KEY &&
      json.key === process.env.ATHENE_NEXTJS_KEY
    ) {
      if (json.footerNavEntries) {
        props.footerNavEntries = json.footerNavEntries
      }
      if (json.serloSlogan) {
        props.serloSlogan = json.serloSlogan
      }
    }
  }
  return props
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
