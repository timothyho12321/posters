const express = require("express");
const { createProductForm, bootstrapField } = require('../forms');
const router = express.Router();

// #1 import in the Product model
const { Title } = require('../models')

router.get('/', async (req, res) => {
    // #2 - fetch all the products (ie, SELECT * from products)
    let titles = await Title.collection().fetch();
    res.render('titles/index', {
        'titles': titles.toJSON() // #3 - convert collection to JSON
    })
})

router.get('/add', async (req, res) => {

    const form = createProductForm();
    res.render('titles/create', {
        'form': form.toHTML(bootstrapField)
    })


})



router.post('/add', function (req, res) {

    const titleForm = createProductForm();
    titleForm.handle(req, {
        'success': async function(form) {
            const titleObject = new Title();
            titleObject.set('title', form.data.title);
            titleObject.set('cost', form.data.cost);
            titleObject.set('description', form.data.description);
            titleObject.set('date', form.data.date);
            titleObject.set('stock', form.data.stock);
            titleObject.set('height', form.data.height);
            titleObject.set('width', form.data.width);
            await titleObject.save();
            res.redirect('/titles')
        },
        'empty': async function(form) {
            // executed if the user just submit without any input
            res.render('titles/create',{
                'form': form.toHTML(bootstrapField)
            })
        },
        'error': async function(form) {
            // executed if the form has any validation errors

            res.render('titles/create',{
                'form': form.toHTML(bootstrapField)
            })
        }

    })


})

module.exports = router;

