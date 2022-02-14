/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { EditorProps } from '@serlo/edtr-io'
import * as React from 'react'
import { render } from 'react-dom'
import fetch from 'unfetch'

import { getCsrfToken } from '../../modules/csrf'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

export function initEntityEditor(
  props: Omit<EditorProps, 'onError' | 'onSave'>,
  element: HTMLDivElement
) {
  render(
    <DynamicComponent<React.PropsWithChildren<EditorProps>>
      load={() => {
        return import('./entity-editor').then(({ Editor }) => Editor)
      }}
      props={{
        ...props,
        getCsrfToken: getCsrfToken,
        onError: (error, context) => {
          console.log('edtr-io error', error, context)
        },
        onSave: (data) => {
          return new Promise((resolve, reject) => {
            fetch(window.location.pathname, {
              method: 'POST',
              headers: {
                'X-Requested-with': 'XMLHttpRequest',
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-From': 'legacy-serlo.org',
              },
              body: JSON.stringify(data),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  resolve()
                  window.location = data.redirect
                } else {
                  console.log(data.errors)
                  reject()
                }
              })
              .catch((value) => {
                console.log(value)
                reject(value)
              })
          })
        },
      }}
    />,
    element
  )
}

function DynamicComponent<P>({
  load,
  props,
}: {
  load: () => Promise<React.ComponentType<P>>
  props: P
}) {
  const [Component, setComponent] =
    React.useState<React.ComponentType<P> | null>(null)
  React.useEffect(() => {
    load().then((Component) => {
      // Has to be a function. Otherwise, React will interpret the Component as a change handler and try to call it.
      setComponent(() => Component)
    })
  }, [])

  if (!Component) {
    return (
      <div style={{ textAlign: 'center' }}>
        <FontAwesomeIcon icon={faSpinner as IconProp} spin size="2x" />
      </div>
    )
  }
  return <Component {...props} />
}
