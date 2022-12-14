const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
const csrf = require('csurf');
const cors = require('cors');

require("dotenv").config();


// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

app.use(cors());

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);


app.use(session({
  store: new FileStore(),  // use files to store sessions
  secret: process.env.SESSION_SECRET_KEY,
  resave: false, // if the client access the web server and there's no change to session data, don't resave the session
  saveUninitialized: true // save a new session for each client that does not have a session 
}))

app.use(flash());

app.use(function (req, res, next) {
  // res.locals is an object that store all the placeholders for the hbs file

  // req.flash with one parameter, it retrieves all messages belonging to the
  // category specified by it and also delete it from the session
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
})


// Share user data with hbs files using global middleware
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();

})


//OLD VERSION CSRF 
// app.use(csrf());


const csrfInstance = csrf();
app.use(function (req, res, next) {

  if (req.url == "/checkout/process_payment" || 
  req.url.slice(0,5)=="/api/") {
    return next();

  }
  csrfInstance(req, res, next);

})


app.use(function (err, req, res, next) {
  // if the function for app.use has 4 parameters
  // it is an error handler. Any error from the previous middleware
  // will be passed to it
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash("error_messages", "Sorry the form has expired. Please try again");
    res.redirect('back');  // redirect with the 'back' as argument means to go back to the previous page
  } else {
    // if no error, go to the next middleware
    next();
  }
})

app.use(function (req, res, next) {
  // req.csrfToken() will return a valid CSRF token
  // and we make it available to all hbs files via `res.locals.csrfToken`

  if (req.csrfToken) {

    res.locals.csrfToken = req.csrfToken();

  }


  next();
})



app.use(async function (req, res, next) {
  if (req.session.user) {

    let cart = new CartServices(req.session.user.id)
    const cartItems = await cart.getCart()

    res.locals.cartItemCount = cartItems.toJSON().length;
  } else {
    res.locals.cartItemCount = 0;

  }
  next();

})




const landingRoutes = require('./routes/landing');
const titleRoutes = require('./routes/titles');
const userRoutes = require('./routes/users')
const cloudinaryRoutes = require('./routes/cloudinary')
const shoppingRoutes = require('./routes/shoppingCart')
const checkoutRoutes = require('./routes/checkout')
const { CartServices } = require('./services/cart_items');


// import api routes
const api = {
  titles: require('./routes/api/titles'),
  users: require('./routes/api/users')
}


async function main() {

  app.use('/', landingRoutes);
  app.use('/titles', titleRoutes);
  app.use('/users', userRoutes);
  app.use('/cloudinary', cloudinaryRoutes)
  app.use('/cart', shoppingRoutes);
  app.use('/checkout', checkoutRoutes)


  // API routes
app.use('/api/titles', express.json(), api.titles)
app.use('/api/users', express.json(), api.users)
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});

