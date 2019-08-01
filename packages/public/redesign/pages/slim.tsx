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

import { Box } from 'grommet'
import styled from 'styled-components'

import { Footer } from '../src/footer'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
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
              </StyledContent>
            }
          />

          <Footer navEntries={footerNavEntries} slogan={serloSlogan} />
        </Provider>
      </EntityContext.Provider>
    </UserContext.Provider>
  )
}
