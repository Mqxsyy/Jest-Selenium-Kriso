const { By, Key } = require("selenium-webdriver");
const BasePage = require("./basePage");
const SearchResultsPage = require("./searchResultsPage");

const searchBar = By.id("top-search-text");
const languageDropdown = By.css('[id="top-csel"]');
const englishLanguageBtn = By.css('[id="top-csel"] > [value="english2"]');

module.exports = class SearchBar extends BasePage {
  async search(keyword) {
    await super.findAndWrite(searchBar, keyword, Key.ENTER);
    return new SearchResultsPage(this.driver);
  }

  async setLanguageToEnglish() {
    await super.findAndClick(languageDropdown);
    await super.findAndClick(englishLanguageBtn);
  }
};
