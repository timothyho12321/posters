const express = require('express');
const { checkIfAuthenticated } = require('../middlewares');
const { CartServices } = require('../services/cart_items');
const router = express.Router();

const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


router.get('/', checkIfAuthenticated, async (req, res) => {

    // console.log("checkout begin to run");
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
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCELLED_URL,
        metadata: {
            'orders': metaData
        }


    }


    // console.log("before render the checkout page ran")
    const stripeSession = await Stripe.checkout.sessions.create(payment);


    // console.log(stripeSession);

    // res.send("Can resend page by res.send")
    
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEYS


    })


})


router.post('/process_payment', express.raw({ type: 'application/json' }),
    async (req, res) => {

        let payload = req.body;
        let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
        let signature = req.headers["stripe-signature"];


        let event = null;

        try {
            event = Stripe.webhooks.constructEvent(payload, signature, endpointSecret);



        } catch (e) {

            res.status(500)
            res.send({
                'error': e.message

            })

        }


        if (event.type == "checkout.session.completed") {
            // console.log(event.data.object)
            // console.log("the webhook route ran")
            //SECOND PART OF PROJECT 3 IMPLEMENTATION 
            //TO CONTINUE FROM HERE TO CREATE NEW ORDER, SET DELIVERY STATUS, SEND RECEIPT PDF



        }

        res.sendStatus(200);




    })


router.get('/success', function (req, res) {
    res.render('checkout/success')


})


router.get('/cancelled', function (req, res) {
    res.render('checkout/cancelled')


})


module.exports = router;