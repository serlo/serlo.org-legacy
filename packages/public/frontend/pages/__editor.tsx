import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'
import { handleBody } from './_document'
import { Editor } from '../src/edtr-io'
import axios from 'axios'
import * as Sentry from '@sentry/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
// Prevent fontawesome from dynamically adding its css since we did it manually above
config.autoAddCss = false

function getCsrfToken(): string {
  return window.Cookies.get('CSRF') as string
}

export default function Index(props) {
  try {
    window
  } catch (e) {
    return null
  }
  Sentry.setExtra('type', props.type)
  return (
    <Provider>
      <Normalize />
      <GlobalStyle assetPrefix={props.assetPrefix} />
      <DynamicComponent<React.PropsWithChildren<any>>
        load={() =>
          new Promise(res => {
            res(Editor)
          })
        }
        props={{
          ...props,
          getCsrfToken: getCsrfToken,
          onError: (error, context) => {
            console.log('edtr-io error', error, context)
            Sentry.withScope(scope => {
              scope.setTag('edtr-io', 'true')
              scope.setExtras(context)
              Sentry.captureException(error)
            })
          },
          onSave: data => {
            return new Promise((resolve, reject) => {
              axios
                .post(window.location.pathname, data, {
                  headers: {
                    'X-Requested-with': 'XMLHttpRequest'
                  }
                })
                .then(value => {
                  if (value.data.success) {
                    resolve()
                    window.location = value.data.redirect
                  } else {
                    console.log(value.data.errors)
                    reject()
                  }
                })
                .catch(value => {
                  console.log(value)
                  reject(value)
                })
            })
          }
        }}
      />
    </Provider>
  )
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, { content: '', type: '' })
}

function DynamicComponent<P>({
  load,
  props
}: {
  load: () => Promise<React.ComponentType<P>>
  props: P
}) {
  const [Component, setComponent] = React.useState<React.ComponentType<
    P
  > | null>(null)
  React.useEffect(() => {
    load().then(Component => {
      // Has to be a function. Otherwise, React will interpret the Component as a change handler and try to call it.
      setComponent(() => Component)
    })
  }, [])

  if (!Component) {
    return (
      <div style={{ textAlign: 'center' }}>
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
      </div>
    )
  }
  return <Component {...props} />
}
