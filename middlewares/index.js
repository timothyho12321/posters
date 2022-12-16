const checkIfAuthenticated = (req, res, next) => {

    if (req.session.user) {
        next()

    } else {

        req.flash("error_messages", "Please sign to continue viewing the page");
        res.redirect('/users/login')

    }


}

module.exports = {
    checkIfAuthenticated
}