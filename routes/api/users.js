const express = require('express')
const router = express.Router();
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { checkIfAuthenticatedJWT } = require('../../middlewares');




const generateAccessToken = (user) => {
    return jwt.sign({
        'username': user.get('username'),
        'id': user.get('id'),
        'email': user.get('email')


    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h"
    });

}


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;

}


router.post('/login', async (req, res) => {
    console.log("user login for jwt ran")
    let user = await User.where({
        'email': req.body.email
    }).fetch({
        require: false
    })

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(user)
        
        res.send({ accessToken })
        

    } else {
        res.send({
            'error': "Wrong email or password was entered."
        })
    }


})


router.get('/profile', checkIfAuthenticatedJWT, function (req, res) {
    
    res.json({
        "profile": req.user
    })

})

module.exports = router;
