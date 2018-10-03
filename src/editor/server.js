import express from 'express'
import bodyParser from 'body-parser'

import { render } from './index.gcf'

const app = express()

app.use(bodyParser.json())

app.post('/', (...args) => {
  console.log('incoming request')
  render(...args)
})

app.listen(3000, () => {
  console.log('Listening...')
})
