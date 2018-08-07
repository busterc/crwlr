'use strict';

const puppeteer = require('puppeteer');
const crwlr = require('../lib');

const site = 'https://buster.neocities.org/crwlr/';

// *** Advanced Example With Options *** //
(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const pageOptions = {
    prepare: page => {
      page.on('request', request => {
        if (request.url().match(/\.js$/)) {
          console.log(`${page.url()} => requested: ${request.url()}`);
        }
      });
    },
    goto: {
      waitUntil: 'networkidle2'
    },
    resolved: (response, page) => {
      console.log(`=> resolved: ${response.status()} ${page.url()}`);
    }
  };

  await crwlr(browser, site, pageOptions);
})();
/*
=> resolved: 200 https://buster.neocities.org/crwlr/
=> resolved: 200 https://buster.neocities.org/crwlr/other.html
https://buster.neocities.org/crwlr/mixed-content.html => requested: https://mixed-script.badssl.com/nonsecure.js
=> resolved: 200 https://buster.neocities.org/crwlr/mixed-content.html
=> resolved: 404 https://buster.neocities.org/crwlr/missing.html
=> resolved: 200 https://buster.neocities.org/crwlr/dummy.pdf
*/
