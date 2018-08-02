# crwlr [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> a minimal puppeteer crawler api

## Huh?

- crwlr:
  - handles the boring boilerplate work of actually crawling a site
- You provide:
  - a url to start from
  - a puppeteer browser instance with your own `.launch(options)`
  - your own page options to be applied
    - events, like on: `request`, `console`, etc.
    - `page.goto(options)`, like `waitUntil`
    - `resolve(page)`, fires after `page.goto()` has resolved

## Installation

```sh
$ npm install --save crwlr
```

## Usage

### Basic Example - Without Any Options

```js
'use strict';

const puppeteer = require('puppeteer');
const crwlr = require('crwlr');

const site = 'https://https.netlify.com/';

(async () => {
  const browser = await puppeteer.launch();
  let crawledPages = await crwlr(browser, site);
  console.log(`=> crawledPages: ${crawledPages}`);
})();
// => crawledPages: https://https.netlify.com/
```

### Advanced Example - With Options

```js
'use strict';

const puppeteer = require('puppeteer');
const crwlr = require('crwlr');

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
// => requested: https://https.netlify.com/redirect.js
// => resolved: https://https.netlify.com/
// => crawledPages: https://https.netlify.com/
```

## License

ISC © [Buster Collings]()

[npm-image]: https://badge.fury.io/js/crwlr.svg
[npm-url]: https://npmjs.org/package/crwlr
[travis-image]: https://travis-ci.org/busterc/crwlr.svg?branch=master
[travis-url]: https://travis-ci.org/busterc/crwlr
[daviddm-image]: https://david-dm.org/busterc/crwlr.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/busterc/crwlr
[coveralls-image]: https://coveralls.io/repos/busterc/crwlr/badge.svg
[coveralls-url]: https://coveralls.io/r/busterc/crwlr
