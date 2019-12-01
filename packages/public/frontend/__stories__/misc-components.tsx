import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'

import { Anchor, Box } from 'grommet'

import { Heading } from '../src/heading.component'
import { Breadcrumb } from '../src/breadcrumb.component'
import { Icon } from '../src/icon.component'
import { FeaturedContentBox } from '../src/taxonomy/featuredcontentbox'

import Logo from '../src/logo.component'
import Subjects from '../src/landing/subjects'

import { EditBox } from '../src/editbox.component'
import { EditorTools } from '../src/editortools.component'

import { SecondaryMenu } from '../src/secondarymenu.component'
import { MacroLayout } from '../src/macrolayout.component'

storiesOf('Misc Components', module)
  .add('Brand', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Box pad="medium" background="brand">
        <Logo subline="Super good Serlo Slogan" dark />
      </Box>
    </Provider>
  ))
  .add('Landing: Subjects', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Subjects />
    </Provider>
  ))
  .add('Edit Box', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <MacroLayout
        main={
          <StyledContent pad="medium" style={{ opacity: 1 }}>
            <Heading level={1} icon={'faNewspaper'}>
              Example Content
            </Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
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

      <EditBox />
    </Provider>
  ))

  .add('Editor Tools', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <MacroLayout
        main={
          <StyledContent pad="medium" style={{ opacity: 1 }}>
            <Heading level={1} icon={'faNewspaper'}>
              Example Content
            </Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
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

      <EditorTools />
    </Provider>
  ))

  .add('Breadcrumb / Back to Taxonomy', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <MacroLayout
        main={
          <StyledContent pad="medium" alignSelf="center" style={{ opacity: 1 }}>
            <Breadcrumb />

            <Heading level={1} icon="faNewspaper">
              Example Content
            </Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
            </p>

            <Heading level={2}>Zusammenfassung</Heading>
            <p>
              Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand
              rr zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die
              folgenden Formeln kennen:
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
    </Provider>
  ))
  .add('IconTest', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Box direction="row-responsive" pad="large" justify="center">
        <Icon icon="faCog" size="2x" />
        <Icon icon="faFacebookSquare" size="2x" />
      </Box>
    </Provider>
  ))

  .add('Secondary Menu', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
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
    </Provider>
  ))

  .add('RelatedContent WIP', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <FeaturedContentBox />
    </Provider>
  ))

const StyledContent = styled(Box)`
  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }
`
