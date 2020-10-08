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
import bodyParser from 'body-parser'
import createApp from 'express'

import { render } from './render'

const { version } = require('../package.json')

const app = createApp()

app.use(bodyParser.json())

app.post('/', (req: { body: { state: string; language: string } }, res) => {
  render({ state: req.body.state, language: req.body.language })
    .then((html) => {
      console.log('request successful')
      res.status(200).send({ html })
    })
    .catch((err) => {
      console.log('request failed', err)
      res.sendStatus(500)
    })
})

app.get('/', (_req, res) => {
  res.status(200).send(`editor-renderer@${version}`)
})

app.listen(3000, () => {
  console.log(`editor-renderer@${version} listening...`)
})
