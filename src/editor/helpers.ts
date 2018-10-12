import * as base64 from 'base-64'
import * as $ from 'jquery'
import * as utf8 from 'utf8'

export const parseState = (raw: string): unknown => {
  const stringifiedState = utf8.decode(base64.decode(raw))

  if (typeof stringifiedState === 'string') {
    return JSON.parse(stringifiedState)
  }

  return stringifiedState
}

export const stringifyState = (state: unknown): string => {
  return base64.encode(utf8.encode(JSON.stringify(state)))
}

export const getStateFromElement = (element: HTMLElement) => {
  return parseState($(element).data('rawContent'))
}
