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
import {
  useScopedDispatch,
  useScopedSelector,
  useScopedStore
} from '@edtr-io/core'
import {
  StateType,
  StateTypesSerializedType,
  StateTypeValueType,
  StateTypeReturnType,
  child,
  number,
  object,
  string
} from '@edtr-io/plugin'
import { styled } from '@edtr-io/ui'
import { button } from '@storybook/addon-knobs'
import * as React from 'react'
import BSAlert from 'react-bootstrap/lib/Alert'
import BSModal from 'react-bootstrap/lib/Modal'
import BSButton from 'react-bootstrap/lib/Button'
import BSCheckbox from 'react-bootstrap/lib/Checkbox'
import BSFormGroup from 'react-bootstrap/lib/FormGroup'
import BSControlLabel from 'react-bootstrap/lib/ControlLabel'
import BSFormControl from 'react-bootstrap/lib/FormControl'
import { createPortal } from 'react-dom'

import { SaveContext } from '../../editor'
import {
  getRedoStack,
  getUndoStack,
  hasPendingChanges,
  redo,
  serializeRootDocument,
  undo
} from '@edtr-io/store'

export const licenseState = object({
  id: number(),
  title: string(),
  url: string(),
  agreement: string(),
  iconHref: string()
})

export const uuid = {
  id: number()
}

export const license = {
  license: licenseState
}

export const entity = {
  ...uuid,
  ...license,
  changes: string()
}
import { generate } from 'shortid'

export type Uuid = StateTypesSerializedType<typeof uuid>

export type License = StateTypesSerializedType<typeof license>

export type Entity = Uuid & License & { changes?: string }

export const HeaderInput = styled.input({
  border: 'none',
  width: '100%',
  borderBottom: '2px solid transparent',
  '&:focus': {
    outline: 'none',
    borderColor: '#007ec1'
  }
})

export function Controls(props: OwnProps) {
  const store = useScopedStore()
  const dispatch = useScopedDispatch()
  const undoable = useScopedSelector(getUndoStack).length > 0
  const redoable = useScopedSelector(getRedoStack).length > 0
  const pendingChanges = useScopedSelector(hasPendingChanges)

  const [visible, setVisibility] = React.useState(false)
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
    if (visible) {
      // Reset license agreement
      setPending(false)
      setHasError(false)
      setAgreement(false)
    }
  }, [visible])

  React.useEffect(() => {
    window.onbeforeunload = pendingChanges && !pending ? () => '' : null
  }, [pendingChanges, pending])

  return (
    <React.Fragment>
      {createPortal(
        <div className="btn-group btn-group-community">
          <button
            className="btn btn-default"
            onClick={() => {
              dispatch(undo())
            }}
            disabled={!undoable}
          >
            <span className="fa fa-undo"></span>
          </button>
          <button
            className="btn btn-default"
            onClick={() => {
              dispatch(redo())
            }}
            disabled={!redoable}
          >
            <span className="fa fa-repeat"></span>
          </button>
          {renderSaveButton()}
        </div>,
        document.getElementsByClassName('controls')[0]
      )}
      <BSModal
        show={visible}
        onHide={() => {
          setVisibility(false)
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
              setVisibility(false)
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

  function renderSaveButton() {
    const useOverlay = props.changes || props.license || props.subscriptions
    const buttonProps = useOverlay
      ? {
          onClick() {
            setVisibility(true)
          },
          disabled: !pendingChanges,
          children: <span className="fa fa-save" />
        }
      : {
          onClick() {
            handleSave()
          },
          disabled: !pendingChanges || !maySave() || pending,
          children: pending ? (
            <span className="fa fa-spinner fa-spin" />
          ) : (
            <span className="fa fa-save" />
          )
        }

    return <button className="btn btn-success" {...buttonProps} />
  }

  function maySave() {
    if (!props.license) return true
    return agreement
  }

  function handleSave() {
    if (!maySave()) return
    const serializedRoot = serializeRootDocument()(store.getState())
    const serialized = serializedRoot
      ? (serializedRoot as { state: unknown }).state
      : null
    setPending(true)
    save({
      ...serialized,
      // @ts-ignore TODO: maybe pass this via props because should be typed in client
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
}

export function editorContent(): StateType<
  string,
  StateTypeValueType<ReturnType<typeof child>>,
  StateTypeReturnType<ReturnType<typeof child>>
> {
  const originalChild = child('rows')
  return {
    ...originalChild,
    serialize(...args: Parameters<typeof originalChild.serialize>) {
      return JSON.stringify(originalChild.serialize(...args))
    },
    deserialize(
      serialized: string,
      helpers: Parameters<typeof originalChild.deserialize>[1]
    ) {
      console.log('stateType', serialized)
      return originalChild.deserialize(JSON.parse(serialized), helpers)
    }
  }
}

export function serializedChild(
  plugin: string
): StateType<
  unknown,
  StateTypeValueType<ReturnType<typeof child>>,
  StateTypeReturnType<ReturnType<typeof child>>
> {
  const originalChild = child(plugin)
  return {
    ...originalChild,
    serialize(...args: Parameters<typeof originalChild.serialize>) {
      return originalChild.serialize(...args).state
    },
    deserialize(
      serialized: string,
      helpers: Parameters<typeof originalChild.deserialize>[1]
    ) {
      return originalChild.deserialize(
        {
          plugin,
          state: serialized
        },
        helpers
      )
    }
  }
}

export function optionalSerializedChild(plugin: string) {
  const child = serializedChild(plugin)
  return {
    ...child,
    init(...[state, onChange]: Parameters<typeof child.init>) {
      return {
        ...child.init(state, onChange),
        create(state?: unknown) {
          onChange((_oldId, helpers) => {
            const id = generate()
            helpers.createDocument({ id, plugin, state })
            return id
          })
        }
      }
    },
    serialize(
      deserialized: string,
      helpers: Parameters<typeof child.serialize>[1]
    ) {
      if (!deserialized) return null
      return child.serialize(deserialized, helpers)
    },
    deserialize(
      serialized: string | null,
      helpers: Parameters<typeof child.deserialize>[1]
    ) {
      if (!serialized) return null
      return child.deserialize(serialized, helpers)
    },
    createInitialState(){
      return null
    }
  }
}

interface OwnProps {
  changes?: StateTypeReturnType<typeof entity['changes']>
  license?: StateTypeReturnType<typeof entity['license']>
  subscriptions?: boolean
}
