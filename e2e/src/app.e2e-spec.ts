import {AppPage} from './app.po';
import {browser} from 'protractor';

describe('Input Number Example App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Input Only Number');
  });
});
