const express = require("express");
const { createTitleForm, bootstrapField } = require('../forms');
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

    const form = createTitleForm();
    res.render('titles/create', {
        'form': form.toHTML(bootstrapField)
    })


})



router.post('/add', function (req, res) {

    const titleForm = createTitleForm();
    titleForm.handle(req, {
        'success': async function (form) {
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
        'empty': async function (form) {
            // executed if the user just submit without any input
            res.render('titles/create', {
                'form': form.toHTML(bootstrapField)
            })
        },
        'error': async function (form) {
            // executed if the form has any validation errors

            res.render('titles/create', {
                'form': form.toHTML(bootstrapField)
            })
        }

    })


})

router.get("/update/:poster_id", async function (req, res) {

    const posterId = req.params.poster_id;

    const title = await Title.where({
        'id': posterId
    }).fetch({
        require: true
    })

    const titleForm = createTitleForm()
    
    titleForm.fields.title.value = title.get('title');
    titleForm.fields.cost.value = title.get('cost');
    titleForm.fields.description.value = title.get('description');
    titleForm.fields.date.value = title.get('date').toISOString();
    titleForm.fields.stock.value = title.get('stock');
    titleForm.fields.height.value = title.get('height');
    titleForm.fields.width.value = title.get('width');

    res.render('titles/update', {
        'form': titleForm.toHTML(bootstrapField)

    })

})


router.post('/update/:poster_id', async function(req,res){
    const posterId = req.params.poster_id;

    const title = await Title.where({
        'id': posterId
    }).fetch({
        require: true
    })

    const titleForm = createTitleForm()

    // pass the request as the first parameter
    // second parameter: object that has three handlers
    titleForm.handle(req, {
        'success': async function(form) {
            // form has no validation error
            // then we proceed to update the product
            // Instead of:
            // product.set('name', form.data.name);
            // product.set('cost', form.data.cost);
            // product.set('description', form.data.description);
            // if the parameter to product.set is an object
            // Bookshelf ORM will try to assign each key as a column

            // extract out the tags, but all the other keys in form.data
            // will go into productData
           
            
            title.set('title', form.data.title);
            title.set('cost', form.data.cost);
            title.set('description', form.data.description);
            title.set('date', form.data.date);
            title.set('stock', form.data.stock);
            title.set('height', form.data.height);
            title.set('width', form.data.width);

            title.save(); // make the change permanent

            res.redirect('/titles');
          
        },
        // HOW COME CANNOT SHOW ERROR MESSAGE 
        'empty': async function(form) {
            // form has no data
           
            res.render('titles/update',{
                'form': form.toHTML(bootstrapField),
                // 'title':title.toJSON()
            })
        },
        'error': async function(form) {
            // one or more fields have validation errors
            
            res.render('titles/update', {
                'form': form.toHTML(bootstrapField),
                'title':title.toJSON()
            })
        }
    })

})








module.exports = router;

