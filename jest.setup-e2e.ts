import { Browser, launch, Page } from 'puppeteer'

function setTimeout(seconds: number): void {
  jest.setTimeout(seconds * 1000)
}

setTimeout(60)

let browser: Browser
let page: Page

beforeAll(async () => {
  browser = await launch()
})

beforeEach(async () => {
  page = await browser.newPage()
})

afterEach(async () => {
  await page.close()
})

afterAll(async () => {
  await browser.close()
})
