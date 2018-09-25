require.extensions['.css'] = () => {
  return null
}
require('@babel/register')({
  ignore: [
    path => {
      return path.indexOf('node_modules') !== -1
    }
  ],
  extensions: ['.tsx', '.ts', '.js']
})
require('./server')
