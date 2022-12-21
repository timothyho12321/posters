const jwt = require('jsonwebtoken')

const checkIfAuthenticated = (req, res, next) => {

    if (req.session.user) {
        next()

    } else {

        req.flash("error_messages", "Please sign to continue viewing the page");
        res.redirect('/users/login')

    }


}


const checkIfAuthenticatedJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split('')[1];

        //stop HERE line 25
        jwt.verify(token, proces.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();


        });


    } else {

        res.sendStatus(401);

    }
    


}


module.exports = {
    checkIfAuthenticated, checkIfAuthenticatedJWT
}