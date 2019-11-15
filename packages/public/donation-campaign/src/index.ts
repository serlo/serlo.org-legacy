/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import { sheets_v4 } from 'googleapis'

addEventListener('fetch', (event: Event) => {
  const e = event as FetchEvent
  e.respondWith(handleRequest(e.request))
})

const spreadsheetId = '18ri3s1cqw1-jYjnPbPkI_9v4t9wBY1Sp3YtklXO0_Wg'

export async function handleRequest(request: Request) {
  const key = await SECRETS_KV.get('google-sheets-api-key')
  const sheetsResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?ranges=Spendenziel!A2:B&ranges=A/B Testing!A2:J&ranges=Widgets!A2:B&ranges=Texte!A2:C&key=${key}`,
    ({ cf: { cacheTtl: 60 * 60 } } as unknown) as RequestInit
  )
  const { valueRanges } = await sheetsResponse.json()
  const experimentData = processSheetsResponse(valueRanges)

  const cookieName = `experiment/${experimentData.id}`

  const { widget, text, createCookie } = executeExperiment()
  const group = `${widget === 0 ? 'A' : 'B'}${text === 0 ? 'A' : 'B'}`

  const response = new Response(
    JSON.stringify({
      id: experimentData.id,
      group: `${widget === 0 ? 'A' : 'B'}${text === 0 ? 'A' : 'B'}`,
      progress: experimentData.progress,
      text: experimentData.texts[text],
      widget: experimentData.widgets[widget]
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
  if (createCookie) {
    response.headers.append(
      'Set-Cookie',
      `${cookieName}=${group}; path=/; Max-Age=${30 * 24 * 60 * 60}`
    )
  }
  return response

  function executeExperiment() {
    const cookie = request.headers.get('Cookie')

    if (cookie) {
      if (cookie.includes(`${cookieName}=AA`)) {
        return {
          widget: 0,
          text: 0,
          createCookie: false
        }
      }
      if (cookie.includes(`${cookieName}=AB`)) {
        return {
          widget: 0,
          text: 1,
          createCookie: false
        }
      }
      if (cookie.includes(`${cookieName}=BA`)) {
        return {
          widget: 1,
          text: 0,
          createCookie: false
        }
      }
      if (cookie.includes(`${cookieName}=BB`)) {
        return {
          widget: 1,
          text: 1,
          createCookie: false
        }
      }
    }

    const text = Math.random() < experimentData.textAProbability ? 0 : 1
    const widget = Math.random() < experimentData.widgetAProbability ? 0 : 1
    return {
      widget,
      text,
      createCookie: true
    }
  }
}

export function processSheetsResponse(
  valueRanges: sheets_v4.Schema$ValueRange[]
) {
  const [progressData, experimentsData, widgetsData, textsData] = valueRanges

  const progress = handleProgress(progressData)
  const experiment = handleExperiment(experimentsData)
  const widgets = handleWidgets(widgetsData)
  const texts = handleTexts(textsData)
  return {
    progress,
    id: experiment.id,
    enableProbability: experiment.enableProbability,
    widgetAProbability: experiment.widgetAProbability,
    textAProbability: experiment.textAProbability,
    widgets,
    texts: [texts[experiment.textA], texts[experiment.textB]]
  }

  function handleProgress({ values }: sheets_v4.Schema$ValueRange) {
    const [row] = values as string[][]
    return {
      value: parseInt(row[0], 10),
      max: parseInt(row[1], 10)
    }
  }

  function handleExperiment({ values }: sheets_v4.Schema$ValueRange) {
    const rows = values as string[][]
    const experiments = rows.map(
      ([
        id,
        start,
        enableProbability,
        widgetAProbability,
        _,
        textA,
        textAProbability,
        textB
      ]) => {
        return {
          id,
          start: Date.parse(start),
          enableProbability: parseInt(enableProbability, 10) / 100,
          widgetAProbability: parseInt(widgetAProbability, 10) / 100,
          textA,
          textAProbability: parseInt(textAProbability, 10) / 100,
          textB
        }
      }
    )
    experiments.reverse()
    const activeExperiment = experiments.find(experiment => {
      return experiment.start <= Date.now()
    })
    return activeExperiment || experiments[0]
  }

  function handleWidgets({ values }: sheets_v4.Schema$ValueRange) {
    const rows = values as string[][]
    return [rows[0][1], rows[1][1]]
  }

  function handleTexts({ values }: sheets_v4.Schema$ValueRange) {
    const rows = values as string[][]
    const texts: { [id: string]: { heading: string; body: string } } = {}
    rows.forEach(([id, heading, body]) => {
      texts[id] = {
        heading,
        body
      }
    })
    return texts
  }
}

export interface DonationData {
  progress: {
    value: number
    max: number
  }
}
