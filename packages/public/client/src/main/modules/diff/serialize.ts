import { safeDump } from 'js-yaml'

export function serialize(
  state: Object,
): string {
  return safeDump(dumb(state))
}

function dumb(
  state: Object,
): Object {
  if (state.plugin == "spoiler") {
    let spoiler_header = "spoiler(" + state.state.title + ")"
    let spoiler = Object()
    spoiler[spoiler_header] = dumb(state.state.content)
    return spoiler
  }
  return state
}
