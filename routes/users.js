const express = require("express");
const router = express.Router();

// import in the User model
const { User } = require('../models');

const { createRegistrationForm, bootstrapField, createLoginForm } = require('../forms');





router.get('/signup', (req, res) => {

    const registerForm = createRegistrationForm();

    res.render('users/signup', {
        'form': registerForm.toHTML(bootstrapField)
    })


})

router.post('/signup', (req, res) => {
    const registerForm = createRegistrationForm();

    registerForm.handle(req, {
        'success': async function (form) {
            const user = new User();

            const { confirm_password, ...userData } = form.data

            user.set(userData)

            await user.save();
            // req.flash('success_messages', "Your account has been successfully created.")
            res.redirect('/users/login');
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


router.get('/login', (req, res) => {

    const loginForm = createLoginForm()
    res.render('users/login', {
        'form': loginForm.toHTML(bootstrapField)

    })
})

router.post('/login', function (req, res) {
    const loginForm = createLoginForm()
    loginForm.handle(req, {
        'success': async function (form) {


            let user = await User.where({
                'email': form.data.email
            }).fetch({
                require: false
            });


            if (!user) {

                req.flash("error_messages", "Apologies. You have provided the wrong login details.")
                res.redirect('/users/login')
            } else {
                if (user.get('password') === form.data.password) {

                    req.session.user = {
                        id: user.get('id'),
                        username: user.get('username'),
                        email: user.get('email')

                    }

                    req.flash("success_messages", `Greetings, ${user.get("username")}`)
                    res.redirect('/users/profile');

                } else {
                    req.flash("error_messages", "Apologies. You have provided the wrong login details.")
                    res.redirect('/users/login')

                }


            }

        },
        'error': function (form) {
            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            })
        },
        'empty': function (form) {
            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            })
        }


    })

})


router.get('/profile', (req, res) => {
    const user = req.session.user;

    if (!user) {
        req.flash('error_messages', "You are not allowed to view this page as you lack the permission.")

        res.redirect('/users/login');

    } else {
        res.render('users/profile', {
            'user': user

        })
    }




})


module.exports = router;