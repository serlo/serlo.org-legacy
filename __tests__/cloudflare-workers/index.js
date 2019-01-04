/* eslint-env jest */
import { handleRequest } from '../../src/cloudflare-workers'

expect.extend({
  toHaveBeenCalledWithRequest(fetch, req) {
    try {
      expect(fetch).toHaveBeenCalledTimes(1)

      const [arg1, arg2] = fetch.mock.calls[0]

      if (typeof arg1 === 'string') {
        expect({ ...arg2, url: arg1 }).toEqual(req)
      } else {
        expect(arg1).toEqual(req)
      }

      return {
        pass: true
      }
    } catch (err) {
      return {
        pass: false,
        message: () => err.message
      }
    }
  }
})

describe('Cloudflare Workers', () => {
  let fetch
  let Response

  beforeEach(() => {
    fetch = jest.fn((...args) => {
      return true
    })
    Response = {
      redirect: jest.fn()
    }
    window.fetch = fetch
    window.Response = Response
  })

  describe('Redirects', () => {
    it('start.serlo.org (https)', async () => {
      await handleRequest({
        url:
          'https://start.serlo.org'
      })

      expect(Response.redirect).toHaveBeenCalledWith('https://docs.google.com/document/d/1qsgkXWNwC-mcgroyfqrQPkZyYqn7m1aimw2gwtDTmpM/')
    })

    it('start.serlo.org (http)', async () => {
      await handleRequest({
        url:
          'http://start.serlo.org'
      })

      expect(Response.redirect).toHaveBeenCalledWith('https://docs.google.com/document/d/1qsgkXWNwC-mcgroyfqrQPkZyYqn7m1aimw2gwtDTmpM/')
    })
  })

  describe('semantic file names for assets', () => {
    it('does rewrite semantic file names', async () => {
      await handleRequest({
        url:
          'https://assets.serlo.org/58eb97b7e5376_7d4211710d8bab642798e39e07788e6f2912e86a/door-handle.gif'
      })

      expect(fetch).toHaveBeenCalledWithRequest({
        url:
          'https://assets.serlo.org/58eb97b7e5376_7d4211710d8bab642798e39e07788e6f2912e86a.gif'
      })
    })

    it('does rewrite semantic file names (legacy)', async () => {
      await handleRequest({
        url:
          'https://assets.serlo.org/legacy/58eb97b7e5376_7d4211710d8bab642798e39e07788e6f2912e86a/door-handle.gif'
      })

      expect(fetch).toHaveBeenCalledWithRequest({
        url:
          'https://assets.serlo.org/legacy/58eb97b7e5376_7d4211710d8bab642798e39e07788e6f2912e86a.gif'
      })
    })

    it(`doesn't rewrite non-semantic file names`, async () => {
      await handleRequest({
        url:
          'https://assets.serlo.org/58eb97b7e5376_7d4211710d8bab642798e39e07788e6f2912e86a.gif'
      })

      expect(fetch).toHaveBeenCalledWithRequest({
        url:
          'https://assets.serlo.org/58eb97b7e5376_7d4211710d8bab642798e39e07788e6f2912e86a.gif'
      })
    })

    it(`doesn't rewrite non-semantic file names (legacy)`, async () => {
      await handleRequest({
        url:
          'https://assets.serlo.org/legacy/58eb97b7e5376_7d4211710d8bab642798e39e07788e6f2912e86a.gif'
      })

      expect(fetch).toHaveBeenCalledWithRequest({
        url:
          'https://assets.serlo.org/legacy/58eb97b7e5376_7d4211710d8bab642798e39e07788e6f2912e86a.gif'
      })
    })

    it(`doesn't rewrite requests to meta directory`, async () => {
      await handleRequest({
        url: 'https://assets.serlo.org/meta/serlo.jpg'
      })

      expect(fetch).toHaveBeenCalledWithRequest({
        url: 'https://assets.serlo.org/meta/serlo.jpg'
      })
    })

    it(`doesn't rewrite requests to meta subdirectories`, async () => {
      await handleRequest({
        url: 'https://assets.serlo.org/meta/de/serlo.jpg'
      })

      expect(fetch).toHaveBeenCalledWithRequest({
        url: 'https://assets.serlo.org/meta/de/serlo.jpg'
      })
    })
  })
})
