import { M152Page } from './app.po';

describe('m152 App', function() {
  let page: M152Page;

  beforeEach(() => {
    page = new M152Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
