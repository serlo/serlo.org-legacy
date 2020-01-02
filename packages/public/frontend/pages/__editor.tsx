import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import Cookies from 'js-cookie'
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
  return Cookies.get('CSRF') as string
}

export default function Index(props) {
  if (typeof window === 'undefined') return null
  Sentry.setExtra('type', props.type)
  return (
    <Editor
      initialState={JSON.parse(props.initialState)}
      type={props.type}
      getCsrfToken={getCsrfToken}
      onError={(error, context) => {
        console.log('edtr-io error', error, context)
        Sentry.withScope(scope => {
          scope.setTag('edtr-io', 'true')
          scope.setExtras(context)
          Sentry.captureException(error)
        })
      }}
      onSave={data => {
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
      }}
    />
  )
}
Index.getInitialProps = async ({ req, res }) => {
  return await handleBody(req, res, { initialState: '', type: '' })
}
