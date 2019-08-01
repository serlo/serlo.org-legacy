import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Header } from '../src/header'
import { SearchInput } from '../src/header/searchinput'
import { Footer } from '../src/footer'
import { Nav } from '../src/footer/nav'
import { MobileMenuButton } from '../src/header/mobilemenubutton'
import { EditBox } from '../src/editbox.component'
import { Comments } from '../src/comments'
import { Course } from '../src/course.component'
import { UserContext, EntityContext } from '../src/context'

// import { Icon } from '../src/icon.component'
import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import { Box, Anchor } from 'grommet'
import { Heading } from '../src/heading.component'
import { Breadcrumb } from '../src/breadcrumb.component'
import { MacroLayout } from '../src/macrolayout.component'

import { topNavLinks, footerNavEntries, serloSlogan } from './dummycontent'

storiesOf('Header', module)
  .add('SearchInput', () => {
    return (
      <Provider>
        <Normalize />
        <GlobalStyle />
        <div
          style={{
            backgroundColor: '#007ec1',
            padding: '3rem',
            height: '15rem'
          }}
        >
          <SearchInput />
        </div>
      </Provider>
    )
  })
  .add('Mobile Menu Button', () => {
    return (
      <Provider>
        <Normalize />
        <GlobalStyle />
        <div
          style={{
            backgroundColor: '#007ec1',
            padding: '3rem',
            height: '15rem'
          }}
        >
          <div style={{ position: 'relative' }}>
            <MobileMenuButton open={false} />
          </div>
          <div style={{ position: 'relative', top: '2rem' }}>
            <MobileMenuButton open={true} />
          </div>
        </div>
      </Provider>
    )
  })
  .add('All', () => {
    return (
      <Provider>
        <Normalize />
        <GlobalStyle />
        <Header links={topNavLinks} slogan={serloSlogan}/>
      </Provider>
    )
  })

storiesOf('Footer', module)
  .add('complete', () => {
    return (
      <Provider>
        <Normalize />
        <GlobalStyle />
        <Footer navEntries={footerNavEntries} slogan={serloSlogan} />
      </Provider>
    )
  })
  .add('only nav', () => {
    return (
      <Provider>
        <Normalize />
        <GlobalStyle />
        <footer>
          <Nav navEntries={footerNavEntries} />
        </footer>
      </Provider>
    )
  })

