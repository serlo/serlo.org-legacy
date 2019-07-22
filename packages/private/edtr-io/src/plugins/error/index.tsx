import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  StateType
} from '@edtr-io/core'
import * as React from 'react'
import { styled } from '@edtr-io/renderer-ui'

export const errorState = StateType.object({
  plugin: StateType.string(),
  state: StateType.scalar<unknown>({})
})

const Error = styled.div({
  backgroundColor: 'rgb(204,0,0)',
  color: '#fff'
})
export const ErrorRenderer: React.FunctionComponent<
  StatefulPluginEditorProps<typeof errorState>
> = props => {
  return (
    <Error>
      <p>
        <strong>Beim Konvertieren ist ein Fehler aufgetreten!</strong>
      </p>
      <p>
        Das Plugin {props.state.plugin()} konnte nicht konvertiert werden. Es
        enthielt folgende Daten:
      </p>
      <code>{JSON.stringify(props.state.state())}</code>
      <p>Bitte wende dich an einen Entwickler.</p>
    </Error>
  )
}

export const errorPlugin: StatefulPlugin<typeof errorState> = {
  Component: ErrorRenderer,
  state: errorState
}
