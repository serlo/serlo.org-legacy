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
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'
import { StateTypeReturnType, string } from '@edtr-io/plugin'
import { faCog, Icon, faCheck, styled } from '@edtr-io/ui'
import { PluginToolbarButton } from '@edtr-io/core'
import axios from 'axios'
import moment from 'moment'
import * as React from 'react'
import BSButton from 'react-bootstrap/lib/Button'
import BSFormControl from 'react-bootstrap/lib/FormControl'
import BSControlLabel from 'react-bootstrap/lib/ControlLabel'
import BSFormGroup from 'react-bootstrap/lib/FormGroup'
import BSModal from 'react-bootstrap/lib/Modal'
import BSTable from 'react-bootstrap/lib/Table'

import { deserialize, isError } from '../../../deserialize'

const StyledSettings = styled.div({
  position: 'absolute',
  top: '10px',
  left: '-10px',
  transformOrigin: 'center top',
  transform: 'translateX(-100%)'
})

const Content = styled.div({
  paddingBottom: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  zIndex: 16,
  position: 'relative',
  transition: '250ms all ease-in-out'
})

const StyledTR = styled.tr<{ selected: boolean }>(props => {
  return props.selected
    ? {
        border: '3px solid rgb(0,100,0)'
      }
    : {
        cursor: 'pointer'
      }
})

function SettingsIcon(props: { open: () => void }) {
  return (
    <span onClick={props.open}>
      <PluginToolbarButton
        icon={<Icon icon={faCog} size="lg" />}
        label="Einstellungen"
      />
    </span>
  )
}

interface RevisionData {
  id: number
  timestamp: string
  author: string
  changes: string
  active: boolean
}

export function RevisionHistory<T>(
  props: React.PropsWithChildren<{
    id: number
    currentRevision: number
    onSwitchRevision: (data: T) => void
  }>
) {
  const [availableRevisions, setAvailableRevisions] = React.useState<
    RevisionData[]
  >([])

  const [showRevisions, setShowRevisions] = React.useState(false)
  React.useEffect(() => {
    axios
      .get<RevisionData[]>(`/entity/repository/get-revisions/${props.id}`)
      .then(response => {
        setAvailableRevisions(response.data)
      })
  }, [])

  return (
    <div>
      <span
        onClick={() => {
          if (availableRevisions.length) {
            setShowRevisions(true)
          }
        }}
      >
        <PluginToolbarButton
          icon={<Icon icon={faHistory} size="lg" />}
          label="Andere Version auswählen"
        />
      </span>
      <BSModal
        show={showRevisions}
        onHide={() => {
          setShowRevisions(false)
        }}
        bsSize="lg"
      >
        <BSModal.Header closeButton>
          <BSModal.Title>Andere Version auswählen</BSModal.Title>
        </BSModal.Header>
        <BSModal.Body>
          <BSTable striped hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Aktuell</th>
                <th>Änderungen</th>
                <th>Verfasser</th>
                <th>Zeitstempel</th>
              </tr>
            </thead>
            <tbody>
              {availableRevisions.map(revisionData => {
                const selected = props.currentRevision
                  ? props.currentRevision === revisionData.id
                  : revisionData.active

                const dateTime = moment.utc(revisionData.timestamp).local()
                return (
                  <StyledTR
                    selected={selected}
                    onClick={() => {
                      // don't select the current selected
                      if (selected) return

                      axios
                        .get<{ state: unknown; type: string }>(
                          `/entity/repository/get-revision-data/${props.id}/${revisionData.id}`
                        )
                        .then(response => {
                          const deserialized = deserialize({
                            initialState: response.data.state,
                            type: response.data.type
                          })
                          if (isError(deserialized)) {
                            alert(deserialized.error)
                          } else {
                            props.onSwitchRevision(
                              deserialized.initialState.state as T
                            )
                            setShowRevisions(false)
                          }
                        })
                    }}
                    key={revisionData.id}
                  >
                    <td>{revisionData.id}</td>
                    <td>
                      {revisionData.active ? <Icon icon={faCheck} /> : null}
                    </td>
                    <th>{revisionData.changes}</th>
                    <td>{revisionData.author}</td>
                    <td title={dateTime.format('LL, LTS')}>
                      {dateTime.fromNow()}
                    </td>
                  </StyledTR>
                )
              })}
            </tbody>
          </BSTable>
        </BSModal.Body>
        <BSModal.Footer>
          <BSButton
            onClick={() => {
              setShowRevisions(false)
            }}
          >
            Schließen
          </BSButton>
        </BSModal.Footer>
      </BSModal>
    </div>
  )
}

export function Settings(props: React.PropsWithChildren<{}>) {
  return <React.Fragment>{props.children}</React.Fragment>
}

Settings.Textarea = function SettingsTextarea({
  label,
  state
}: {
  label: string
  state: StateTypeReturnType<ReturnType<typeof string>>
}) {
  return (
    <BSFormGroup>
      <BSControlLabel>{label}</BSControlLabel>
      <BSFormControl
        componentClass="textarea"
        value={state.value}
        onChange={e => {
          const { value } = e.target as HTMLTextAreaElement
          state.set(value)
        }}
      />
    </BSFormGroup>
  )
}

Settings.Select = function SettingsSelect({
  label,
  state,
  options
}: {
  label: string
  state: StateTypeReturnType<ReturnType<typeof string>>
  options: { label: string; value: string }[]
}) {
  return (
    <BSFormGroup controlId="formControlsSelect">
      <BSControlLabel>{label}</BSControlLabel>
      <BSFormControl
        componentClass="select"
        placeholder="select"
        value={state.value}
        onChange={e => {
          const { value } = e.target as HTMLSelectElement
          state.set(value)
        }}
      >
        {options.map(option => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        })}
      </BSFormControl>
    </BSFormGroup>
  )
}
