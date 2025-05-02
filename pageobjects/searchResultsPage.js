const { By } = require("selenium-webdriver");
const BasePage = require("./basePage");

const result = By.css(".book-list > .list-item");
const title = By.css(".book-title");
const description = By.css(".book-desc-short > span");
const resultCount = By.className("sb-results-total");
const hardbackFilterBtn = By.xpath('//a[contains(string(), "Hardback")]');
const bookFeatures = By.className("book-features");

const englishRegex =
  /^[\p{L}\p{N}\s.,!?'"():;\-–—&/\\[\]{}@#%*+=<>_|~`’™…®]*$/u;

module.exports = class SearchResultsPage extends BasePage {
  async verifyMinResultsCount(count) {
    const elements = await super.findElements(result);
    expect(elements.length).toBeGreaterThan(count);
  }

  async checkResultsForKeyword(keyword) {
    const elements = await super.findElements(result);
    for (const el of elements) {
      const titleText = await super.getChildText(el, title);
      const descText = await super.getChildText(el, description);

      const includesKeyword =
        titleText.includes(keyword) || descText.includes(keyword);

      expect(includesKeyword).toBe(true);
    }
  }

  async verifyResultsAreInEnglish() {
    const elements = await super.findElements(result);
    for (const el of elements) {
      const titleText = await super.getChildText(el, title);
      const descText = await super.getChildText(el, description);

      // would've used franc but that seemed to require project reconfiguring
      const isTitleInEnglish = englishRegex.test(titleText);
      const isDescInEnglish = englishRegex.test(descText);

      expect(isTitleInEnglish && isDescInEnglish).toBe(true);
    }
  }

  async getResultsCount() {
    return await super.getElementText(resultCount);
  }

  async filterToHardback() {
    await super.findAndClick(hardbackFilterBtn);
  }

  async verifyResultsFormatToBeHardback() {
    const elements = await super.findElements(result);
    for (const el of elements) {
      const features = await super.getChildText(el, bookFeatures);
      expect(features).toContain("Hardback");
    }
  }
};
