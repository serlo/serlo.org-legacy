/**
 * This file is part of Athene2 Assets.
 *
 * Copyright (c) 2017-2018 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2018 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/athene2-assets for the canonical source repository
 */
import { expect, expectSlate } from './common'
import markdownToSlate from '../src/markdownToSlate'

const cases = [
  {
    description: 'Transform markdown header to slate plugin',
    input: '# header',
    output: expectSlate('<h1 id="header">header</h1>')
  },
  {
    description: 'Transform bold paragraph to slate plugin',
    input: '**bold text**',
    output: expectSlate('<p><strong>bold text</strong></p>')
  }
]

cases.forEach(testcase => {
  describe('Transformes Serlo Layout to new Layout', () => {
    it(testcase.description, () => {
      expect(markdownToSlate(testcase.input), 'to equal', testcase.output)
    })
  })
})
