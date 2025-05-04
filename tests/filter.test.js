const { Builder } = require("selenium-webdriver");
const HomePage = require("../pageobjects/homePage");
const firefox = require("selenium-webdriver/firefox");
const SearchResultsPage = require("../pageobjects/searchResultsPage");

const TIMEOUT = 10000;

let driver;
let homePage;
let resultsPage;

let resultsCount;

describe("Search products by filters", () => {
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

    resultsPage = new SearchResultsPage(driver);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Test logo element is visible", async () => {
    await homePage.verifyLogo();
  });

  test("Test to see if there is a section 'Ingliskeelsed raamatud'", async () => {
    await homePage.verifySectionVisibility("Ingliskeelsed raamatud");
  });

  test("Test if navigating to 'Educational Materials' works", async () => {
    await homePage.navigateToCategory("Children's, young adult & educational");
    await resultsPage.navigateToSubCategory("Educational material");
    const categoryName = await resultsPage.getCurrentCategoryName();
    expect(categoryName.toLowerCase()).toBe("educational material");
  });

  test("Test if category 'Educational Materials' shows more than 1 result", async () => {
    resultsCount = await resultsPage.getResultsCount();
    expect(Number(resultsCount)).toBeGreaterThan(1);
  });

  test("Test if subcategory 'Educational: Music' shows less results than parent category", async () => {
    await resultsPage.navigateToSubCategory("Educational: Music");
    const oldResultsCount = resultsCount;
    resultsCount = await resultsPage.getResultsCount();
    expect(Number(resultsCount)).toBeLessThan(Number(oldResultsCount));
  });

  test("Test if adding a filter option of 'CD-Audio' reduces amount of results", async () => {
    await resultsPage.addFilter("CD-Audio");
    const oldResultsCount = resultsCount;
    resultsCount = await resultsPage.getResultsCount();
    expect(Number(resultsCount)).toBeLessThan(Number(oldResultsCount));
  });

  // this fails as this functionality seems to be broken on the website
  test("Test if results are all of type 'CD-Audio'", async () => {
    await resultsPage.verifyResultsFormatType("CD-Audio");
  });
});
