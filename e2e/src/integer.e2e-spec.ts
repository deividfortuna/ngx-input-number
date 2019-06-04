import { AppPage } from './app.po';
import { browser } from 'protractor';
import { async } from '@angular/core/testing';

describe('Only Integer', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should allow number entries in the integer input', async () => {
    page.navigateTo();

    page.getIntegerInput().sendKeys(1234567890);
    expect(await page.getIntegerShowText().getText()).toEqual('1234567890');
  });

  it('should block letter entries and just allow numbers', async () => {
    page.navigateTo();

    await page
      .getIntegerInput()
      .sendKeys('abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890._-;\':\"{}|[]\\');
    expect(await page.getIntegerShowText().getText()).toEqual('1234567890');
  });

  describe('Copy/Paste', () => {
    it('should clear the data pasted in the input', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('paste', {});` +
        `event.clipboardData = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      await browser.executeScript(script, page.getIntegerInput().getWebElement());

      expect(await page.getIntegerShowText().getText()).toEqual('1234567890');
    });

    it('should keep input empty and not dirty pasting invalid data', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('paste', {});` +
        `event.clipboardData = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      await browser.executeScript(script, page.getIntegerInput().getWebElement());

      expect(await page.getIntegerShowText().getText()).toEqual('');
      // expect(await page.get)
    });
  });

  describe('Drop Data', () => {
    it('should clear the data droped in the input and keep the integer number', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('drop', {});` +
        `event.dataTransfer = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      browser.executeScript(script, page.getIntegerInput().getWebElement());

      expect(await page.getIntegerShowText().getText()).toEqual('1234567890');
    });

    it('should keep input empty and not dirty droping invalid data', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('drop', {});` +
        `event.dataTransfer = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      await browser.executeScript(script, page.getIntegerInput().getWebElement());

      expect(await page.getIntegerShowText().getText()).toEqual('');
    });
  });
});
