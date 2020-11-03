const puppeteer = require('puppeteer')

const data = require('./urls.json').data
const urls = data.map(url => new URL(url).origin).slice(0, 20)

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

  // Try to launch the browser and exit on fail
  const browser = await puppeteer.launch({
    // headless:false
  }).catch(() => undefined)

  if (!browser) {
    return
  }

  let page

  // Retrieve the 'robots.txt'
  page = await browser.newPage()
  await page.goto(`${url}/robots.txt`)
  // Here, we could parse the robots.txt to ensure we have
  // permission to proceed with scraping data we are interested in
  // but let's just pretend for now...
  const permissions = await page.content()
  await page.close()

  // Open the home page
  page = await browser.newPage()
  await page.goto(url)

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

  // Write out the data - should be serialised as JSON...
  console.log({
    title,
    description,
    links
  })

})


