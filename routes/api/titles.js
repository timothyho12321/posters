const express = require('express');
const titlesDataLayer = require('../../dal/titles');
const { createTitleForm } = require('../../forms');
const router = express.Router();




router.get('/', async (req, res) => {

    console.log("get ran")
    let checkTitle = await titlesDataLayer.getAllTitlesAPI()
    console.log(checkTitle);
    res.send(await titlesDataLayer.getAllTitlesAPI())


})


router.post('/', async (req, res) => {
    console.log("post ran")
    const titleForm = createTitleForm();
    titleForm.handle(req, {
        'success': async function (form) {
            console.log("success add ran")
            const title = await titlesDataLayer.createNewTitle(form.data);
            res.json(title.toJSON());

        },
        'error': async function (form) {
            console.log("error ran")
            let errors = {};

            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error;

                }
            }
            res.status(400);
            res.json(errors);

        },
        'empty': async function (form) {
            console.log("empty ran")
            res.status(400);
            res.json({
                'error': "No data input was received"
            })

        }



    })


})


module.exports = router;