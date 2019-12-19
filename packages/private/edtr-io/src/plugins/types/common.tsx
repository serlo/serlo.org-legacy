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
  StateTypeSerializedType,
  StateTypesValueType,
  StateTypeValueType,
  StateTypesReturnType,
  StateTypeReturnType,
  StateUpdater,
  child,
  number,
  object,
  string
} from '@edtr-io/plugin'
import {
  getDocument,
  getRedoStack,
  getUndoStack,
  hasPendingChanges,
  redo,
  serializeRootDocument,
  undo
} from '@edtr-io/store'
import { styled } from '@edtr-io/ui'
import { button } from '@storybook/addon-knobs'
import * as R from 'ramda'
import * as React from 'react'
import BSAlert from 'react-bootstrap/lib/Alert'
import BSModal from 'react-bootstrap/lib/Modal'
import BSButton from 'react-bootstrap/lib/Button'
import BSCheckbox from 'react-bootstrap/lib/Checkbox'
import BSFormGroup from 'react-bootstrap/lib/FormGroup'
import BSControlLabel from 'react-bootstrap/lib/ControlLabel'
import BSFormControl from 'react-bootstrap/lib/FormControl'
import { createPortal } from 'react-dom'

import { CsrfContext } from '../../csrf-context'
import { SaveContext, storeState } from '../../editor'
import { coursePageTypeState } from './course-page'

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
  revision: number(),
  changes: string()
}

export type Uuid = StateTypesSerializedType<typeof uuid>

export type License = StateTypesSerializedType<typeof license>

export type Entity = Uuid & License & { revision: number; changes?: string }

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
  const getCsrfToken = React.useContext(CsrfContext)

  const [visible, setVisibility] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [savedToLocalstorage, setSavedToLocalstorage] = React.useState(false)
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
      setSavedToLocalstorage(false)
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
            title={getSaveHint()}
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

  function licenseAccepted() {
    return !props.license || agreement
  }
  function changesFilledIn() {
    return !props.changes || props.changes.value
  }
  function maySave() {
    return licenseAccepted() && changesFilledIn()
  }

  function getSaveHint() {
    if (maySave()) return undefined
    if (licenseAccepted() && !changesFilledIn()) {
      return 'Du musst zuerst die Änderungen ausfüllen.'
    } else if (!licenseAccepted() && changesFilledIn()) {
      return 'Du musst zuerst die Lizenzbedingungen akzeptieren.'
    } else {
      return 'Du musst zuerst die Lizenzbedingungen akzeptieren und die Änderungen ausfüllen'
    }
  }

  function handleSave() {
    if (!maySave()) return
    const serializedRoot = serializeRootDocument()(store.getState())
    const serialized = serializedRoot
      ? (serializedRoot as { state: object }).state
      : null
    setPending(true)
    save({
      ...serialized,
      csrf: getCsrfToken(),
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
        storeState(undefined)
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
      <React.Fragment>
        <BSAlert
          bsStyle="danger"
          onDismiss={() => {
            setHasError(false)
          }}
        >
          Speichern ist leider fehlgeschlagen. Bitte schnappe dir einen
          Entwickler. <br />
          <br />
          Du kannst die Bearbeitung lokal zwischenspeichern, dann die Seite neu
          laden und es erneut versuchen.
        </BSAlert>
        <BSModal.Footer>
          <BSButton
            bsStyle="success"
            onClick={() => {
              const serializedRoot = serializeRootDocument()(store.getState())
              storeState(serializedRoot)
              setSavedToLocalstorage(true)
            }}
          >
            {savedToLocalstorage
              ? 'Bearbeitung gespeichert!'
              : 'Bearbeitung zwischenspeichern'}
          </BSButton>
        </BSModal.Footer>
      </React.Fragment>
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

export function entityType<
  Ds extends Record<string, StateType>,
  Childs extends Record<string, StateType>
>(
  ownTypes: Ds,
  children: Childs,
  getFocusableChildren?: (
    children: { [K in keyof Ds]: { id: string }[] }
  ) => { id: string }[]
): StateType<
  StateTypesSerializedType<Ds & Childs>,
  StateTypesValueType<Ds & Childs>,
  StateTypesReturnType<Ds & Childs> & {
    replaceOwnState: (newValue: StateTypesSerializedType<Ds>) => void
  }
> {
  const objectType = object<Ds & Childs>(
    { ...ownTypes, ...children },
    getFocusableChildren
  )
  return {
    ...objectType,
    init(state, onChange, pluginProps) {
      const initialisedObject = objectType.init(state, onChange, pluginProps)
      return {
        ...initialisedObject,
        replaceOwnState(newValue) {
          onChange((previousState, helpers) => {
            return R.mapObjIndexed((value, key) => {
              if (key in ownTypes) {
                return ownTypes[key].deserialize(newValue[key], helpers)
              } else {
                return previousState[key]
              }
            }, previousState) as StateTypesValueType<Ds & Childs>
          })
        }
      }
    }
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

export function optionalSerializedChild(
  plugin: string
): StateType<
  StateTypeSerializedType<ReturnType<typeof serializedChild>> | null,
  StateTypeValueType<ReturnType<typeof serializedChild>> | null,
  StateTypeReturnType<ReturnType<typeof serializedChild>> & {
    create: (state?: unknown) => void
    remove: () => void
  }
> {
  const child = serializedChild(plugin)
  return {
    ...child,
    init(
      state: string,
      onChange: (updater: StateUpdater<string | null>) => void
    ) {
      return {
        ...child.init(state, updater => {
          onChange((oldId, helpers) => {
            return updater(oldId || '', helpers)
          })
        }),
        create(state?: unknown) {
          onChange((_oldId, helpers) => {
            if (typeof state !== 'undefined') {
              return child.deserialize(state, helpers)
            }
            return child.createInitialState(helpers)
          })
        },
        remove() {
          onChange(() => null)
        }
      }
    },
    serialize(
      deserialized: string | null,
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
    createInitialState() {
      return null
    }
  }
}

const RemoveButton = styled.button({
  borderRadius: '50%',
  outline: 'none',
  background: 'white',
  zIndex: 20,
  float: 'right',
  transform: 'translate(50%, -40%)',
  border: '2px solid lightgrey',
  '&:hover': {
    border: '3px solid #007ec1',
    color: '#007ec1'
  }
})

export function OptionalChild(props: {
  state: StateTypeReturnType<ReturnType<typeof serializedChild>>
  onRemove: () => void
}) {
  const document = useScopedSelector(getDocument(props.state.id)) as {
    plugin: 'type-course-page'
    state: StateTypeValueType<typeof coursePageTypeState>
  }

  return (
    <React.Fragment>
      <hr />
      {document.state.id === 0 ? (
        <RemoveButton
          onClick={() => {
            props.onRemove()
          }}
        >
          x
        </RemoveButton>
      ) : null}
      {props.state.render({ skipControls: true })}
    </React.Fragment>
  )
}

interface OwnProps {
  changes?: StateTypeReturnType<typeof entity['changes']>
  license?: StateTypeReturnType<typeof entity['license']>
  subscriptions?: boolean
}
