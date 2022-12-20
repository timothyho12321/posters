const express = require('express');
const { checkIfAuthenticated } = require('../middlewares');
const { CartServices } = require('../services/cart_items');
const router = express.Router();

router.get('/', checkIfAuthenticated, async (req, res) => {
    let cart = new CartServices(req.session.user.id)

    res.render('carts/index', {
        'shoppingCart': (await cart.getCart()).toJSON()

    })

})

router.get('/:title_id/add', async (req, res) => {

    let cart = new CartServices(req.session.user.id)

    await cart.addToCart(req.params.title_id, 1);
    req.flash('success_messages', 'You have successfully added to cart!');



    res.redirect('/titles')

})


router.get('/:title_id/remove', checkIfAuthenticated, async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    await cart.remove(req.params.title_id);

    req.flash("success_messages", "Item is taken out of shopping cart");
    res.redirect('/cart/')


})


router.post('/:title_id/quantity/update', checkIfAuthenticated, async (req, res) => {

    let cart = new CartServices(req.session.user.id)
    await cart.setQuantity(req.params.title_id, req.body.newQuantity);

    req.flash("success_messages", "Your quantity for poster is changed")

    res.redirect('/cart/')
})


module.exports = router;