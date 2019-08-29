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
