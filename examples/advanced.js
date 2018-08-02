'use strict';

const puppeteer = require('puppeteer');
const crwlr = require('../lib');

const site = 'https://https.netlify.com/';

// *** Advanced Example With Options *** //
(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const pageOptions = {
    resolve: page => {
      console.log(`=> resolved: ${page.url()}`);
    },
    goto: {
      waitUntil: 'networkidle2'
    },
    events: {
      request: page => {
        if (page.url().match(/\.js$/)) {
          console.log(`=> requested: ${page.url()}`);
        }
      }
    }
  };

  let crawledPages = await crwlr(browser, site, pageOptions);
  console.log(`=> crawledPages: ${crawledPages}`);
})();
