import { AppPage } from './app.po';
import { browser, protractor } from 'protractor';
import { async } from '@angular/core/testing';

describe('Decimal', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should allow number entries in the decimal input and keep the integer number', async () => {
    page.navigateTo();

    page.getDecimalInput().sendKeys(1234567890.4313);
    expect(await page.getDecimalShowText().getText()).toEqual('1234567890.431');
  });

  it('should block letter entries and just allow decimal numbers with 3 decimal places', async () => {
    page.navigateTo();

    page
      .getDecimalInput()
      .sendKeys('abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.21343!.@#$%^&*()_-;\':\"{}|[]\\');
    expect(await page.getDecimalShowText().getText()).toEqual('1234567890.213');
  });

  describe('Copy/Paste', () => {
    it('should clear the data pasted in the input and keep the number with 3 decimal place', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.3214.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('paste', {});` +
        `event.clipboardData = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      browser.executeScript(script, page.getDecimalInput().getWebElement());

      expect(await page.getDecimalShowText().getText()).toEqual('1234567890.321');
      expect(await page.getLastDecimalShowText().getText()).toEqual('1234567890.321');
    });

    it('should clear the data pasted in the input without any decimal when the value already have decimal point', async () => {
      page.navigateTo();

      await page.getDecimalInput().sendKeys('432.2');
      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.3214.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('paste', {});` +
        `event.clipboardData = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      browser.executeScript(script, page.getDecimalInput().getWebElement());

      expect(await page.getDecimalShowText().getText()).toEqual('432.212');
      expect(await page.getLastDecimalShowText().getText()).toEqual('432.212');
    });

    it('should keep input empty and not dirty pasting invalid data', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('paste', {});` +
        `event.clipboardData = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      await browser.executeScript(script, page.getDecimalInput().getWebElement());

      expect(await page.getDecimalShowText().getText()).toEqual('');
      // expect(await page.get)
    });

    it('should allow overwrite selection after decimal point with pasted data', async () => {
      page.navigateTo();

      const decimalNumber = '123456.789';
      const script = `arguments[0].setSelectionRange(7, 8)`;
      page.getDecimalInput().sendKeys(decimalNumber);

      await browser.executeScript(script, page.getDecimalInput().getWebElement());

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQ0RSTUXZWY.!@#$%^&*()_-;:{}|[]';
      const pasteScript = `var event = new Event('paste', {});` +
        `event.clipboardData = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      await browser.executeScript(pasteScript, page.getDecimalInput().getWebElement());

      expect(await page.getDecimalShowText().getText()).toEqual('123456.089');
    });
  });

  describe('Drop Data', () => {
    it('should clear the data dropped in the input and keep the number with 3 decimal places', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.3214.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('drop', {});` +
        `event.dataTransfer = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      browser.executeScript(script, page.getDecimalInput().getWebElement());

      expect(await page.getDecimalShowText().getText()).toEqual('1234567890.321');
    });

    it('should keep input empty and not dirty droping invalid data', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('drop', {});` +
        `event.dataTransfer = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      await browser.executeScript(script, page.getDecimalInput().getWebElement());

      expect(await page.getDecimalShowText().getText()).toEqual('');
    });
  });

  it('should allow number entries before the decimal indicator', async () => {
    page.navigateTo();

    const decimalNumber = '123456.987';
    const script = `arguments[0].setSelectionRange(2, 2)`;
    page.getDecimalInput().sendKeys(decimalNumber);

    await browser.executeScript(script, page.getDecimalInput()
      .getWebElement());
    await page.getDecimalInput().sendKeys('666');

    expect(await page.getDecimalShowText().getText()).toEqual('126663456.987');
  });

  it('should block numbers entry after the decimal indicator when already have the maximum allowed', async () => {
    page.navigateTo();

    const decimalNumber = '123456.';
    const script = `arguments[0].setSelectionRange(7, 77)`;
    page.getDecimalInput().sendKeys(decimalNumber);

    await browser.executeScript(script, page.getDecimalInput()
      .getWebElement());
    await page.getDecimalInput().sendKeys('6667');

    expect(await page.getDecimalShowText().getText()).toEqual('123456.666');
  });

  it('should block numpad entry after the decimal indicator when already have the maximum allowed ', async () => {
    page.navigateTo();

    const decimalNumber = '123456.';
    const script = `arguments[0].setSelectionRange(7, 77)`;
    page.getDecimalInput().sendKeys(decimalNumber);

    await browser.executeScript(script, page.getDecimalInput()
      .getWebElement());
    await page.getDecimalInput().sendKeys('666');

    await page.getDecimalInput().sendKeys(protractor.Key.NUMPAD0);
    await page.getDecimalInput().sendKeys(protractor.Key.NUMPAD1);
    await page.getDecimalInput().sendKeys(protractor.Key.NUMPAD2);
    await page.getDecimalInput().sendKeys(protractor.Key.NUMPAD3);
    await page.getDecimalInput().sendKeys(protractor.Key.NUMPAD4);
    await page.getDecimalInput().sendKeys(protractor.Key.NUMPAD5);
    await page.getDecimalInput().sendKeys(protractor.Key.NUMPAD6);
    await page.getDecimalInput().sendKeys(protractor.Key.NUMPAD7);
    await page.getDecimalInput().sendKeys(protractor.Key.NUMPAD8);
    await page.getDecimalInput().sendKeys(protractor.Key.NUMPAD9);

    expect(await page.getDecimalShowText().getText()).toEqual('123456.666');
  });

  it('should allow overwrite selection after decimal point', async () => {
    page.navigateTo();

    const decimalNumber = '123456.789';
    const script = `arguments[0].setSelectionRange(7, 8)`;
    page.getDecimalInput().sendKeys(decimalNumber);

    await browser.executeScript(script, page.getDecimalInput().getWebElement());
    await page.getDecimalInput().sendKeys('0212');

    expect(await page.getDecimalShowText().getText()).toEqual('123456.089');
  });

  it('should not allow entry another decimal place before a decimal place', async () => {
    page.navigateTo();

    const decimalNumber = '123456.987';
    const script = `arguments[0].setSelectionRange(2, 2)`;
    page.getDecimalInput().sendKeys(decimalNumber);

    await browser.executeScript(script, page.getDecimalInput()
      .getWebElement());
    await page.getDecimalInput().sendKeys('.');

    expect(await page.getDecimalShowText().getText()).toEqual('123456.987');
  });

  it('should not allow entry a decimal indicator when will have more than expected decimal places', async () => {
    page.navigateTo();

    const decimalNumber = '123456789';
    const script = `arguments[0].setSelectionRange(2, 2)`;
    page.getDecimalInput().sendKeys(decimalNumber);

    await browser.executeScript(script, page.getDecimalInput()
      .getWebElement());
    await page.getDecimalInput().sendKeys('.');

    expect(await page.getDecimalShowText().getText()).toEqual('123456789');
  });

  it('should allow entry a decimal indicator when will have less or the same amount of decimal places allowed', async () => {
    page.navigateTo();

    const decimalNumber = '123456789';
    const script = `arguments[0].setSelectionRange(6, 6)`;
    page.getDecimalInput().sendKeys(decimalNumber);

    await browser.executeScript(script, page.getDecimalInput()
      .getWebElement());
    await page.getDecimalInput().sendKeys('.');

    expect(await page.getDecimalShowText().getText()).toEqual('123456.789');
  });

  // TODO: new test cases / new features
  // Round monetary values?
  // Dont allow when allow-round is false?
});
