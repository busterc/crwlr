'use strict';

const path = require('path');
const crwlr = require('../index.js');
const puppeteer = require('puppeteer');

describe('crwlr', () => {
  const testSite = 'file://' + path.resolve(__dirname, 'site', 'index.html');

  it(
    'default with no pageOptions',
    async () => {
      let browser = await puppeteer.launch();
      expect.assertions(1);

      let crawledPages = await crwlr(browser, testSite);
      expect(crawledPages.length).toBe(2);
    },
    20000
  );

  it(
    'with pageOptions.resolve',
    async () => {
      let browser = await puppeteer.launch();
      expect.assertions(3);

      let resolves = 0;
      const pageOptions = {
        resolve: async page => {
          let title = await page.evaluate('document.title');
          expect(title.match(/crwlr/)).toBeTruthy();
          resolves += 1;
        }
      };
      let crawledPages = await crwlr(browser, testSite, pageOptions);
      expect(crawledPages.length + resolves).toBe(4);
    },
    20000
  );

  it(
    'with pageOptions.goto',
    async () => {
      let browser = await puppeteer.launch();
      expect.assertions(1);

      const pageOptions = {
        goto: {
          waitUntil: 'domcontentloaded'
        }
      };
      let crawledPages = await crwlr(browser, testSite, pageOptions);
      expect(crawledPages.length).toBe(2);
    },
    20000
  );

  it(
    'with pageOptions.events',
    async () => {
      let browser = await puppeteer.launch();
      expect.assertions(1);

      let eventCount = 0;
      const pageOptions = {
        events: {
          request: request => {
            if (request.url().match(/hello\.js$/)) {
              eventCount += 1;
            }
          },
          console: () => {
            eventCount += 1;
          }
        }
      };
      await crwlr(browser, testSite, pageOptions);
      expect(eventCount).toBe(2);
    },
    20000
  );

  it('catch errors', async () => {
    let browser = await puppeteer.launch();
    expect.assertions(1);
    const missingPage = 'file://' + path.resolve(__dirname, 'missing.html');
    try {
      await crwlr(browser, missingPage);
    } catch (error) {
      expect(error.message).toMatch('ERR_FILE_NOT_FOUND');
    }
    browser.close();
  });
});
