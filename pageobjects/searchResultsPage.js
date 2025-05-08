const { By, until } = require("selenium-webdriver");
const BasePage = require("./basePage");

const result = By.css(".book-list > .list-item");
const title = By.css(".book-title");
const description = By.css(".book-desc-short > span");
const bookFeatures = By.className("book-features");
const categoryName = By.css(".catbrowser > h2 > span");

const filterBtn = (filterType) => By.xpath(`//a[contains(string(), "${filterType}")]`)
const subcategory = (subcategoryName) => By.xpath(`//i[contains(string(), "${subcategoryName}")]`)

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
    await this.driver.wait(until.elementLocated(result), 5000);

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
    const headerText = await super.findElement(
      By.xpath(`//i[normalize-space()='Otsingu tulemused']`),
    );

    const header = await headerText.findElement(By.xpath("./ancestor::h2[1]"));
    const resultsContainer = await header.findElement(
      By.xpath("following-sibling::div[1]"),
    );

    const resultsCount = await resultsContainer.findElement(
      By.className("sb-results-total"),
    );

    return await resultsCount.getText();
  }

  async addFilter(filterType) {
    await super.findAndClick(filterBtn(filterType));
  }

  async verifyResultsFormatType(formatType) {
    const elements = await super.findElements(result);
    for (const el of elements) {
      const features = await super.getChildText(el, bookFeatures);
      expect(features.toLowerCase()).toContain(formatType.toLowerCase());
    }
  }

  async navigateToSubCategory(subcategoryName) {
    await super.findAndClick(subcategory(subcategoryName));
  }

  async getCurrentCategoryName() {
    return await super.getElementText(categoryName);
  }
};
