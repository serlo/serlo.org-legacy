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
import { FooterProps } from '../src/footer'

export const serloSlogan = 'Die freie Lernplattform'

export const topNavLinks = [
  { title: 'Über Serlo', url: '#', icon: 'faInfoCircle' },
  { title: 'Mitmachen', url: '#', icon: 'faUserEdit' },
  { title: 'Anmelden', url: '#', icon: 'faUserCircle' },
  { title: 'Registrieren', url: '#', icon: 'faUserPlus' },
  // {
  //   title: 'Anmelden',
  //   url: '#',
  //   icon: 'faUserCircle',
  //   children: [
  //     { title: 'Dein Account', url: '#' },
  //     { title: 'Neu registrieren', url: '#' }
  //   ]
  // },
  { title: '', class: 'seperator' },
  {
    title: 'Fächer',
    url: '#',
    icon: 'faGraduationCap',
    children: [
      { title: 'Mathematik', url: '#' },
      { title: 'Biologie', url: '#' },
      { title: 'Angewandte Nachhaltigkeit', url: '#' },
      { title: 'Informatik', url: '#' },
      { title: 'Chemie', url: '#' },
      { title: 'Physik', url: '#' },
      { title: 'Fächer im Aufbau', url: '#' }
    ]
  },
  { title: 'Spenden', url: '#', class: 'donate', icon: 'faHandHoldingHeart' }
]

export const footerNavEntries = [
  {
    title: 'Allgemein',
    children: [
      { title: 'Über Serlo', url: '/serlo' },
      { title: 'Mitmachen', url: '/mitmachen' },
      { title: 'Spenden', url: '/spenden' },
      { title: 'Presse', url: '/presse' },
      { title: 'Kontakt', url: '/kontakt' },
      { title: 'Serlo in anderen Sprachen', url: '/93321' },
      { title: 'API', url: '/105250' }
    ]
  },
  {
    title: 'Fächer',
    children: [
      { title: 'Mathematik', url: '/mathe' },
      { title: 'Biologie', url: '/biologie' },
      { title: 'Angewandte Nachhaltigkeit', url: '/nachhaltigkeit' },
      { title: 'Fächer im Aufbau', url: '/neue-faecher' }
    ]
  },
  {
    title: 'Dabei bleiben',
    children: [
      {
        title: 'Newsletter',
        url:
          'https://serlo.us7.list-manage.com/subscribe?u=23f4b04bf70ea485a766e532d&amp;id=a7bb2bbc4f',
        icon: 'faEnvelope'
      },
      {
        title: 'Facebook',
        url: 'https://www.facebook.com/serlo.org',
        icon: 'faFacebookSquare'
      },
      {
        title: 'Twitter',
        url: 'https://twitter.com/de_serlo',
        icon: 'faTwitterSquare'
      },
      {
        title: 'Github',
        url: 'https://github.com/',
        icon: 'faGithubSquare'
      }
    ]
  },
  {
    title: 'Rechtlich',
    children: [
      { title: 'Datenschutz', url: '/datenschutz' },
      {
        title: 'Nutzungsbedingungen und Urheberrecht',
        url: '/nutzungsbedingungen'
      },
      { title: 'Impressum', url: '/impressum' },
      {
        title: 'Diese Plattform basiert auf Open Source Technologie von ORY.',
        url: 'https://www.ory.am/'
      }
    ]
  }
]

export const exampleFooterProps: FooterProps = {
  slogan: serloSlogan,
  missionStatementTitle: 'Serlo.org ist die Wiki für das Lernen.',
  missionStatement:
    'Wir sind eine bunte Gemeinschaft, die daran arbeitet, hochwertige Bildung weltweit frei verfügbar zu machen.',
  learnMoreLink: {
    title: 'Mehr erfahren',
    url: '/serlo'
  },
  participateLink: {
    title: 'Mitmachen',
    url: '/mitmachen'
  },
  donateLink: {
    title: 'Spenden',
    url: '/donate'
  },
  navEntries: footerNavEntries
}