storiesOf('Example Page', module).add('test', () => {
  return (
    <UserContext.Provider value={{ user: { id: '1', username: 'aeneas' } }}>
      <EntityContext.Provider
        value={{ entity: { id: '1234', label: 'Aufgabe' } }}
      >
        <Provider>
          <Normalize />
          <GlobalStyle />
          <Header links={topNavLinks}  slogan={serloSlogan}/>
          <MacroLayout
            main={
              <StyledContent pad="medium" style={{ opacity: 1 }}>
                <Breadcrumb />
                <Heading level={1} icon="faNewspaper">
                  Example Content
                </Heading>
                <p>
                  Ein Kreis beschreibt die Menge aller Punkte, die denselben
                  Abstand rr zum Mittelpunkt MM besitzen. In diesem Artikel
                  lernst du die folgenden Formeln kennen:
                </p>

                <Heading level={2}>Zusammenfassung</Heading>
                <p>
                  Ein Kreis beschreibt die Menge aller Punkte, die denselben
                  Abstand rr zum Mittelpunkt MM besitzen. In diesem Artikel
                  lernst du die folgenden Formeln kennen:
                </p>

                <Heading level={2}>Zusammenfassung</Heading>
                <p>
                  Ein Kreis beschreibt die Menge aller Punkte, die denselben
                  Abstand rr zum Mittelpunkt MM besitzen. In diesem Artikel
                  lernst du die folgenden Formeln kennen:
                </p>

                <Heading level={2}>Zusammenfassung</Heading>
                <p>
                  Ein Kreis beschreibt die Menge aller Punkte, die denselben
                  Abstand rr zum Mittelpunkt MM besitzen. In diesem Artikel
                  lernst du die folgenden Formeln kennen:
                </p>

                <Heading level={2}>Zusammenfassung</Heading>
                <p>
                  Ein Kreis beschreibt die Menge aller Punkte, die denselben
                  Abstand rr zum Mittelpunkt MM besitzen. In diesem Artikel
                  lernst du die folgenden Formeln kennen:
                </p>
                <p>
                  Den <Anchor href="/36162">Umfang</Anchor> erhältst du durch
                  Abrollen des <Anchor href="/36162">Kreises</Anchor>
                  und messen der abgerollten{' '}
                  <Anchor href="https://de.serlo.org/mathe/geometrie/grundbegriffe/geraden-strecken-halbgeraden/strecke">
                    Strecke
                  </Anchor>
                  . Auf diese Weise kannst du die{' '}
                  <Anchor href="/2107">Kreiszahl</Anchor> <b>π</b> definieren.
                </p>
                <p>
                  In der Abbildung rechts siehst du, wie ein Kreis mit{' '}
                  <Anchor href="/36162">Durchmesser</Anchor>
                  <b>d=1</b> abgerollt wird.
                </p>
                <p>
                  Sein Umfang beträgt
                  <b>π</b>, also etwa <b>3,14</b>
                </p>
                <p>Für den Umfang findest du so den folgenden Zusammenhang: </p>
                <p>
                  <b>U=2⋅r⋅π=d⋅π</b>
                </p>
              </StyledContent>
            }
          />
          <MacroLayout
            main={
              <Comments
                data={[
                  {
                    id: '1',
                    body: `
               Hallo Serlo-Team,

               die erste Aufgabe im Subtraktionsblock hat ein Eingabefeld, der die Message "Type Answer" anzeigt. Außerdem wird das Feedback auch auf Englisch angezeigt ( = "wrong.")
               Wie kann man solche Stellen bearbeiten?

               Liebe Grüße
               Sebastian
             `,
                    author: {
                      id: '12345',
                      username: 'SebSoGa'
                    },
                    timestamp: new Date(),
                    children: [
                      {
                        id: '2',
                        body: `
                   Du kannst nicht diese Stelle allein bearbeiten. Das muss allgemein bei diesen Typen von Aufgaben geändert werden. Ich weiß gerade nur nicht wo und ob es jeder kann. Evtl. wurde es schon geändert... Kannst du mal bei Benni/Simon diesbezüglich nachfragen?

                   LG,
                   Nish
                 `,
                        author: {
                          id: '54321',
                          username: 'Nish'
                        },
                        timestamp: new Date()
                      },
                      {
                        id: '3',
                        body: `
                   Du kannst nicht diese Stelle allein bearbeiten. Das muss allgemein bei diesen Typen von Aufgaben geändert werden. Ich weiß gerade nur nicht wo und ob es jeder kann. Evtl. wurde es schon geändert... Kannst du mal bei Benni/Simon diesbezüglich nachfragen?

                   LG,
                   Nish
                 `,
                        author: {
                          id: '54321',
                          username: 'Nish'
                        },
                        timestamp: new Date()
                      }
                    ],
                    entity: { id: '1234', label: 'Aufgaben' }
                  },
                  {
                    id: '4',
                    body: `
               Hallo Serlo-Team,

               die erste Aufgabe im Subtraktionsblock hat ein Eingabefeld, der die Message "Type Answer" anzeigt. Außerdem wird das Feedback auch auf Englisch angezeigt ( = "wrong.")
               Wie kann man solche Stellen bearbeiten?

               Liebe Grüße
               Sebastian
             `,
                    author: {
                      id: '12345',
                      username: 'SebSoGa'
                    },
                    timestamp: new Date('October 13, 2014 11:13:00'),
                    children: [
                      {
                        id: '5',
                        body: `
                   Du kannst nicht diese Stelle allein bearbeiten. Das muss allgemein bei diesen Typen von Aufgaben geändert werden. Ich weiß gerade nur nicht wo und ob es jeder kann. Evtl. wurde es schon geändert... Kannst du mal bei Benni/Simon diesbezüglich nachfragen?

                   LG,
                   Nish
                 `,
                        author: {
                          id: '54321',
                          username: 'Nish'
                        },
                        timestamp: new Date(2018, 4, 21, 3, 23, 34)
                      }
                    ],
                    entity: { id: '12345', label: 'Aufgaben2' }
                  }
                ]}
                onSendComment={(params: any) => console.log(params)}
              />
            }
          />
          <EditBox />

          <Footer navEntries={footerNavEntries} slogan={serloSlogan} />
        </Provider>
      </EntityContext.Provider>
    </UserContext.Provider>
  )
})

