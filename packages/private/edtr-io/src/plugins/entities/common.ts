import { StateType } from '@edtr-io/core'

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
  changes: StateType.string(),
}

export type StandardElements = StateType.StateDescriptorsSerializedType<typeof standardElements>

