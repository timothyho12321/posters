const express = require('express')
const router = express.Router();
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const { User } = require('../../models');




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
    let user = await User.where({
        'email': req.body.email
    }).fetch({
        require: false
    })

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(user)
        console.log(accessToken)
        res.send({ accessToken })
        // STOP HERE LINE 44 

    } else {
        res.send({
            'error': "Wrong email or password was entered."
        })
    }


})

module.exports = router;