storiesOf('Comments', module).add('default', () => {
  return (
    <UserContext.Provider value={{ user: { id: '1', username: 'aeneas' } }}>
      <EntityContext.Provider
        value={{ entity: { id: '1234', label: 'Aufgabe' } }}
      >
        <Provider>
          <Normalize />
          <GlobalStyle />
          <Comments
            data={[
              {
                id: '1',
                body: `
              Hallo Serlo-Team,

              die erste Aufgabe im Subtraktionsblock hat ein Eingabefeld, der die Message "Type Answer" anzeigt. Außerdem wird das Feedback auch auf Englisch angezeigt ( = "wrong.")
              Wie kann man solche Stellen bearbeiten?

              Liebe Grüße
              Sebastian
            `,
                author: {
                  id: '12345',
                  username: 'SebSoGa'
                },
                timestamp: new Date(),
                children: [
                  {
                    id: '2',
                    body: `
                  Du kannst nicht diese Stelle allein bearbeiten. Das muss allgemein bei diesen Typen von Aufgaben geändert werden. Ich weiß gerade nur nicht wo und ob es jeder kann. Evtl. wurde es schon geändert... Kannst du mal bei Benni/Simon diesbezüglich nachfragen?

                  LG,
                  Nish
                `,
                    author: {
                      id: '54321',
                      username: 'Nish'
                    },
                    timestamp: new Date()
                  },
                  {
                    id: '3',
                    body: `
                  Du kannst nicht diese Stelle allein bearbeiten. Das muss allgemein bei diesen Typen von Aufgaben geändert werden. Ich weiß gerade nur nicht wo und ob es jeder kann. Evtl. wurde es schon geändert... Kannst du mal bei Benni/Simon diesbezüglich nachfragen?

                  LG,
                  Nish
                `,
                    author: {
                      id: '54321',
                      username: 'Nish'
                    },
                    timestamp: new Date()
                  }
                ],
                entity: { id: '1234', label: 'Aufgaben' }
              },
              {
                id: '4',
                body: `
              Hallo Serlo-Team,

              die erste Aufgabe im Subtraktionsblock hat ein Eingabefeld, der die Message "Type Answer" anzeigt. Außerdem wird das Feedback auch auf Englisch angezeigt ( = "wrong.")
              Wie kann man solche Stellen bearbeiten?

              Liebe Grüße
              Sebastian
            `,
                author: {
                  id: '12345',
                  username: 'SebSoGa'
                },
                timestamp: new Date('October 13, 2014 11:13:00'),
                children: [
                  {
                    id: '5',
                    body: `
                  Du kannst nicht diese Stelle allein bearbeiten. Das muss allgemein bei diesen Typen von Aufgaben geändert werden. Ich weiß gerade nur nicht wo und ob es jeder kann. Evtl. wurde es schon geändert... Kannst du mal bei Benni/Simon diesbezüglich nachfragen?

                  LG,
                  Nish
                `,
                    author: {
                      id: '54321',
                      username: 'Nish'
                    },
                    timestamp: new Date(2018, 4, 21, 3, 23, 34)
                  }
                ],
                entity: { id: '12345', label: 'Aufgaben2' }
              }
            ]}
            onSendComment={(params: any) => console.log(params)}
          />
        </Provider>
      </EntityContext.Provider>
    </UserContext.Provider>
  )
})

storiesOf('Courses', module).add('Course Overview', () => (
  <Provider>
    <Normalize />
    <GlobalStyle />
    <div style={{ height: 30 }} />
    <Course
      courseTitle="Einführung des Prozentzeichens und seiner Umrechnung"
      pages={[
        'Übersicht',
        'Prozente aus dem Alltag',
        'Prozent - Eine neue Zahldarstellung',
        'Prozentzahlen über 100%',
        'Umformungen von Prozentzahlen und Dezimalzahlen',
        'Übungsaufgaben zur Umrechnung von Prozentzahlen und Dezimalzahlen',
        'Umrechnungen von Prozentzahlen und Bruchzahlen',
        'Übungsaufgaben zur Umrechnung von Prozentzahlen und Bruchzahlen',
        'Vorstellungen zu Prozenten und Brüchen',
        'Grafische Veranschaulichung',
        'Grafische Veranschaulichung - Übungsaufgaben',
        'Zusammenfassung',
        'Zeig, was du kannst!'
      ]}
      currentPage={2}
    >
      <p>
        Das Prozentzeichen ist aus vielen Situationen bekannt. Häufig findet man
        es im Supermarkt, bei Wahlergebnissen, auf Lebensmitteln und bei vielem
        mehr. Bei einigen Prozentangaben weiß man sofort, was gemeint ist,
        wohingegen man sich zu anderen Prozentangaben weniger vorstellen kann.
      </p>

      <Heading level={2}>Beispiele</Heading>
      <p>
        Beim Elfmeterschießen berichten Fußballkommentatoren oft von sogenannten
        Trefferquoten. Ein guter Elfmeterschütze hat zum Beispiel eine
        Trefferquote von 90%.
      </p>
    </Course>
  </Provider>
))

const StyledContent = styled(Box)`
  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }
`

storiesOf('Layout', module).add('Macro Layout', () => (
  <Provider>
    <Normalize />
    <GlobalStyle />
    <MacroLayout
      main={
        <div
          style={{
            backgroundColor: 'yellow',
            minHeight: 400
          }}
        >
          <h1 style={{ margin: 0, paddingTop: '0.5rem' }}>
            Das hier ist der Hauptinhalt
          </h1>
          <p>Bla bla bla</p>
        </div>
      }
      aside={
        <div style={{ backgroundColor: 'grey', minHeight: 400 }}>
          <h2 style={{ margin: 0 }}>Zusätzliche Spalte</h2>
          <p>Bla bla bla</p>
        </div>
      }
      nav={
        <div style={{ backgroundColor: 'lightblue', minHeight: 400 }}>
          <h3 style={{ margin: 0 }}>Navigationsspalte</h3>
          <p>Bla bla bla</p>
        </div>
      }
    />
  </Provider>
))
