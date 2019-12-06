import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
import { UserContext, EntityContext } from '../src/context'
import { Comments } from '../src/comments'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

export default function Index(props) {
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
            Hallo Serlo-Team ${props.exampleProp},

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
}

Index.getInitialProps = async ({ req, res }: { req: any; res: any }) => {
  return await handleBody(req, res, { exampleProp: 'lala123' })
}
