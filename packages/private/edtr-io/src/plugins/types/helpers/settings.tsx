import { StateType } from '@edtr-io/core'
import { faCog, Icon } from '@edtr-io/editor-ui'
import { styled } from '@edtr-io/ui'
import * as React from 'react'
import BSButton from 'react-bootstrap/lib/Button'
import BSFormControl from 'react-bootstrap/lib/FormControl'
import BSControlLabel from 'react-bootstrap/lib/ControlLabel'
import BSFormGroup from 'react-bootstrap/lib/FormGroup'
import BSModal from 'react-bootstrap/lib/Modal'

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

function SettingsIcon(props: { open: () => void }) {
  return (
    <span onClick={props.open}>
      <StyledIconContainer title="Einstellungen">
        <Icon icon={faCog} size="lg" />
      </StyledIconContainer>
    </span>
  )
}

export function Settings(props: React.PropsWithChildren<{}>) {
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

Settings.Textarea = function SettingsTextarea({
  label,
  state
}: {
  label: string
  state: StateType.StateDescriptorReturnType<
    ReturnType<typeof StateType.string>
  >
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
  state: StateType.StateDescriptorReturnType<
    ReturnType<typeof StateType.string>
  >
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
