const { CartItem } = require("../models")


const getCart = async (userId) => {
    return await CartItem.collection().where({
        'user_id': userId
    }).fetch({
        require: false,
        withRelated: ['title', 'title.media_property_id']
    })

}


const getCartItemByUserAndTitle = async (userId, titleId) => {
    return await CartItem.where({
        'user_id': userId,
        'title_id': titleId
    }).fetch({
        require: false
    })


}


async function createCartItem(userId, titleId, quantity) {

    let cartItem = new CartItem({
        'user_id': userId,
        'title_id': titleId,
        'quantity': quantity

    })

    await cartItem.save();
    return cartItem;

}


async function removeFromCart(userId, titleId) {
    let cartItem = await getCartItemByUserAndTitle(userId, titleId);
    if (cartItem) {
        await cartItem.destroy();
        return true;

    }
    return false;

}



async function updateQuantity(userId, titleId, newQuantity) {

    const cartItem = await getProductProductAndUser(userId, titleId);
    
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        await cartItem.save();
        return cartItem;

    } else {
        return false;
    }

}


module.exports = { getCart, getCartItemByUserAndTitle, createCartItem, removeFromCart, updateQuantity }


