# crwlr [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

> a minimal puppeteer crawler api

## Huh?

- crwlr:
  - handles the boring boilerplate work of actually crawling a site
- You provide:
  - &lt;String&gt; `url` to start from
  - &lt;Puppeteer Browser&gt; `browser` instance with your own `.launch(options)`
  - `pageOptions` as you wish:
    - &lt;Object&gt; `goto` to be provided as options to `page.goto(url, options)`
    - &lt;Function&gt; `prepare(page)` binds event handlers and/or set properties for every new page
    - &lt;Function&gt; `resolved(response, page)` fires after every `page.goto()` has resolved

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
```

### Advanced Example - With Options

```js
'use strict';

const puppeteer = require('puppeteer');
const crwlr = require('crwlr');

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
[greenkeeper-image]: https://badges.greenkeeper.io/busterc/crwlr.svg
[greenkeeper-url]: https://greenkeeper.io/
