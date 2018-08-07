'use strict';

const getHrefs = require('./getHrefs.js');

const _pageOptions = {
  goto: { waitUntil: 'networkidle2' },
  prepare: () => {},
  resolved: () => {}
};

module.exports = async (browser, url, pageOptions = {}) => {
  pageOptions = { ..._pageOptions, ...pageOptions };

  const crawled = new Set();

  try {
    await crawl(browser, url, pageOptions.prepare, pageOptions.resolved);
  } catch (error) {
    await niceTry(async () => await browser.close()); // eslint-disable-line no-return-await
    throw error;
  }
  await browser.close();
  return [...crawled];

  async function crawl(browser, url, prepare, resolved) {
    if (crawled.has(url)) {
      return;
    }
    crawled.add(url);

    const newPage = await browser.newPage();

    await prepare(newPage);

    let response;
    try {
      response = await newPage.goto(url, pageOptions.goto);
    } catch (error) {
      await niceTry(async () => await newPage.close()); // eslint-disable-line no-return-await
      // carry on to next page
      return;
    }

    try {
      await resolved(response, newPage);
    } catch (error) {
      await niceTry(async () => await newPage.close()); // eslint-disable-line no-return-await
      // something truly bad went down
      throw error;
    }

    const hrefs = await newPage.evaluate(getHrefs);
    await niceTry(async () => await newPage.close()); // eslint-disable-line no-return-await

    for (let href of hrefs) {
      await crawl(browser, href, prepare, resolved); // eslint-disable-line no-await-in-loop
    }
  }
};

function niceTry(fn) {
  try {
    return fn();
  } catch (e) {}
}
