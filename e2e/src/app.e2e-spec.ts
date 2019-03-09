import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('Input Number Example App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Input Only Number');
  });

  describe('Only Integer', () => {
    it('should allow number entries in the integer input', async () => {
      page.navigateTo();

      page.getIntegerInput().sendKeys(1234567890);
      expect(await page.getIntegerShowText().getText()).toEqual('1234567890');
    });

    it('should block letter entries and just allow numbers', async () => {
      page.navigateTo();

      page
        .getIntegerInput()
        .sendKeys('abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.!@#$%^&*()_-;\':\"{}|[]\\');
      expect(await page.getIntegerShowText().getText()).toEqual('1234567890');
    });

    it('should clear the data pasted in the input', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('paste', {});` +
        `event.clipboardData = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      browser.executeScript(script, page.getIntegerInput().getWebElement());

      expect(await page.getIntegerShowText().getText()).toEqual('1234567890');
    });

    it('should clear the data droped in the input and keep the integer number', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('drop', {});` +
        `event.dataTransfer = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      browser.executeScript(script, page.getIntegerInput().getWebElement());

      expect(await page.getIntegerShowText().getText()).toEqual('1234567890');
    });
  });

  describe('Decimal', () => {
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

    it('should clear the data pasted in the input and keep the number with 3 decimal place', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.3214.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('paste', {});` +
        `event.clipboardData = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      browser.executeScript(script, page.getDecimalInput().getWebElement());

      expect(await page.getDecimalShowText().getText()).toEqual('1234567890.321');
    });

    it('should clear the data droped in the input and keep the number with 3 decimal place', async () => {
      page.navigateTo();

      const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.3214.!@#$%^&*()_-;:{}|[]';
      const script = `var event = new Event('drop', {});` +
        `event.dataTransfer = { getData: function () { return '${dirtyNumber}'; } };` +
        `arguments[0].dispatchEvent(event);`;

      browser.executeScript(script, page.getDecimalInput().getWebElement());

      expect(await page.getDecimalShowText().getText()).toEqual('1234567890.321');
    });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
