import transform from './src/transform'
import split from './src/split'
import markdownToSlate from './src/markdownToSlate'

const convert = (content, id) => {
  const cells = split(transform(content))
  return {
    id: id,
    ...cells
  }
}

export default convert
