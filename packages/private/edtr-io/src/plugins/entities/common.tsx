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
import { styled } from '@edtr-io/ui'
import { Icon, faCog } from '@edtr-io/editor-ui'
import * as React from 'react'
import {
  actions,
  StateType,
  connect as connectStore,
  selectors,
  OverlayContext,
  ScopedActionCreator,
  ScopeContext
} from '@edtr-io/core'
import BSAlert from 'react-bootstrap/lib/Alert'
import BSModal from 'react-bootstrap/lib/Modal'
import BSButton from 'react-bootstrap/lib/Button'
import BSCheckbox from 'react-bootstrap/lib/Checkbox'
import BSFormGroup from 'react-bootstrap/lib/FormGroup'
import BSControlLabel from 'react-bootstrap/lib/ControlLabel'
import BSFormControl from 'react-bootstrap/lib/FormControl'

import { createPortal } from 'react-dom'

import { SaveContext } from '../../editor'

export const licenseState = StateType.object({
  id: StateType.number(),
  title: StateType.string(),
  url: StateType.string(),
  agreement: StateType.string(),
  iconHref: StateType.string()
})

export const uuid = {
  id: StateType.number()
}

export const license = {
  license: licenseState
}

export const entity = {
  ...uuid,
  ...license,
  changes: StateType.string()
}

export type Uuid = StateType.StateDescriptorsSerializedType<typeof uuid>

export type License = StateType.StateDescriptorsSerializedType<typeof license>

export type Entity = StateType.StateDescriptorsSerializedType<typeof entity>

const connect = connectStore<
  StateProps,
  {
    undo: ScopedActionCreator<typeof actions.undo>
    redo: ScopedActionCreator<typeof actions.redo>
    persist: ScopedActionCreator<typeof actions.persist>
  },
  OwnProps & { scope: string }
>(
  state => {
    return {
      undoable: selectors.getUndoStack(state).length > 0,
      redoable: selectors.getRedoStack(state).length > 0,
      hasPendingChanges: selectors.hasPendingChanges(state),
      serializeRootDocument: () => {
        const serialized = selectors.serializeRootDocument(state)
        return serialized ? serialized.state : null
      }
    }
  },
  {
    undo: actions.undo,
    redo: actions.redo,
    persist: actions.persist
  }
)

const StyledSettings = styled.div({
  position: 'absolute',
  top: 0,
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
  height: '24px',
  opacity: 0.8,
  cursor: 'pointer',
  color: 'rgb(51,51,51,0.95)',

  '&:hover': {
    color: 'rgb(70,155,255)'
  }
})

export const HeaderInput = styled.input({
  border: 'none',
  width: '100%',
  borderBottom: '2px solid transparent',
  '&:focus': {
    outline: 'none',
    borderColor: '#007ec1'
  }
})

const SettingsIcon = (props: { open: () => void }) => (
  <span onClick={props.open}>
    <StyledIconContainer title="Einstellungen">
      <Icon icon={faCog} size="lg" />
    </StyledIconContainer>
  </span>
)

export const EntitySettings = function(props: React.PropsWithChildren<{}>) {
  const [open, setOpen] = React.useState(false)
  return (
    <React.Fragment>
      <StyledSettings>
        <Content>
          <SettingsIcon
            open={() => {
              setOpen(true)
            }}
          />
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
    </React.Fragment>
  )
}

export const Controls = function(props: OwnProps) {
  const { scope } = React.useContext(ScopeContext)
  return <InnerControls scope={scope} {...props} />
}

