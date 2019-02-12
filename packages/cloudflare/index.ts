// @ts-ignore
import * as createCloudflare from 'cloudflare'

export const zoneId = '1a4afa776acb2e40c3c8a135248328ae'
export const secret = require('./cloudflare.secret.json')

export const cloudflare = createCloudflare(secret)
