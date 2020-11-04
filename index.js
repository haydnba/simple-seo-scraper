const puppeteer = require('puppeteer')

const data = require('./urls.json').data
const urls = data.map(url => new URL(url).origin).slice(0, 10)

// List of social media platforms
const socials = [
  'facebook',
  'instagram',
  'pinterest',
  'tiktok',
  'twitter',
  'youtube'
]

urls.map(async url => {

  let browser
  let page

  /**
   * Launching the browser instance.
   *
   * https://pptr.dev/#?product=Puppeteer&version=v5.4.1&show=api-puppeteerlaunchoptions
   */

  try {
    // Try to launch the browser instance
    // Access will be disallowed to headless mode on some sites...
    browser = await puppeteer.launch({
      // headless: false
    })
  } catch {
    // Exit on failure
    return
  }

  /**
   * Loading browser tabs.
   *
   * https://pptr.dev/#?product=Puppeteer&version=v5.4.1&show=api-browsernewpage
   * https://pptr.dev/#?product=Puppeteer&version=v5.4.1&show=api-pagegotourl-options
   */

  try {
    // Retrieve the 'robots.txt'
    page = await browser.newPage()
    await page.goto(`${url}/robots.txt`)
    // Here, we could parse the robots.txt to ensure we have
    // permission to proceed with scraping data we are interested in
    // but let's just pretend for now...
    const _permissions = await page.content()
    await page.close()
  } catch {
    // Absorb any exception and continue
  }

  try {
    // Open the home page
    page = await browser.newPage()
    await page.goto(url)
  } catch {
    // Exit if the page load times-out etc.
    return
  }

  /**
   * Evaluating JS in the page context.
   *
   * https://pptr.dev/#?product=Puppeteer&version=v5.4.1&show=api-pageevaluatepagefunction-args
   */

  // Retrieve the page title
  const title = await page.evaluate(() => {
    return document.querySelector('TITLE').textContent.trim()
  }).catch(() => undefined)

  // Retrieve the page description
  const description = await page.evaluate(() => {
    return document.querySelector('META[name="description"]').content
  }).catch(() => undefined)

  // For each of `socials`, try to scrape corresponding handle for `url`
  const links = await Promise.all(socials.map(async platform => {
    const result = {}

    const href = await page.evaluate(p => {
      return document.querySelector(`A[href*="${p}.com"]`).href
    }, platform).catch(() => undefined)

    result[platform] = href

    return result
  })).then(([first, ...rest]) => Object.assign(first, ...rest))

  // Close the browser instance
  await browser.close()

  // Write out the data - could be serialised as JSON...
  console.log({
    title,
    description,
    links
  })

})
