import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  getIntegerInput() {
    return element(by.id('only-integer-value'));
  }

  getIntegerShowText() {
    return element(by.css('.display-integer-value'));
  }

  getDecimalInput() {
    return element(by.id('only-decimal-value'));
  }

  getDecimalShowText() {
    return element(by.css('.display-decimal-value'));
  }
}
