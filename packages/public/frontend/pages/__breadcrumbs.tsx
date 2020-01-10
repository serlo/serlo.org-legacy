/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'
import * as React from 'react'

import { Breadcrumb } from '../src/breadcrumb.component'

import * as bodyParser from 'body-parser'

export default function Index(props: any) {
  return (
    <Provider>
      <Normalize />
      <GlobalStyle />
      <Breadcrumb entries={props.entries} />
    </Provider>
  )
}
Index.getInitialProps = async ({ req, res }: { req: any; res: any }) => {
  const props = {
    entries: [
      { url: '#', label: 'Fach' },
      { url: '#', label: 'Bereich' },
      { url: '#', label: 'Thema' },
      {
        url: '#',
        label: 'Kapitel'
      }
    ]
  }
  if (req && res) {
    // parsing body
    await new Promise(resolve => {
      bodyParser.json()(req, res, resolve)
    })
    const json = req.body
    // requiring valid key
    if (
      process.env.ATHENE_NEXTJS_KEY &&
      json.key === process.env.ATHENE_NEXTJS_KEY
    ) {
      if (json.entries) {
        props.entries = json.entries
      }
    }
  }
  return props
}
