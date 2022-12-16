const express = require("express");
const router = express.Router();

// import in the User model
const { User } = require('../models');

const { createRegistrationForm, bootstrapField } = require('../forms');



router.get('/signup', (req, res) => {

    const registerForm = createRegistrationForm();

    res.render('users/signup', {
        'form': registerForm.toHTML(bootstrapField)
    })


})

router.post('/signup', (req, res) => {
    const registerForm = createRegistrationForm();
    console.log("ran update")
    registerForm.handle(req, {
        'success': async function (form) {
            const user = new User();
            console.log(form.data)
            const { confirm_password, ...userData } = form.data

            user.set(userData)

            await user.save();
            // req.flash('success_messages', "Your account has been successfully created.")
            res.redirect('/users/login')
        }
        ,
        'error': function (form) {
            res.render('users/signup', {
                'form': form.toHTML(bootstrapField)
            })


        },
        'empty': function (form) {
            res.render('users/signup', {
                'form': form.toHTML(bootstrapField)
            })
        }

    }

    )


}
)



module.exports = router;