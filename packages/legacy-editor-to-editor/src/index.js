import split from './split'
import transform from './transform'

export function convert(content, id) {
  const cells = split(transform(content))
  return {
    ...cells,
    id
  }
}
