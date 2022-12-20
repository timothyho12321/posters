const express = require('express');
const { checkIfAuthenticated } = require('../middlewares');
const { CartServices } = require('../services/cart_items');
const router = express.Router();

const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


router.get('/', checkIfAuthenticated, async (req, res) => {

    console.log("checkout begin to run");
    const cart = new CartServices(req.session.user.id);

    let items = await cart.getCart();

    let lineItems = [];
    let meta = [];

    for (let i of items) {
        const lineItem = {
            'quantity': i.get('quantity'),
            'price_data': {
                'currency': 'SGD',
                'unit_amount': i.related('title').get('cost'),
                'product_data': {
                    'name': i.related('title').get('title')

                }


            }


        }


        if (i.related('title').get('image_url')) {

            lineItem.price_data.product_data.images = [
                i.related('title').get('image_url')

            ]
        }
        lineItems.push(lineItem);

        meta.push({
            'product_id': i.get('title_id'),
            'quantity': i.get('quantity')

        })

    }

    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ["card"],
        mode: 'payment',
        line_items: lineItems,
        success_url: "http://www.google.com",
        cancel_url: "http://www.youtube.com",
        metadata: {
            'orders': metaData
        }


    }


    console.log("before render the checkout page ran")
    const stripeSession = await Stripe.checkout.sessions.create(payment);
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY


    })


})

module.exports = router;