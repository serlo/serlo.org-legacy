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
import { faCog, Icon } from '@edtr-io/editor-ui'
import { faHistory } from '@fortawesome/free-solid-svg-icons/faHistory'
import { StateTypeReturnType, string } from '@edtr-io/plugin'
import { styled } from '@edtr-io/ui'
import axios from 'axios'
import * as React from 'react'
import BSButton from 'react-bootstrap/lib/Button'
import BSFormControl from 'react-bootstrap/lib/FormControl'
import BSControlLabel from 'react-bootstrap/lib/ControlLabel'
import BSFormGroup from 'react-bootstrap/lib/FormGroup'
import BSModal from 'react-bootstrap/lib/Modal'
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

const StyledIconContainer = styled.div({
  marginBottom: '5px',
  height: '24px',
  opacity: 0.8,
  cursor: 'pointer',
  color: 'rgb(51,51,51,0.95)',

  '&:hover': {
    color: 'rgb(70,155,255)'
  }
})

function SettingsIcon(props: { open: () => void }) {
  return (
    <span onClick={props.open}>
      <StyledIconContainer title="Einstellungen">
        <Icon icon={faCog} size="lg" />
      </StyledIconContainer>
    </span>
  )
}

interface RevisionData {
  id: number
  timestamp: { date: string }
  author: string
}

export function Settings<T>(
  props: React.PropsWithChildren<{
    id: number
    onSwitchRevision: (data: T) => void
  }>
) {
  const [open, setOpen] = React.useState(false)
  const [availableRevisions, setAvailableRevisions] = React.useState<
    RevisionData[]
  >([])
  React.useEffect(() => {
    axios
      .get<RevisionData[]>(`/entity/repository/get-revisions/${props.id}`)
      .then(response => {
        setAvailableRevisions(response.data)
      })
  }, [])

  const [showRevisions, setShowRevisions] = React.useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <StyledSettings>
        <Content>
          <SettingsIcon
            open={() => {
              setOpen(true)
            }}
          />
          <span
            onClick={() => {
              if (availableRevisions.length) {
                setShowRevisions(true)
              }
            }}
          >
            <StyledIconContainer title="Andere Version auswählen">
              <Icon icon={faHistory} size="lg" />
            </StyledIconContainer>
          </span>
        </Content>
      </StyledSettings>
      <BSModal
        show={open}
        onHide={() => {
          setOpen(false)
        }}
      >
        <BSModal.Header closeButton>
          <BSModal.Title>Einstellungen</BSModal.Title>
        </BSModal.Header>
        <BSModal.Body>{props.children}</BSModal.Body>
        <BSModal.Footer>
          <BSButton
            onClick={() => {
              setOpen(false)
            }}
          >
            Schließen
          </BSButton>
        </BSModal.Footer>
      </BSModal>
      <BSModal
        show={showRevisions}
        onHide={() => {
          setShowRevisions(false)
        }}
      >
        <BSModal.Header closeButton>
          <BSModal.Title>Andere Version auswählen</BSModal.Title>
        </BSModal.Header>
        <BSModal.Body>
          {availableRevisions.map(revisionData => {
            return (
              <BSButton
                onClick={() => {
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
                {revisionData.id} von {revisionData.author} am{' '}
                {revisionData.timestamp.date}
              </BSButton>
            )
          })}
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
