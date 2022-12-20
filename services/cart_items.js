const cartDataLayer = require("../dal/cart_items");

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }


    async addToCart(titleId, quantity) {

        let cartItem = await cartDataLayer.getCartItemByUserAndTitle(this.user_id, titleId);

        if (cartItem) {
            return await cartDataLayer.updateQuantity(this.user_id, titleId, cartItem.get('quantity') + 1);
        } else {
            let newCartItem = cartDataLayer.createCartItem(this.user_id, titleId, quantity);
            return newCartItem;

        }


    }

    async remove(titleId) {
        return await cartDataLayer.removeFromCart(this.user_id, titleId);


    }


    async setQuantity(titleId, quantity) {
        return await cartDataLayer.updateQuantity(this.user_id, titleId, quantity);


    }

    async getCart() {
        return await cartDataLayer.getCart(this.user_id);


    }


}

module.exports = {CartServices};
