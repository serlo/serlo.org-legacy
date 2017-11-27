import uuid from 'uuid'
import transform from './src/transform'
import split from './src/split'
import markdownToSlate from './src/markdownToSlate'

const convert = (content, id) => {
  const cells = markdownToSlate(split(transform(content)))
  return {
    id: uuid(),
    ...cells
  }
}

export default convert
