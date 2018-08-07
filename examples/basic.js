'use strict';

const puppeteer = require('puppeteer');
const crwlr = require('../lib');

const site = 'https://buster.neocities.org/crwlr/';

// *** Basic Example Without Any Options *** //
(async () => {
  const browser = await puppeteer.launch();
  let crawledPages = await crwlr(browser, site);
  console.log(crawledPages);
})();
/*
[ 'https://buster.neocities.org/crwlr/',
  'https://buster.neocities.org/crwlr/other.html',
  'https://buster.neocities.org/crwlr/mixed-content.html',
  'https://buster.neocities.org/crwlr/missing.html',
  'https://buster.neocities.org/crwlr/dummy.pdf' ]
*/
