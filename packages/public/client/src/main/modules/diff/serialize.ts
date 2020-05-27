import { safeDump } from 'js-yaml'

export function serialize(
  state: Object,
): string {
  return safeDump(state)  
}
