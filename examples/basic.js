'use strict';

const puppeteer = require('puppeteer');
const crwlr = require('../lib');

const site = 'https://https.netlify.com/';

// *** Basic Example Without Any Options *** //
(async () => {
  const browser = await puppeteer.launch();
  let crawledPages = await crwlr(browser, site);
  console.log(`=> crawledPages: ${crawledPages}`);
})();
// => crawledPages: https://https.netlify.com/
