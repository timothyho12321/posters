const express = require('express')
const router = express.Router();
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const { User, BlackListedToken } = require('../../models');
const { checkIfAuthenticatedJWT } = require('../../middlewares');




const generateAccessToken = (user, tokenSecret, expiryIn) => {
    //user is converted to userObject and passed in to generateAccessToken
    return jwt.sign({


        'username': user.username,
        'id': user.id,
        'email': user.email

    }, tokenSecret, {
        expiresIn: expiryIn
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

        const userObject = {
            'username': user.get('username'),
            'email': user.get('email'),
            'id': user.get('id')
        }

        let accessToken = generateAccessToken(userObject, process.env.TOKEN_SECRET, '15m')
        let refreshToken = generateAccessToken(userObject, process.env.REFRESH_TOKEN_SECRET, '7d')


        res.json({
            'accessToken': accessToken,
            'refreshToken': refreshToken
        })


    } else {
        res.send({
            'error': "Wrong email or password was entered."
        })
    }


})


router.post('/refresh', async (req, res) => {
    let refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        res.status(403);
        res.json({
            'error': "There was no refresh token submitted"
        })
        return;
    }

    const blackListedToken = await BlackListedToken.where({
        'token': refreshToken
    }).fetch({
        require: false
    })


    if (blackListedToken) {
        res.status(403);
        res.json({
            'error': 'Sorry, your refresh token has been blacklisted. Login again to create a new token'
        })
        return;
    }


    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403);
            res.json({
                'error': "There was an invalidated refresh token. Please login again"
            });
            return;
        }

        let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '15m');
        res.send({ accessToken });

    })


})


router.post('/logout', async (req, res) => {
    let refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        res.sendStatus(403);


    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {

            if (err) {
                res.status(403);
                res.json({
                    'error': "An invalidated refresh token was submitted. Please login again."
                })
                return;
            }
            const token = new BlackListedToken();
            token.set('token', refreshToken);
            token.set('date_created', new Date());
            await token.save();
            res.send({
                'message': "You have logged out."
            })
        })


    }


})





router.get('/profile', checkIfAuthenticatedJWT, function (req, res) {

    res.json({
        "profile": req.user
    })

})




module.exports = router;
