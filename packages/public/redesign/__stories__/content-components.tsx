import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { Provider, GlobalStyle, getColor } from '../src/provider.component'
import { Normalize } from 'styled-normalize'

import { Anchor, Box, Image } from 'grommet'

import { Heading } from '../src/heading.component'
import { List } from '../src/list.component'
import { Table } from '../src/table.component'
import LicenseInfo from '../src/licenseinfo.component'

import styled from 'styled-components'

storiesOf('*(Content Components for Editor)', module)
  .add('(Images)', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Box pad="medium" width="medium">
        <h3>Responsive Image (cover)</h3>
        <Image
          fit="cover"
          src="//assets.serlo.org/legacy/56d9f598ebea2_1581a51d8fbbce8e4abac1cb6793c714febe5a48.png"
        />
        <br />
        <h3>Image with caption</h3>
      </Box>
    </Provider>
  ))
  .add('Headings', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Box pad="medium">
        <b>No Icons:</b>
        <Heading level={1}>Heading level 1</Heading>
        <Heading level={2}>Heading level 2</Heading>
        <Heading level={3}>Heading level 3</Heading>
        <Heading level={4}>Heading level 4</Heading>
        <Heading level={5}>Heading level 5</Heading>
        <br />
        <br />
        <b>With icons: </b>
        <Heading level={1} icon={'faComments'}>
          Heading level 1
        </Heading>
        <Heading level={2} icon={'faComments'}>
          Heading level 2
        </Heading>
        <Heading level={3} icon={'faComments'}>
          Heading level 3
        </Heading>
        <Heading level={4} icon={'faComments'}>
          Heading level 4
        </Heading>
        <Heading level={5} icon={'faComments'}>
          Heading level 5
        </Heading>
        <br />
        <br />
        <b>Custom Color: </b>
        <Heading level={3} icon={'faComments'} color={getColor('brandGreen')}>
          Heading level 3
        </Heading>
      </Box>
    </Provider>
  ))
  .add('Links', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Box pad="medium">
        <p>
          ⚓ Hi! I'm an <Anchor href="#">Anchor</Anchor>, but you can call me{' '}
          <b>Link</b> ⚓
        </p>
      </Box>
    </Provider>
  ))
  .add('Tables', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Box pad="medium">
        <Table>
          <thead>
            <tr>
              <th>
                <p>Begriff</p>
              </th>
              <th>
                <p>Formel</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Umfang:</td>
              <td>U=2πrU=2πr</td>
            </tr>
            <tr>
              <td>Kreisfläche:</td>
              <td>A∘=πr2A∘=πr2</td>
            </tr>
            <tr>
              <td>Kreisbogenlänge:</td>
              <td>b=U⋅α360∘b=U⋅α360∘</td>
            </tr>
            <tr>
              <td>Sektorfläche:</td>
              <td>As=A∘⋅α360∘As=A∘⋅α360∘</td>
            </tr>
            <tr>
              <td>Kreisring:</td>
              <td>AKreisring=π⋅(r22–r21)AKreisring=π⋅(r22–r12)</td>
            </tr>
          </tbody>
        </Table>
      </Box>
    </Provider>
  ))

  .add('License Info', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Box pad="medium" width="large">
        <LicenseInfo
          title="Diese Inhalte stehen unter der freien CC-BY-SA 4.0 Lizenz, wenn nicht anders angeben."
          licenseURL="https://creativecommons.org/licenses/by-sa/4.0/deed.de"
          infoURL="https://de.serlo.org/license/detail/1"
          symbolURL={require('../src/img/license_ccbysa.svg')}
        />
      </Box>
    </Provider>
  ))

  .add('Lists', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Box pad="medium">
        Fancy unordered list:
        <List>
          <li>Butter / Margarine</li>
          <li>Half &amp; half</li>
          <li>Heavy cream</li>
          <li>Milk</li>
          <li>Sour cream</li>
          <li>
            Yogurt is no nice it <br /> should have two lines
          </li>
          <li>Whipped cream</li>
        </List>
      </Box>
      <Box pad="medium">
        Fancy ordered list:
        <List ordered>
          <li>Bacon / Sausage</li>
          <li>Beef</li>
          <li>Chicken</li>
          <li>Ground beef / Turkey</li>
          <li>Ham / Pork</li>
          <li>Hot dogs</li>
          <li>Lunchmet</li>
          <li>
            Multiline Turkey is the best <br /> absolute best{' '}
          </li>
          <li>Turkey</li>
          <li>Turkey</li>
          <li>Turkey</li>
        </List>
      </Box>
      <Box pad="medium">
        Fancy unstyled list:
        <List unstyled={true}>
          <li>Butter / Margarine</li>
          <li>Half &amp; half</li>
          <li>Heavy cream</li>
          <li>Milk</li>
          <li>Sour cream</li>
          <li>
            Yogurt is no nice it <br /> should have two lines
          </li>
          <li>Whipped cream</li>
        </List>
      </Box>
    </Provider>
  ))
  .add('Example Content', () => (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <StyledContent pad="medium" style={{ maxWidth: '40rem' }}>
        <Heading level={1} icon="faNewspaper">
          Berechnungen am Kreis
        </Heading>
        <p>
          Ein Kreis beschreibt die Menge aller Punkte, die denselben Abstand rr
          zum Mittelpunkt MM besitzen. In diesem Artikel lernst du die folgenden
          Formeln kennen:
        </p>
        <List>
          <li>
            <Anchor href="#bestimmungdesumfangs">Berechnung des Umfangs</Anchor>
          </li>
          <li>
            <Anchor href="#berechnungdesflcheninhalts">
              Berechnung der Kreisfläche
            </Anchor>
          </li>
          <li>
            <Anchor href="#berechnungderkreisbogenlnge">
              Berechnung der Kreisbogenlänge
            </Anchor>
          </li>
          <li>
            <Anchor href="#berechnungdersektorflche">
              Berechnung der Sektorfläche
            </Anchor>
          </li>
          <li>
            <Anchor href="#berechnungdeskreisrings">
              Berechnung des Kreisrings
            </Anchor>
          </li>
        </List>

        <Heading level={2}>Zusammenfassung</Heading>

        <Table>
          <thead>
            <tr>
              <th>
                <p>Begriff</p>
              </th>
              <th>
                <p>Formel</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Umfang:</td>
              <td>U=2πrU=2πr</td>
            </tr>
            <tr>
              <td>Kreisfläche:</td>
              <td>A∘=πr2A∘=πr2</td>
            </tr>
            <tr>
              <td>Kreisbogenlänge:</td>
              <td>b=U⋅α360∘b=U⋅α360∘</td>
            </tr>
            <tr>
              <td>Sektorfläche:</td>
              <td>As=A∘⋅α360∘As=A∘⋅α360∘</td>
            </tr>
            <tr>
              <td>Kreisring:</td>
              <td>AKreisring=π⋅(r22–r21)AKreisring=π⋅(r22–r12)</td>
            </tr>
          </tbody>
        </Table>

        <Heading level={2}>Bestimmung des Umfangs</Heading>

        <p>
          Den <Anchor href="/36162">Umfang</Anchor> erhältst du durch Abrollen
          des <Anchor href="/36162">Kreises</Anchor>
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

        <Heading level={2} icon={'faVideo'}>
          Video zur Flächenberechnung
        </Heading>
      </StyledContent>
    </Provider>
  ))

const StyledContent = styled(Box)`
  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }
`
