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
import { migrateState } from '../src/20200220155526-migrate-exercises'

test('Simple real state', () => {
  const state = {
    plugin: 'rows',
    state: [
      {
        plugin: 'text',
        state: [{ type: 'p', children: [{ text: 'Einzelkindern' }] }],
      },
    ],
  }

  expect(migrateState(state)).toEqual({
    plugin: 'exercise',
    state: {
      content: {
        plugin: 'rows',
        state: [
          {
            plugin: 'text',
            state: [{ type: 'p', children: [{ text: 'Einzelkindern' }] }],
          },
        ],
      },
      interactive: undefined,
    },
  })
})

test('Real state with sc-mc-exercise', () => {
  const state = {
    plugin: 'rows',
    state: [
      {
        plugin: 'text',
        state: [
          {
            type: 'p',
            children: [
              { text: 'Wie berechnet man den FlÃ¤cheninhalt ' },
              {
                type: 'math',
                src: 'A',
                inline: true,
                children: [{ text: 'A' }],
              },
              { text: ' von einem Kreis mit Radius ' },
              {
                type: 'math',
                src: 'r',
                inline: true,
                children: [{ text: 'r' }],
              },
              { text: '?' },
            ],
          },
        ],
      },
      {
        plugin: 'scMcExercise',
        state: {
          isSingleChoice: true,
          answers: [
            {
              content: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: '' },
                      {
                        type: 'math',
                        src: 'A=\\pi \\cdot r^2',
                        inline: true,
                        children: [{ text: 'A=\\pi \\cdot r^2' }],
                      },
                      { text: '' },
                    ],
                  },
                ],
              },
              isCorrect: true,
              feedback: {
                plugin: 'text',
                state: [
                  { type: 'p', children: [{ text: 'Richtig! Sehr gut!' }] },
                ],
              },
            },
            {
              content: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: '' },
                      {
                        type: 'math',
                        src: 'A=\\pi^2 \\cdot r',
                        inline: true,
                        children: [{ text: 'A=\\pi^2 \\cdot r' }],
                      },
                      { text: '' },
                    ],
                  },
                ],
              },
              isCorrect: false,
              feedback: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: 'Fast! Aber leider trotzdem falsch. :(' },
                    ],
                  },
                ],
              },
            },
            {
              content: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: '' },
                      {
                        type: 'math',
                        src: 'A=\\dfrac{r}{2}\\cdot \\pi',
                        inline: true,
                        children: [{ text: 'A=\\dfrac{r}{2}\\cdot \\pi' }],
                      },
                      { text: '' },
                    ],
                  },
                ],
              },
              isCorrect: false,
              feedback: {
                plugin: 'text',
                state: [
                  { type: 'p', children: [{ text: 'Das ist leider falsch.' }] },
                ],
              },
            },
            {
              content: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: '' },
                      {
                        type: 'math',
                        src: 'A = 2\\cdot \\pi \\cdot r',
                        inline: true,
                        children: [{ text: 'A = 2\\cdot \\pi \\cdot r' }],
                      },
                      { text: '' },
                    ],
                  },
                ],
              },
              isCorrect: false,
              feedback: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: 'Falsch. ' },
                      {
                        type: 'math',
                        src: 'U=2\\pi r',
                        inline: true,
                        children: [{ text: 'U=2\\pi r' }],
                      },
                      { text: ' ist der ' },
                      { text: 'Umfang', strong: true },
                      { text: ' von einem Kreis.' },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  }

  expect(migrateState(state)).toEqual({
    plugin: 'exercise',
    state: {
      content: {
        plugin: 'rows',
        state: [
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  { text: 'Wie berechnet man den FlÃ¤cheninhalt ' },
                  {
                    type: 'math',
                    src: 'A',
                    inline: true,
                    children: [{ text: 'A' }],
                  },
                  { text: ' von einem Kreis mit Radius ' },
                  {
                    type: 'math',
                    src: 'r',
                    inline: true,
                    children: [{ text: 'r' }],
                  },
                  { text: '?' },
                ],
              },
            ],
          },
        ],
      },
      interactive: {
        plugin: 'scMcExercise',
        state: {
          isSingleChoice: true,
          answers: [
            {
              content: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: '' },
                      {
                        type: 'math',
                        src: 'A=\\pi \\cdot r^2',
                        inline: true,
                        children: [{ text: 'A=\\pi \\cdot r^2' }],
                      },
                      { text: '' },
                    ],
                  },
                ],
              },
              isCorrect: true,
              feedback: {
                plugin: 'text',
                state: [
                  { type: 'p', children: [{ text: 'Richtig! Sehr gut!' }] },
                ],
              },
            },
            {
              content: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: '' },
                      {
                        type: 'math',
                        src: 'A=\\pi^2 \\cdot r',
                        inline: true,
                        children: [{ text: 'A=\\pi^2 \\cdot r' }],
                      },
                      { text: '' },
                    ],
                  },
                ],
              },
              isCorrect: false,
              feedback: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: 'Fast! Aber leider trotzdem falsch. :(' },
                    ],
                  },
                ],
              },
            },
            {
              content: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: '' },
                      {
                        type: 'math',
                        src: 'A=\\dfrac{r}{2}\\cdot \\pi',
                        inline: true,
                        children: [{ text: 'A=\\dfrac{r}{2}\\cdot \\pi' }],
                      },
                      { text: '' },
                    ],
                  },
                ],
              },
              isCorrect: false,
              feedback: {
                plugin: 'text',
                state: [
                  { type: 'p', children: [{ text: 'Das ist leider falsch.' }] },
                ],
              },
            },
            {
              content: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: '' },
                      {
                        type: 'math',
                        src: 'A = 2\\cdot \\pi \\cdot r',
                        inline: true,
                        children: [{ text: 'A = 2\\cdot \\pi \\cdot r' }],
                      },
                      { text: '' },
                    ],
                  },
                ],
              },
              isCorrect: false,
              feedback: {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      { text: 'Falsch. ' },
                      {
                        type: 'math',
                        src: 'U=2\\pi r',
                        inline: true,
                        children: [{ text: 'U=2\\pi r' }],
                      },
                      { text: ' ist der ' },
                      { text: 'Umfang', strong: true },
                      { text: ' von einem Kreis.' },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    },
  })
})
