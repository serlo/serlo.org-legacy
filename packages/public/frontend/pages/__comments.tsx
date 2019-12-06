import { Provider, GlobalStyle } from '../src/provider.component'
import axios from 'axios'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
import { UserContext, EntityContext } from '../src/context'
import { Comments } from '../src/comments'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

import Cookies from 'js-cookie'

function getCsrfToken(): string {
    return Cookies.get('CSRF') as string
}

export default function Index(props) {
  console.log(props)
  const data = props.threads.map(thread => {
    return {
      ...thread,
      body: thread.comments[0].content,
      timestamp: new Date(thread.comments[0].created_at),
      author: thread.comments[0].author,
      children: thread.comments
        .map(comment => {
          return {
            ...comment,
            body: comment.content,
            timestamp: new Date(thread.comments[0].created_at)
          }
        })
        .slice(1)
    }
  })
  return (
    <EntityContext.Provider value={{ entity: { id: props.entity_id, label: 'LABEL' } }}>
      <Provider>
        <Normalize />
        <GlobalStyle />
        <Comments
          data={data}
          onSendComment={(params: any) => {
              console.log(params)
            axios.post(`/discussion/start/${props.entity_id}`, {
                content: params.body,
                csrf: getCsrfToken(),
            }, {
                headers: {
                    'X-Requested-with': 'XMLHttpRequest'
                }
            }).then(({ data }) => {
              console.log(data)
            })
          }}
        />
      </Provider>
    </EntityContext.Provider>
  )
}

Index.getInitialProps = async ({ req, res }: { req: any; res: any }) => {
  return await handleBody(req, res, { threads: [], entity_id: '123' })
}
