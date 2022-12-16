const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const session  = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');


require("dotenv").config();

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

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
  secret:"keyboards cat",
  resave: false, // if the client access the web server and there's no change to session data, don't resave the session
  saveUninitialized: true // save a new session for each client that does not have a session 
}))

app.use(flash());

app.use(function(req,res, next){
  // res.locals is an object that store all the placeholders for the hbs file

  // req.flash with one parameter, it retrieves all messages belonging to the
  // category specified by it and also delete it from the session
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
})




const landingRoutes = require('./routes/landing');
const titleRoutes = require('./routes/titles');

async function main() {
  
  app.use('/', landingRoutes);
  app.use('/titles', titleRoutes);

}

main();

app.listen(3000, () => {
  console.log("Server has started");
});

