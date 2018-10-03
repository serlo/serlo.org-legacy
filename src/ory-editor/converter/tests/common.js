import unexpected from 'unexpected'
import { slatePlugin } from '@serlo-org/editor-plugins/lib/slate'

const expectInstance = unexpected.clone()

/**
 * Remove all specified keys from an object, no matter how deep they are.
 * The removal is done in place, so run it on a copy if you don't want to modify the original object.
 * This function has no limit so circular objects will probably crash the browser
 *
 * @param obj The object from where you want to remove the keys
 * @param keys An array of property names (strings) to remove
 */
const removeKeys = (obj, keys) => {
  let index
  for (let prop in obj) {
    // important check that this is objects own property
    // not from prototype prop inherited
    if (obj.hasOwnProperty(prop)) {
      switch (typeof obj[prop]) {
        case 'string':
          index = keys.indexOf(prop)
          if (index > -1) {
            delete obj[prop]
          }
          break
        case 'object':
          index = keys.indexOf(prop)
          if (index > -1) {
            delete obj[prop]
          } else {
            removeKeys(obj[prop], keys)
          }
          break
      }
    }
  }
}

const ignoreIrrelevantKeys = obj => removeKeys(obj, ['id'])

export const expect = (input, method, output) => {
  expectInstance(
    ignoreIrrelevantKeys(input),
    method,
    ignoreIrrelevantKeys(output)
  )
}

export const expectSlate = html => ({
  content: {
    plugin: { name: slatePlugin.name, version: slatePlugin.version },
    state: slatePlugin.serialize(
      slatePlugin.unserialize({
        importFromHtml: html
      })
    )
  }
})
