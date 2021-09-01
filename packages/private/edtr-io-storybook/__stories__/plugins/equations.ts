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
import { addPluginStory } from '../helpers'
import { license } from '../fixtures'

addPluginStory({
  name: 'Equations',
  initialState: {
    id: 1337,
    license,
    title: 'Equations Tests',
    content: JSON.stringify({
      plugin: 'equations',
      state: {
        steps: [
          {
            left: 'y',
            sign: 'equals',
            right: '3x^2-18x+27',
            transform: '',
            explanation: {
              plugin: 'text',
              state: [
                {
                  type: 'p',
                  children: [
                    {
                      text:
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    },
                  ],
                },
              ],
            },
          },
          {
            left: 'y',
            sign: 'equals',
            right: '3\\left[x^2-6x+9\\right]',
            transform: ':25',
            explanation: {
              plugin: 'text',
              state: [
                {
                  type: 'p',
                  children: [{ text: 'Ergänze quadratisch' }],
                },
              ],
            },
          },
          {
            left: 'y freaking long',
            sign: 'equals',
            right: '3\\left(x-3\\right)^2',
            transform: '\\cdot \\frac{2}{3}',
            explanation: {
              plugin: 'text',
              state: [
                {
                  type: 'p',
                  children: [{ text: 'Scheitelform ablesen' }],
                },
              ],
            },
          },
          {
            left: '',
            sign: 'equals',
            right:
              '\\left(6\\cdot 12-\\frac{1}{24\\cdot 3}\\cdot 12^3\\right)-\\left(6\\cdot \\left(-12\\right)-\\frac{1}{24\\cdot 3}\\cdot \\left(-12\\right)^3\\right)',
            explanation: { plugin: 'text' },
            transform: '',
          },
        ],
      },
    }),
  },
})
