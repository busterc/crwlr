'use strict';

const getHrefs = require('./getHrefs.js');

const _pageOptions = {
  goto: { waitUntil: 'networkidle2' },
  events: {},
  resolve: () => {}
};

module.exports = async (browser, url, pageOptions = {}) => {
  pageOptions = { ..._pageOptions, ...pageOptions };

  const crawled = new Set();

  try {
    await crawl(browser, url, pageOptions.resolve);
  } catch (error) {
    await browser.close();
    throw error;
  }
  await browser.close();
  return [...crawled];

  async function crawl(browser, url, resolve) {
    if (crawled.has(url)) {
      return;
    }

    const newPage = await browser.newPage();

    Object.keys(pageOptions.events).forEach(e => {
      newPage.on(e, pageOptions.events[e]);
    });

    await newPage.goto(url, pageOptions.goto);

    let hrefs = await newPage.evaluate(getHrefs);

    crawled.add(url);

    await resolve(newPage);

    await newPage.close();

    for (let href of hrefs) {
      await crawl(browser, href, resolve); // eslint-disable-line no-await-in-loop
    }
  }
};
