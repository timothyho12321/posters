const cartDataLayer = require("../dal/cart_items");

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }


async addToCart(titleId, quantity){

let cartItem = await getCartItemByUserAndTitle(this.user_id, titleId);

if (cartItem) {
    return await cartDataLayer.updateQuantity(this.user_id, productId, cartItem.get('quantity')+ 1);
} else {
    let newCartItem = cartDataLayer.createCartItem(this.user_id, titleId, quantity);
    return newCartItem;
    //STOP HERE TO CONTINUE 
}


}



}
