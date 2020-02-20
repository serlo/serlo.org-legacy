import {
  EditorPlugin,
  EditorPluginProps,
  child,
  object,
  string,
  optional
} from '@edtr-io/plugin'
import * as React from 'react'
import { OverlayInput, useScopedSelector } from '@edtr-io/core'
import { PrimarySettings } from '@edtr-io/editor-ui'
import { isEmpty } from '@edtr-io/store'

const solutionState = object({
  prerequisite: optional(
    object({
      id: string(),
      title: string()
    })
  ),
  strategy: child({
    plugin: 'text',
    config: {
      placeholder: 'Beschreibe hier optional die Lösungsstrategie'
    }
  }),
  steps: child({ plugin: 'rows' })
})

export type SolutionState = typeof solutionState
export type SolutionProps = EditorPluginProps<SolutionState>

export const solutionPlugin: EditorPlugin<SolutionState> = {
  Component: SolutionEditor,
  state: solutionState,
  config: {}
}

function SolutionEditor({ editable, id, state, focused }: SolutionProps) {
  const { prerequisite, strategy } = state

  const hasStrategy = !useScopedSelector(isEmpty(strategy.id))

  return (
    <React.Fragment>
      {renderPrerequisite()}
      {hasStrategy || editable ? strategy.render() : null}
      {state.steps.render()}
    </React.Fragment>
  )

  function renderPrerequisite() {
    return (
      <React.Fragment>
        {renderContent()}
        {renderSettings()}
      </React.Fragment>
    )

    function renderContent() {
      if (
        prerequisite.defined &&
        prerequisite.id.value &&
        prerequisite.title.value
      ) {
        return (
          <div>
            Für diese Aufgabe benötigst Du folgendes Grundwissen:{' '}
            <a
              href={`/${prerequisite.id.value}`}
              onClick={
                editable
                  ? e => {
                      e.preventDefault()
                    }
                  : undefined
              }
            >
              {prerequisite.title.value}
            </a>
          </div>
        )
      }

      if (editable) {
        return (
          <div>
            <em>
              Füge optional einen Lerninhalt ein, den man für die Bearbeitung
              dieser Aufgabe benötigt:
            </em>
          </div>
        )
      }

      return null
    }

    function renderSettings() {
      if (!editable) return null
      return (
        <PrimarySettings>
          <OverlayInput
            value={prerequisite.defined ? prerequisite.id.value : ''}
            label="Serlo ID"
            placeholder="Gebe hier die ID des Artikels ein, z.B. 1855"
            onChange={e => {
              const value = e.target.value
              if (prerequisite.defined) {
                prerequisite.id.set(value)
              } else {
                // @ts-ignore
                prerequisite.create({
                  id: value,
                  title: ''
                })
              }
            }}
          />
          <OverlayInput
            value={prerequisite.defined ? prerequisite.title.value : ''}
            label="Titel"
            placeholder="Gebe hier den Titel ein, z.B. Parabel"
            onChange={e => {
              const value = e.target.value
              if (prerequisite.defined) {
                prerequisite.title.set(value)
              } else {
                // @ts-ignore
                prerequisite.create({
                  id: '',
                  title: value
                })
              }
            }}
          />
        </PrimarySettings>
      )
    }
  }
}