const InnerControls = connect(function SaveButton(
  props: StateProps & DispatchProps & OwnProps
) {
  const overlay = React.useContext(OverlayContext)
  const [pending, setPending] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const save = React.useContext(SaveContext)
  const [agreement, setAgreement] = React.useState(false)
  const [emailSubscription, setEmailSubscription] = React.useState(true)
  const [
    notificationSubscription,
    setNotificationSubscription
  ] = React.useState(true)

  React.useEffect(() => {
    if (overlay.visible) {
      // Reset license agreement
      setPending(false)
      setHasError(false)
      setAgreement(false)
    }
  }, [overlay.visible])

  React.useEffect(() => {
    window.onbeforeunload =
      props.hasPendingChanges && !pending ? () => '' : null
  }, [props.hasPendingChanges, pending])

  return (
    <React.Fragment>
      {createPortal(
        <div className="btn-group btn-group-community">
          <button
            className="btn btn-default"
            onClick={() => {
              props.undo()
            }}
            disabled={!props.undoable}
          >
            <span className="fa fa-undo"></span>
          </button>
          <button
            className="btn btn-default"
            onClick={() => {
              props.redo()
            }}
            disabled={!props.redoable}
          >
            <span className="fa fa-repeat"></span>
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              if (props.changes || props.license || props.subscriptions) {
                overlay.show()
              } else {
                handleSave()
              }
            }}
            disabled={!props.hasPendingChanges || !maySave() || pending}
          >
            {pending ? (
              <span className="fa fa-spinner fa-spin" />
            ) : (
              <span className="fa fa-save" />
            )}
          </button>
        </div>,
        document.getElementsByClassName('controls')[0]
      )}
      <BSModal
        show={overlay.visible}
        onHide={() => {
          overlay.hide()
        }}
      >
        <BSModal.Header closeButton>
          <BSModal.Title>Speichern</BSModal.Title>
        </BSModal.Header>
        <BSModal.Body>
          {renderAlert()}
          {renderChanges()}
          {renderLicense()}
          {renderSubscription()}
        </BSModal.Body>
        <BSModal.Footer>
          <BSButton
            onClick={() => {
              overlay.hide()
            }}
          >
            Abbrechen
          </BSButton>
          <BSButton
            onClick={() => {
              handleSave()
            }}
            bsStyle="success"
            disabled={!maySave() || pending}
            title={
              maySave()
                ? undefined
                : 'Du musst zuerst die Lizenzbedingungen akzeptieren'
            }
          >
            {pending ? 'Speichert ...' : 'Speichern'}
          </BSButton>
        </BSModal.Footer>
      </BSModal>
    </React.Fragment>
  )

  function maySave() {
    if (!props.license) return true
    return agreement
  }

  function handleSave() {
    if (!maySave()) return
    const serialized = props.serializeRootDocument()
    setPending(true)
    save({
      ...serialized,
      //@ts-ignore TODO: maybe pass this via props because should be typed in client
      csrf: window.csrf,
      controls: {
        ...(props.subscriptions
          ? {
              subscription: {
                subscribe: notificationSubscription ? 1 : 0,
                mailman: emailSubscription ? 1 : 0
              }
            }
          : {})
      }
    })
      .then(() => {
        setPending(false)
        setHasError(false)
      })
      .catch(() => {
        setPending(false)
        setHasError(true)
      })
  }

  function renderAlert() {
    if (!hasError) return null
    return (
      <BSAlert
        bsStyle="danger"
        onDismiss={() => {
          setHasError(false)
        }}
      >
        Speichern ist leider fehlgeschlagen. Bitte schnappe dir einen
        Entwickler.
      </BSAlert>
    )
  }

  function renderChanges() {
    const { changes } = props
    if (!changes) return null
    return (
      <BSFormGroup>
        <BSControlLabel>Änderungen</BSControlLabel>
        <BSFormControl
          componentClass="textarea"
          value={changes.value}
          onChange={e => {
            const { value } = e.target as HTMLTextAreaElement
            changes.set(value)
          }}
        />
      </BSFormGroup>
    )
  }

  function renderLicense() {
    const { license } = props
    if (!license) return null
    return (
      <BSCheckbox
        checked={agreement}
        onChange={e => {
          const { checked } = e.target as HTMLInputElement
          setAgreement(checked)
        }}
      >
        <span dangerouslySetInnerHTML={{ __html: license.agreement.value }} />
      </BSCheckbox>
    )
  }

  function renderSubscription() {
    const { subscriptions } = props
    if (!subscriptions) return null
    return (
      <React.Fragment>
        <BSCheckbox
          checked={notificationSubscription}
          onChange={e => {
            const { checked } = e.target as HTMLInputElement
            setNotificationSubscription(checked)
          }}
        >
          Benachrichtigungen auf Serlo erhalten
        </BSCheckbox>
        <BSCheckbox
          checked={emailSubscription}
          onChange={e => {
            const { checked } = e.target as HTMLInputElement
            setEmailSubscription(checked)
          }}
        >
          Benachrichtigungen per Email erhalten
        </BSCheckbox>
      </React.Fragment>
    )
  }
})

export function editorContent(): StateType.StateDescriptor<
  string,
  StateType.StateDescriptorValueType<ReturnType<typeof StateType.child>>,
  StateType.StateDescriptorReturnType<ReturnType<typeof StateType.child>>
> {
  const child = StateType.child('rows')
  const { serialize, deserialize } = child
  return Object.assign(child, {
    serialize(...args: Parameters<typeof child.serialize>) {
      return JSON.stringify(serialize(...args))
    },
    deserialize(
      serialized: string,
      helpers: Parameters<typeof child.deserialize>[1]
    ) {
      console.log('stateType', serialized)
      return deserialize(JSON.parse(serialized), helpers)
    }
  })
}

export function serializedChild(
  plugin: string
): StateType.StateDescriptor<
  unknown,
  StateType.StateDescriptorValueType<ReturnType<typeof StateType.child>>,
  StateType.StateDescriptorReturnType<ReturnType<typeof StateType.child>>
> {
  const child = StateType.child(plugin)
  const { serialize, deserialize } = child
  return Object.assign(child, {
    serialize(...args: Parameters<typeof child.serialize>) {
      return serialize(...args).state
    },
    deserialize(
      serialized: string,
      helpers: Parameters<typeof child.deserialize>[1]
    ) {
      return deserialize(
        {
          plugin,
          state: serialized
        },
        helpers
      )
    }
  })
}

interface StateProps {
  hasPendingChanges: ReturnType<typeof selectors.hasPendingChanges>
  undoable: boolean
  redoable: boolean
  serializeRootDocument: () => unknown | null
}

interface DispatchProps {
  persist: () => void
  undo: () => void
  redo: () => void
}

interface OwnProps {
  changes?: StateType.StateDescriptorReturnType<typeof entity['changes']>
  license?: StateType.StateDescriptorReturnType<typeof entity['license']>
  subscriptions?: boolean
}
