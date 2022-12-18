const express = require("express");
const { createTitleForm, bootstrapField, createSearchForm } = require('../forms');
const { checkIfAuthenticated } = require("../middlewares");
const router = express.Router();

// #1 import in the Product model
const { Title, MediaProperty, Tag } = require('../models')



// GET TITLES  ROUTE 
router.get('/', async (req, res) => {

    const allMediaProperties = await MediaProperty.fetchAll().map((property) => {
        return [property.get("id"), property.get("name")]
    })

    allMediaProperties.unshift([0, '----------']);

    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'),
    tag.get('name')])

    const searchForm = createSearchForm(allMediaProperties, allTags);

    const q = Title.collection();

    searchForm.handle(req, {
        'empty': async (form) => {
            let titles = await q.fetch({
                withRelated: ['media_property', 'tags']
            })

            

            res.render('titles/index', {
                'titles': titles.toJSON(),
                'form': form.toHTML(bootstrapField)
            })

        },
        'error': async (form) => {
            let titles = await q.fetch({
                withRelated: ['media_property', 'tags']
            })


            res.render('titles/index', {
                'titles': titles.toJSON(),
                'form': form.toHTML(bootstrapField)
            })

        },
        'success': async (form) => {

            if (form.data.title){
                q.where('title','like','%' + form.data.title +"%");
            }

            const titles = await q.fetch({
                withRelated:['tags', 'media_property'] // for each product, load in each of the tag
            });

            res.render('titles/index', {
                'titles': titles.toJSON(),
                'form': form.toHTML(bootstrapField)
            })

        }




    })


    // #2 - fetch all the products (ie, SELECT * from products)
    let titles = await Title.collection().fetch();
    // console.log(titles);


    // res.render('titles/index', {
    //     'titles': titles.toJSON(),
    //     'form': searchForm.toHTML(bootstrapField)
    // })
})




// ADD TITLES ROUTE 

router.get('/add', checkIfAuthenticated, async (req, res) => {

    const allMediaProperties = await MediaProperty.fetchAll().map((property) => {
        return [property.get("id"), property.get("name")]
    })

    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'),
    tag.get('name')])

    const form = createTitleForm(allMediaProperties, allTags);
    res.render('titles/create', {
        'form': form.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET

    })


})



router.post('/add', checkIfAuthenticated, async function (req, res) {


    // CONTINUE FROM HERE
    const allMediaProperties = await MediaProperty.fetchAll().map((property) => {
        return [property.get("id"), property.get("name")]
    })

    const allTags = await Tag.fetchAll().map(tag => [tag.get("id"),
    tag.get("name")])


    const titleForm = createTitleForm(allMediaProperties, allTags);
    titleForm.handle(req, {
        'success': async function (form) {


            const titleObject = new Title();
            // titleObject.set('title', form.data.title);
            // titleObject.set('cost', form.data.cost);
            // titleObject.set('description', form.data.description);
            // titleObject.set('date', form.data.date);
            // titleObject.set('stock', form.data.stock);
            // titleObject.set('height', form.data.height);
            // titleObject.set('width', form.data.width);
            // titleObject.set('media_property_id', form.data.media_property_id);

            let { tags_id, ...productData } = form.data;
            titleObject.set(productData)
            await titleObject.save();

            console.log(titleObject)
            if (tags_id) {

                await titleObject.tags().attach(tags_id.split(","));
            }

            req.flash("success_messages", `New Poster
${titleObject.get('title')} has been created`)

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
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }

    })


})

router.get("/update/:poster_id", async function (req, res) {

    const posterId = req.params.poster_id;

    const title = await Title.where({
        'id': posterId
    }).fetch({
        require: true,
        withRelated: ['tags']
    })

    const allMediaProperties = await MediaProperty.fetchAll().map((property) => {
        return [property.get("id"), property.get("name")]
    })
    const allTags = await Tag.fetchAll().map(tag => [tag.get("id"),
    tag.get("name")])

    const titleForm = createTitleForm(allMediaProperties, allTags)


    titleForm.fields.title.value = title.get('title');
    titleForm.fields.cost.value = title.get('cost');
    titleForm.fields.description.value = title.get('description');

    titleForm.fields.date.value = title.get('date').toISOString();
    titleForm.fields.stock.value = title.get('stock');
    titleForm.fields.height.value = title.get('height');
    titleForm.fields.width.value = title.get('width');


    titleForm.fields.media_property_id.value = title.get('media_property_id');

    let selectedTags = await title.related('tags').pluck('id')

    titleForm.fields.tags_id.value = selectedTags;


    titleForm.fields.image_url.value = title.get('image_url');




    res.render('titles/update', {
        'form': titleForm.toHTML(bootstrapField),
        'title': title.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET

    })

})


router.post('/update/:poster_id', async function (req, res) {
    const posterId = req.params.poster_id;

    const allMediaProperties = await MediaProperty.fetchAll().map((property) => {
        return [property.get("id"), property.get("name")]
    })

    const allTags = await Tag.fetchAll().map(tag => [tag.get("id"),
    tag.get("name")])

    const title = await Title.where({
        'id': posterId
    }).fetch({
        require: true,
        withRelated: ['tags']
    })

    const titleForm = createTitleForm(allMediaProperties, allTags)

    // pass the request as the first parameter
    // second parameter: object that has three handlers
    titleForm.handle(req, {
        'success': async function (form) {
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
            title.set('media_property_id', form.data.media_property_id)
            title.set('image_url', form.data.image_url);
            title.save(); // make the change permanent

            let existingTagIDs = await title.related('tags').pluck('id')

            await title.tags().detach(existingTagIDs);
            await title.tags().attach(form.data.tags_id.split(','));


            req.flash("success_messages", `Your Poster ${title.get('title')} is successfully updated.`)



            res.redirect('/titles');

        },

        'empty': async function (form) {
            // form has no data

            res.render('titles/update', {

                'form': form.toHTML(bootstrapField)
            })
        },
        'error': async function (form) {
            // one or more fields have validation errors

            res.render('titles/update', {
                'form': form.toHTML(bootstrapField),
                'title': title.toJSON(),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET

            })
        }
    })

})


router.get('/delete/:poster_id', async function (req, res) {
    // get the product that we want to delete
    const title = await Title.where({
        'id': req.params.poster_id
    }).fetch({
        require: true // means if there is no results, Bookshelf will cause an exception (i.e an error)
    });

    // console.log(title);
    res.render('titles/delete', {
        'title': title.toJSON()
    })
})


router.post('/delete/:poster_id', async function (req, res) {
    // retrieving the object that represents the row
    // which we want to delete
    const title = await Title.where({
        'id': req.params.poster_id
    }).fetch({
        require: true // means if there is no results, Bookshelf will cause an exception (i.e an error)
    });

    // execute the delete
    await title.destroy();

    res.redirect('/titles')

})







module.exports = router;

