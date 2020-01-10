import { Browser, launch, Page } from 'puppeteer'

setTimeout(60)

let browser: Browser
let page: Page

beforeAll(async () => {
  browser = await launch()
  page = await browser.newPage()
})

afterAll(async () => {
  await page.close()
  await browser.close()
})

function setTimeout(seconds: number) {
  jest.setTimeout(seconds * 1000)
}
