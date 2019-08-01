import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'

import { UserContext, EntityContext } from '../src/context'

import {
  topNavLinks,
  footerNavEntries,
  serloSlogan
} from '../__stories__/dummycontent'
import { Heading } from '../src/heading.component'
import { Breadcrumb } from '../src/breadcrumb.component'
import { MacroLayout } from '../src/macrolayout.component'
import { Header } from '../src/header'

import { Anchor, Box } from 'grommet'
import styled from 'styled-components'

import { Comments } from '../src/comments'

import { EditBox } from '../src/editbox.component'
import { EditorTools } from '../src/editortools.component'

import { Footer } from '../src/footer'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { Course } from '../src/course.component'
import { SecondaryMenu } from '../src/secondarymenu.component'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

const StyledContent = styled(Box)`
  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }
`

export default function Index() {
  return (
    <UserContext.Provider value={{ user: { id: '1', username: 'aeneas' } }}>
      <EntityContext.Provider
        value={{ entity: { id: '1234', label: 'Aufgabe' } }}
      >
        <Provider>
          <Normalize />
          <GlobalStyle />
          <Header links={topNavLinks} slogan={serloSlogan} />
          <EditorTools />
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
                  Sein Umfang beträgt <b>π</b>, also etwa <b>3,14</b>
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
          <hr />
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
              Das Prozentzeichen ist aus vielen Situationen bekannt. Häufig
              findet man es im Supermarkt, bei Wahlergebnissen, auf
              Lebensmitteln und bei vielem mehr. Bei einigen Prozentangaben weiß
              man sofort, was gemeint ist, wohingegen man sich zu anderen
              Prozentangaben weniger vorstellen kann.
            </p>

            <Heading level={2}>Beispiele</Heading>
            <p>
              Beim Elfmeterschießen berichten Fußballkommentatoren oft von
              sogenannten Trefferquoten. Ein guter Elfmeterschütze hat zum
              Beispiel eine Trefferquote von 90%.
            </p>
          </Course>
          <hr />

          <Box margin="small">
            <SecondaryMenu
              entries={[
                'Über Serlo',
                'Lernen und Qualität',
                'Wirkung',
                'Transparenz',
                'Team',
                'Partner und Förderer',
                'Die Geschichte von Serlo',
                'Testimonials',
                'Presse',
                'Trägerverein',
                'Spenden'
              ]}
              selectedIndex={4}
            />
          </Box>

          <EditBox />

          <Footer navEntries={footerNavEntries} slogan={serloSlogan} />
        </Provider>
      </EntityContext.Provider>
    </UserContext.Provider>
  )
}
