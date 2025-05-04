const { Builder } = require("selenium-webdriver");
const HomePage = require("../pageobjects/homePage");
const SearchBar = require("../pageobjects/searchBar");
const firefox = require("selenium-webdriver/firefox");

const TIMEOUT = 10000;

let driver;
let homePage;
let searchBar;
let resultsPage;

describe("Search products by keywords", () => {
  beforeAll(async () => {
    driver = await new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(new firefox.Options().addArguments("--headless"))
      .build();

    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: TIMEOUT });

    homePage = new HomePage(driver);
    await homePage.openUrl();
    await homePage.acceptCookies();

    searchBar = new SearchBar(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Test logo element is visible", async () => {
    await homePage.verifyLogo();
  });

  test("Test if multiple results are shown when searching for 'Harry Potter'", async () => {
    resultsPage = await searchBar.search("Harry Potter");
    await resultsPage.verifyMinResultsCount(2);
  });

  test("Test if all results contain the keyword 'Harry Potter'", async () => {
    await resultsPage.checkResultsForKeyword("Harry Potter");
  });

  // Results can't be sorted? Didn't find a sorting options, only filters.
  // test("Test if results can be sorted", async () => {});

  // test("Test if results are sorted from lowest to highest price", async () => {});

  // Fails around 1/3 of the time due to some *page refreshing?* problem I could not figure out
  test("Test if all results are in english", async () => {
    await searchBar.setLanguageToEnglish();
    resultsPage = await searchBar.search("");
    await resultsPage.verifyResultsAreInEnglish();
  });

  test("Test if filtering to hardback reduces amount of results", async () => {
    const initialResultsCount = await resultsPage.getResultsCount();
    await resultsPage.addFilter("Hardback");
    const newResultsCount = await resultsPage.getResultsCount();

    expect(Number(initialResultsCount)).toBeGreaterThan(
      Number(newResultsCount),
    );
  });

  test("Test if filtered results match filter of Hardback", async () => {
    await resultsPage.verifyResultsFormatType("Hardback");
  });
});
