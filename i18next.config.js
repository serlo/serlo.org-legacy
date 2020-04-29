const createTypescriptTransform = require('i18next-scanner-typescript')

module.exports = {
  input: [
    'packages/public/client/src/{editor,frontend,legacy-editor,libs,main,modules}/**/*.{js,jsx,ts,tsx}',
    'packages/public/frontend/{src,pages}/**/*.{js,jsx,ts,tsx}'
  ],
  output: './',
  options: {
    func: {
      list: ['i18next.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    lngs: ['en'],
    ns: ['default'],
    defaultLng: 'en',
    defaultNs: 'default',
    removeUnusedKeys: true,
    resource: {
      loadPath: 'i18n/{{ns}}.json',
      savePath: 'i18n/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    defaultValue(lng, ns, key) {
      return key
    }
  },
  transform: createTypescriptTransform()
}
