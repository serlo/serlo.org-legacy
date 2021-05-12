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
import { migrateState } from '../src/20200220140328-migrate-solutions'

test('Real state', async () => {
  const state = {
    plugin: 'rows',
    state: [
      {
        plugin: 'solutionSteps',
        state: {
          introduction: {
            plugin: 'rows',
            state: [
              {
                plugin: 'text',
                state: [
                  {
                    type: 'p',
                    children: [
                      {
                        text: 'Tipp: Versuche die Zeichnung in eine Skizze mit den Punkten ',
                      },
                      {
                        type: 'math',
                        src: 'Z, A_1, A_2, B_1, B_2',
                        inline: true,
                        children: [{ text: 'Z, A_1, A_2, B_1, B_2' }],
                      },
                      {
                        text: ' und vier Geraden umzuwandeln, Ã¤hnlich zu den Zeichnungen im Artikel zum ',
                      },
                      {
                        type: 'a',
                        href: '/1971',
                        children: [{ text: 'Strahlensatz' }],
                      },
                      { text: '.' },
                    ],
                  },
                ],
              },
              {
                plugin: 'text',
                state: [
                  {
                    type: 'h',
                    level: 3,
                    children: [{ text: 'Anwendung des Strahlensatzes' }],
                  },
                  {
                    type: 'p',
                    children: [
                      { text: 'Hier findest du eine ErklÃ¤rung zum Thema ' },
                      {
                        type: 'a',
                        href: '/1971',
                        children: [{ text: 'Strahlensatz' }],
                      },
                      { text: '. ' },
                    ],
                  },
                  {
                    type: 'p',
                    children: [
                      {
                        text: 'Die Zeichnung kann in eine Skizze, Ã¤hnlich zu den Skizzen im Artikel zum ',
                      },
                      {
                        type: 'a',
                        href: '/1971',
                        children: [{ text: 'Strahlensatz' }],
                      },
                      {
                        text: ', umgeformt werden. Das sieht dann folgendermaÃŸen aus:',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          solutionSteps: [
            {
              type: 'step',
              isHalf: false,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'image',
                    state: {
                      src: 'https://assets.serlo.org/legacy/591326a3943a9_b6b9503240e5c544dae8c9427e2f77166a6c9b32.png',
                      alt: '',
                    },
                  },
                ],
              },
            },
            {
              type: 'step',
              isHalf: false,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [
                      {
                        type: 'p',
                        children: [
                          {
                            text: 'AnschlieÃŸend kannst du die gegebenen Werte aus der Angabe den Strecken in der Skizze zuordnen.',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'step',
              isHalf: false,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'image',
                    state: {
                      src: 'https://assets.serlo.org/legacy/591326cf7016b_9f28b189b35c01d5867283b88a04e3ed447b1039.png',
                      alt: '',
                    },
                  },
                ],
              },
            },
            {
              type: 'step',
              isHalf: false,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [
                      {
                        type: 'p',
                        children: [
                          { text: 'Um nun die fehlende HÃ¶he ' },
                          {
                            type: 'math',
                            src: 'h',
                            inline: true,
                            children: [{ text: 'h' }],
                          },
                          {
                            text: ' auszurechnen schreibst du dir am besten nochmal die gegebenen Werte auf. Dazu benutzt du die Zuordnung aus der Skizze oben.',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'step',
              isHalf: true,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [
                      {
                        type: 'p',
                        children: [
                          {
                            type: 'math',
                            src: '\\displaystyle{\\overline{A_1 B_1}=1,8m}',
                            inline: false,
                            children: [
                              {
                                text: '\\displaystyle{\\overline{A_1 B_1}=1,8m}',
                              },
                            ],
                          },
                          {
                            type: 'math',
                            src: '\\displaystyle{\\overline{A_2 B_2}=h}',
                            inline: false,
                            children: [
                              { text: '\\displaystyle{\\overline{A_2 B_2}=h}' },
                            ],
                          },
                          {
                            type: 'math',
                            src: '\\displaystyle{\\overline{Z A_1}=9,5m-7,5m = 2m}',
                            inline: false,
                            children: [
                              {
                                text: '\\displaystyle{\\overline{Z A_1}=9,5m-7,5m = 2m}',
                              },
                            ],
                          },
                          {
                            type: 'math',
                            src: '\\displaystyle{\\overline{Z A_2}=9,5m}',
                            inline: false,
                            children: [
                              {
                                text: '\\displaystyle{\\overline{Z A_2}=9,5m}',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'explanation',
              isHalf: true,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [
                      {
                        type: 'p',
                        children: [
                          {
                            text: 'Suche anschlieÃŸend den passenden Strahlensatz fÃ¼r die gegebenen Strecken.',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'step',
              isHalf: true,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [
                      {
                        type: 'p',
                        children: [
                          { text: '' },
                          {
                            type: 'math',
                            src: '\\\\',
                            inline: true,
                            children: [{ text: '\\\\' }],
                          },
                          { text: '' },
                        ],
                      },
                      {
                        type: 'p',
                        children: [
                          { text: 'Zweiter Strahlensatz:', strong: true },
                          { text: ' ' },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'explanation',
              isHalf: true,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [
                      {
                        type: 'p',
                        children: [
                          { text: '' },
                          {
                            type: 'math',
                            src: '\\\\',
                            inline: true,
                            children: [{ text: '\\\\' }],
                          },
                          { text: '' },
                        ],
                      },
                      {
                        type: 'p',
                        children: [
                          { text: '' },
                          {
                            type: 'math',
                            src: '\\\\',
                            inline: true,
                            children: [{ text: '\\\\' }],
                          },
                          { text: '' },
                        ],
                      },
                      {
                        type: 'p',
                        children: [
                          {
                            text: 'Stelle den Strahlensatz nach der gesuchten GrÃ¶ÃŸe  ',
                          },
                          {
                            type: 'math',
                            src: '\\hspace{0,15cm} h = \\overline{A_2 B_2}\\hspace{0,15cm}',
                            inline: true,
                            children: [
                              {
                                text: '\\hspace{0,15cm} h = \\overline{A_2 B_2}\\hspace{0,15cm}',
                              },
                            ],
                          },
                          { text: ' um.' },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'step',
              isHalf: true,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [
                      {
                        type: 'p',
                        children: [
                          {
                            type: 'math',
                            src: '\\displaystyle{ \\overline{A_2 B_2} =   \\dfrac{\\hspace{0,15cm}\\overline{Z A_2} \\hspace{0,15cm}}{\\hspace{0,15cm}\\overline{Z A_1}\\hspace{0,15cm}} \\cdot \\overline{A_1 B_1}}',
                            inline: false,
                            children: [
                              {
                                text: '\\displaystyle{ \\overline{A_2 B_2} =   \\dfrac{\\hspace{0,15cm}\\overline{Z A_2} \\hspace{0,15cm}}{\\hspace{0,15cm}\\overline{Z A_1}\\hspace{0,15cm}} \\cdot \\overline{A_1 B_1}}',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'explanation',
              isHalf: true,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [
                      {
                        type: 'p',
                        children: [
                          {
                            text: 'Setze die Werte ein und berechne die HÃ¶he fÃ¼r das Haus!',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'step',
              isHalf: false,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [
                      {
                        type: 'p',
                        children: [
                          {
                            type: 'math',
                            src: '\\displaystyle{h =\\overline{A_2 B_2} =  \\dfrac{9,5m}{2m}\\cdot 1,8m=8,55m}',
                            inline: false,
                            children: [
                              {
                                text: '\\displaystyle{h =\\overline{A_2 B_2} =  \\dfrac{9,5m}{2m}\\cdot 1,8m=8,55m}',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'step',
              isHalf: true,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [{ type: 'p', children: [{ text: '' }] }],
                  },
                ],
              },
            },
            {
              type: 'explanation',
              isHalf: true,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [{ type: 'p', children: [{ text: '' }] }],
                  },
                ],
              },
            },
            {
              type: 'step',
              isHalf: false,
              content: {
                plugin: 'rows',
                state: [
                  {
                    plugin: 'text',
                    state: [
                      {
                        type: 'p',
                        children: [
                          {
                            text: 'Das von Klaus gemessene Haus ist 8,55m hoch.',
                            strong: true,
                          },
                        ],
                      },
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
    plugin: 'solution',
    state: {
      prerequisite: undefined,
      strategy: {
        plugin: 'text',
      },
      steps: {
        plugin: 'rows',
        state: [
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Tipp: Versuche die Zeichnung in eine Skizze mit den Punkten ',
                  },
                  {
                    type: 'math',
                    src: 'Z, A_1, A_2, B_1, B_2',
                    inline: true,
                    children: [{ text: 'Z, A_1, A_2, B_1, B_2' }],
                  },
                  {
                    text: ' und vier Geraden umzuwandeln, Ã¤hnlich zu den Zeichnungen im Artikel zum ',
                  },
                  {
                    type: 'a',
                    href: '/1971',
                    children: [{ text: 'Strahlensatz' }],
                  },
                  { text: '.' },
                ],
              },
            ],
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'h',
                level: 3,
                children: [{ text: 'Anwendung des Strahlensatzes' }],
              },
              {
                type: 'p',
                children: [
                  { text: 'Hier findest du eine ErklÃ¤rung zum Thema ' },
                  {
                    type: 'a',
                    href: '/1971',
                    children: [{ text: 'Strahlensatz' }],
                  },
                  { text: '. ' },
                ],
              },
              {
                type: 'p',
                children: [
                  {
                    text: 'Die Zeichnung kann in eine Skizze, Ã¤hnlich zu den Skizzen im Artikel zum ',
                  },
                  {
                    type: 'a',
                    href: '/1971',
                    children: [{ text: 'Strahlensatz' }],
                  },
                  {
                    text: ', umgeformt werden. Das sieht dann folgendermaÃŸen aus:',
                  },
                ],
              },
            ],
          },
          {
            plugin: 'image',
            state: {
              src: 'https://assets.serlo.org/legacy/591326a3943a9_b6b9503240e5c544dae8c9427e2f77166a6c9b32.png',
              alt: '',
            },
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  {
                    text: 'AnschlieÃŸend kannst du die gegebenen Werte aus der Angabe den Strecken in der Skizze zuordnen.',
                  },
                ],
              },
            ],
          },
          {
            plugin: 'image',
            state: {
              src: 'https://assets.serlo.org/legacy/591326cf7016b_9f28b189b35c01d5867283b88a04e3ed447b1039.png',
              alt: '',
            },
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  { text: 'Um nun die fehlende HÃ¶he ' },
                  {
                    type: 'math',
                    src: 'h',
                    inline: true,
                    children: [{ text: 'h' }],
                  },
                  {
                    text: ' auszurechnen schreibst du dir am besten nochmal die gegebenen Werte auf. Dazu benutzt du die Zuordnung aus der Skizze oben.',
                  },
                ],
              },
            ],
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  {
                    type: 'math',
                    src: '\\displaystyle{\\overline{A_1 B_1}=1,8m}',
                    inline: false,
                    children: [
                      {
                        text: '\\displaystyle{\\overline{A_1 B_1}=1,8m}',
                      },
                    ],
                  },
                  {
                    type: 'math',
                    src: '\\displaystyle{\\overline{A_2 B_2}=h}',
                    inline: false,
                    children: [
                      { text: '\\displaystyle{\\overline{A_2 B_2}=h}' },
                    ],
                  },
                  {
                    type: 'math',
                    src: '\\displaystyle{\\overline{Z A_1}=9,5m-7,5m = 2m}',
                    inline: false,
                    children: [
                      {
                        text: '\\displaystyle{\\overline{Z A_1}=9,5m-7,5m = 2m}',
                      },
                    ],
                  },
                  {
                    type: 'math',
                    src: '\\displaystyle{\\overline{Z A_2}=9,5m}',
                    inline: false,
                    children: [
                      { text: '\\displaystyle{\\overline{Z A_2}=9,5m}' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Suche anschlieÃŸend den passenden Strahlensatz fÃ¼r die gegebenen Strecken.',
                  },
                ],
              },
            ],
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  { text: '' },
                  {
                    type: 'math',
                    src: '\\\\',
                    inline: true,
                    children: [{ text: '\\\\' }],
                  },
                  { text: '' },
                ],
              },
              {
                type: 'p',
                children: [
                  { text: 'Zweiter Strahlensatz:', strong: true },
                  { text: ' ' },
                ],
              },
            ],
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  { text: '' },
                  {
                    type: 'math',
                    src: '\\\\',
                    inline: true,
                    children: [{ text: '\\\\' }],
                  },
                  { text: '' },
                ],
              },
              {
                type: 'p',
                children: [
                  { text: '' },
                  {
                    type: 'math',
                    src: '\\\\',
                    inline: true,
                    children: [{ text: '\\\\' }],
                  },
                  { text: '' },
                ],
              },
              {
                type: 'p',
                children: [
                  {
                    text: 'Stelle den Strahlensatz nach der gesuchten GrÃ¶ÃŸe  ',
                  },
                  {
                    type: 'math',
                    src: '\\hspace{0,15cm} h = \\overline{A_2 B_2}\\hspace{0,15cm}',
                    inline: true,
                    children: [
                      {
                        text: '\\hspace{0,15cm} h = \\overline{A_2 B_2}\\hspace{0,15cm}',
                      },
                    ],
                  },
                  { text: ' um.' },
                ],
              },
            ],
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  {
                    type: 'math',
                    src: '\\displaystyle{ \\overline{A_2 B_2} =   \\dfrac{\\hspace{0,15cm}\\overline{Z A_2} \\hspace{0,15cm}}{\\hspace{0,15cm}\\overline{Z A_1}\\hspace{0,15cm}} \\cdot \\overline{A_1 B_1}}',
                    inline: false,
                    children: [
                      {
                        text: '\\displaystyle{ \\overline{A_2 B_2} =   \\dfrac{\\hspace{0,15cm}\\overline{Z A_2} \\hspace{0,15cm}}{\\hspace{0,15cm}\\overline{Z A_1}\\hspace{0,15cm}} \\cdot \\overline{A_1 B_1}}',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Setze die Werte ein und berechne die HÃ¶he fÃ¼r das Haus!',
                  },
                ],
              },
            ],
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  {
                    type: 'math',
                    src: '\\displaystyle{h =\\overline{A_2 B_2} =  \\dfrac{9,5m}{2m}\\cdot 1,8m=8,55m}',
                    inline: false,
                    children: [
                      {
                        text: '\\displaystyle{h =\\overline{A_2 B_2} =  \\dfrac{9,5m}{2m}\\cdot 1,8m=8,55m}',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            plugin: 'text',
            state: [{ type: 'p', children: [{ text: '' }] }],
          },
          {
            plugin: 'text',
            state: [{ type: 'p', children: [{ text: '' }] }],
          },
          {
            plugin: 'text',
            state: [
              {
                type: 'p',
                children: [
                  {
                    text: 'Das von Klaus gemessene Haus ist 8,55m hoch.',
                    strong: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  })
})
