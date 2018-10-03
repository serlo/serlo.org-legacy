import { render as r } from './server-render'

export const render = (req, res) => {
  const input = req.body.state

  r(input, html => {
    res.status(200).send({ html })
  })
}
