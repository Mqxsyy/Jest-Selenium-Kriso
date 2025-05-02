// has everything related to cart page
const Page = require('./basePage')
const { By } = require('selenium-webdriver')

// move all the clicks and element locators here
const cartQuantity = By.css('.order-qty > .o-value')
const cartRowItems = By.css('.tbl-row > .subtotal')
const cartSum = By.css('.order-total > .o-value')
const cartItemRow = By.css('.tbl-row')
const cartRemoveBtn = By.css('.remove')

module.exports = class Cartpage extends Page  {

    async verifyCartQuantity(number) {
        await super.waitUntilElementText(cartQuantity, number.toString())
    }

    async verifyCartSumIsCorrect() {
        const cartItems = await super.findElements(cartRowItems)

        let cartItemsSum = 0
        for(let item of cartItems) {
            cartItemsSum += parseFloat((await item.getText()).replace(/€/g, ""));
        }  

        let basketSum = await super.getElementText(cartSum)
        const basketSumNum = parseFloat(basketSum.replace(/€/g,""))
        
        expect(basketSumNum).toBe(cartItemsSum);
        return cartItemsSum
    }

    async removeItemFromCart(number) {
        const cartItems = await super.findElements(cartItemRow)
        const cartElement = await super.findChildElement(cartItems[number-1], cartRemoveBtn)
        await super.click(cartElement)
    }

}
