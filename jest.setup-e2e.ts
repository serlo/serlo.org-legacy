import { Browser, launch, Page } from 'puppeteer'

function setTimeout(seconds: number): void {
  jest.setTimeout(seconds * 1000)
}

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
