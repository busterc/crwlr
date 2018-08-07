'use strict';

const path = require('path');
const crwlr = require('../index.js');
const puppeteer = require('puppeteer');

describe('crwlr', () => {
  const testSite = 'file://' + path.resolve(__dirname, 'site', 'index.html');

  it(
    'default with no pageOptions',
    async () => {
      let browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      expect.assertions(1);

      let crawledPages = await crwlr(browser, testSite);
      expect(crawledPages.length).toBe(2);
    },
    20000
  );

  it(
    'pageOptions.goto',
    async () => {
      let browser = await puppeteer.launch({ args: ['--no-sandbox'] });
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
    'pageOptions.prepare',
    async () => {
      expect.assertions(1);
      let browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const missingPage = 'file://' + path.resolve(__dirname, 'site', 'missing.html');

      let pageOptions = {
        prepare: newPage => {
          newPage.on('requestfailed', request => {
            expect(request.url()).toEqual(missingPage);
          });
        }
      };
      await crwlr(browser, missingPage, pageOptions);
    },
    20000
  );

  it(
    'pageOptions.resolved',
    async () => {
      expect.assertions(3);
      let browser = await puppeteer.launch({ args: ['--no-sandbox'] });

      let resolves = 0;
      let pageOptions = {
        resolved: async (response, page) => {
          let title = await page.evaluate('document.title');
          expect(title.match(/crwlr/)).toBeTruthy();
          resolves += 1;
        }
      };
      await crwlr(browser, testSite, pageOptions);
      expect(resolves).toBe(2);
    },
    20000
  );

  it(
    'catch pageOptions.resolved errors',
    async () => {
      expect.assertions(1);
      let browser = await puppeteer.launch({ args: ['--no-sandbox'] });

      let pageOptions = {
        resolved: async () => {
          throw Error('nope');
        }
      };
      try {
        await crwlr(browser, testSite, pageOptions);
      } catch (error) {
        expect(error.message).toMatch('nope');
      }
    },
    20000
  );

  it('catch unhandled errors', async () => {
    expect.assertions(1);
    try {
      await crwlr();
    } catch (error) {
      expect(error.message).toMatch('undefined');
    }
  });
});
