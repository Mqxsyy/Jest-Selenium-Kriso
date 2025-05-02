const { until } = require("selenium-webdriver");

const TIMEOUT = 5000;

module.exports = class Page {
  constructor(driver) {
    this.driver = driver;
  }

  getDriver() {
    return this.driver;
  }

  async openUrl(url) {
    return await this.driver.get(url);
  }

  async findElement(locator) {
    return await this.driver.findElement(locator);
  }

  async findElements(locator) {
    return await this.driver.findElements(locator);
  }

  async findChildElement(parent, locator) {
    return await parent.findElement(locator);
  }

  async click(element) {
    return await element.click();
  }

  async findAndClick(locator) {
    const el = await this.findElement(locator);
    return await el.click();
  }

  async write(element, keys) {
    return await element.sendKeys(keys);
  }

  async findAndWrite(locator, ...keys) {
    const el = await this.findElement(locator);
    return await el.sendKeys(...keys);
  }

  async getElementText(locator) {
    const el = await this.findElement(locator);
    return await el.getText();
  }

  async getChildText(parent, locator) {
    const el = await parent.findElement(locator);
    return await el.getText();
  }

  async waitUntilElementText(locator, text) {
    let element = await this.findElement(locator);
    return this.driver.wait(until.elementTextIs(element, text), TIMEOUT);
  }
};
