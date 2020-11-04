## A Basic Web Scraper implemented using Puppeteer


### Running the Scraper

- `npm i`
- `npm run start`

#### Options for creating a web scraper in in Node.js are:

- Request a page using http client lib and then parse the response using regular
  expressions to extract the data you are looking for...
- As above but use a lib such as (JSDom)[https://www.npmjs.com/package/jsdom] to
  parse the response and structure into a virtual DOM...
- Use (Puppeteer)[https://pptr.dev] to run headless (or headful) chrome and use
  the interface it provides to interact with the browser DOM...


#### Aims of this project are:

- Use Puppeteer to scrape data for provided urls
- Data to scrape are page title, SEO site description, social media handles for
  site owner...


#### Resources

https://pptr.dev/#?product=Puppeteer&version=v5.4.1
https://developers.google.com/web/tools/puppeteer/
https://theheadless.dev/posts/basics-scraping/


#### Converting to Typescript

This project is intended to be converted to TS. Install the type definitions for
Puppeteer (https://www.npmjs.com/package/@types/puppeteer). Convert aspects in
incremental fashion, e.g. scraping/transforming the social media handles can be
left for later... If you make a lot of progress, there are many improvements to
be made such as:

- better error handling
- improve the data selection - on some sites we do not access all the items
- modularise the project (a `scraper.ts` module, a `browser.ts` module etc.)
- extract functionality into reusable functions
- provide a way to process the input list in batches (instead of just selecting
  a subset)
- write the output to a file using `fs` module or shell commands


#### NOTES

> Everything in Puppeteer is a Promise
> Watch out for handing of multiple async actions
> Watch out for method of passing arguments to puppeteer `page.evaluate`...
