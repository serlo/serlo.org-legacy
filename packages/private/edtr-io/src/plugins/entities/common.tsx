import * as React from 'react'
import {
  actions,
  StateType,
  connect as connectStore,
  selectors,
  OverlayContext,
  ScopedActionCreator
} from '@edtr-io/core'
import { Overlay, Checkbox, Button } from '@edtr-io/editor-ui'
import axios from 'axios'
import { Parameters } from 'ts-toolbelt/out/types/src/Function/Parameters'

export const licenseState = StateType.object({
  id: StateType.number(),
  title: StateType.string(),
  url: StateType.string(),
  agreement: StateType.string(),
  iconHref: StateType.string()
})

export const standardElements = {
  id: StateType.number(),
  license: licenseState,
  changes: StateType.string()
}

export type StandardElements = StateType.StateDescriptorsSerializedType<
  typeof standardElements
>

const connect = connectStore<
  StateProps,
  { persist: ScopedActionCreator<typeof actions.persist> },
  { scope: string }
>(
  state => {
    return {
      hasPendingChanges: selectors.hasPendingChanges(state),
      serializeRootDocument: () => {
        const serialized = selectors.serializeRootDocument(state)
        return serialized ? serialized.state : null
      }
    }
  },
  {
    persist: actions.persist
  }
)

export const SaveButton = connect(function SaveButton(
  props: StateProps & DispatchProps
) {
  console.log(window.location.pathname)

  const overlay = React.useContext(OverlayContext)
  const [agreement, setAgreement] = React.useState(false)
  const [emailSubscription, setEmailSubscription] = React.useState(false)
  const [notificationSubscription, setNotificationSubscription] = React.useState(false)
  return (
    <React.Fragment>
      <button
        onClick={() => {
          overlay.show()
        }}
        disabled={!props.hasPendingChanges}
      >
        Speichern
      </button>
      <Overlay>
        <Checkbox
          label="Lizenzbedingung akzeptieren"
          checked={agreement}
          onChange={setAgreement}
        />
        <Checkbox
          label="Benachrichtigungen auf Serlo erhalten"
          checked={notificationSubscription}
          onChange={setNotificationSubscription}
        />
        <Checkbox
          label="Benachrichtigungen per Email erhalten"
          checked={emailSubscription}
          onChange={setEmailSubscription}
        />
        <Button
          onClick={() => {
            if (!agreement) return
            const serialized = props.serializeRootDocument()
            console.log(serialized)
            axios
              .post(window.location.pathname, {
                ...serialized,
                //@ts-ignore TODO: maybe pass this via props because should be typed in client
                csrf: window.csrf,
                controls: {
                  subscription: {
                    subscribe: notificationSubscription ? 1 : 0,
                    mailman: emailSubscription ? 1 : 0
                  }
                }
              })
              .then(val => {
                console.log(val)
                overlay.hide()
                props.persist()
                window.location = val.data.redirect
              })
              .catch(err => {
                console.error(err)
              })
          }}
          disabled={!agreement}
          title={
            !agreement
              ? 'Du musst zuerst die Lizenzbedingungen akzeptieren.'
              : undefined
          }
        >
          Speichern
        </Button>
      </Overlay>
    </React.Fragment>
  )
})

export function editorContent() : StateType.StateDescriptor<string,
  StateType.StateDescriptorValueType<ReturnType<typeof StateType.child>>,
  StateType.StateDescriptorReturnType<ReturnType<typeof StateType.child>>
>{
  const child = StateType.child('rows')
  const { serialize, deserialize } = child
  return Object.assign(child, {
    serialize(...args: Parameters<typeof child.serialize>) {
      return JSON.stringify(serialize(...args));
    },
    deserialize(serialized: string, helpers: Parameters<typeof child.deserialize>[1]) {
      console.log('stateType', serialized)
      return deserialize(JSON.parse(serialized), helpers)
    }
  })
}




interface StateProps {
  hasPendingChanges: ReturnType<typeof selectors.hasPendingChanges>
  serializeRootDocument: () => unknown | null
}

interface DispatchProps {
  persist: () => void
}
