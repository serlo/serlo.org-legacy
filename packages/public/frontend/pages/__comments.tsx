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
  const [threads, setThreads] = React.useState(
    props.threads.map(thread => transformThread(thread))
  )
  return (
    <EntityContext.Provider
      value={{ entity: { id: props.entity_id, label: 'LABEL' } }}
    >
      <Provider>
        <Normalize />
        <GlobalStyle />
        <Comments
          data={threads}
          onSendComment={(params: any) => {
            const route = params.parent_id
              ? `/discussion/comment/${params.parent_id}`
              : `/discussion/start/${props.entity_id}`
            return axios
              .post(
                route,
                {
                  content: params.body,
                  csrf: getCsrfToken()
                },
                {
                  headers: {
                    'X-Requested-with': 'XMLHttpRequest'
                  }
                }
              )
              .then(({ data }) => {
                if (data['thread']) {
                  const newThread = transformThread(data['thread'])
                  setThreads(threads => [newThread, ...threads])
                } else {
                  const newComment = transformComment(data['comment'])
                  setThreads(threads => {
                    return threads.map(thread => {
                      if (thread.id === params.parent_id) {
                        return {
                          ...thread,
                          children: [...thread.children, newComment]
                        }
                      } else {
                        return { ...thread }
                      }
                    })
                  })
                }
              })
          }}
        />
      </Provider>
    </EntityContext.Provider>
  )

  function transformThread(thread) {
    return {
      ...thread,
      body: thread.comments[0].content,
      timestamp: new Date(thread.comments[0].created_at),
      author: thread.comments[0].author,
      children: thread.comments.map(transformComment).slice(1)
    }
  }
  function transformComment(comment) {
    return {
      ...comment,
      leaf: true,
      body: comment.content,
      timestamp: new Date(comment.created_at)
    }
  }
}

Index.getInitialProps = async ({ req, res }: { req: any; res: any }) => {
  return await handleBody(req, res, { threads: [], entity_id: '123' })
}
