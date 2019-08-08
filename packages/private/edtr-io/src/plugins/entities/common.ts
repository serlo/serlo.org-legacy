import { StateType } from '@edtr-io/core'
import { convert, Legacy, Splish } from '@serlo/legacy-editor-to-editor'

const legacy = StateType.scalar<Legacy|Splish>([[ {col: 24, content:''} ]])
// @ts-ignore
export const legacyOrChild : ReturnType<typeof StateType.child> = StateType.migratable(legacy).migrate(StateType.child(),convert)

export const licenseState = StateType.object({
  id: StateType.number(),
  title: StateType.string(),
  url: StateType.string(),
  agreement: StateType.string(),
  iconHref: StateType.string()
})