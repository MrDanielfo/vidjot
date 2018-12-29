const express = require('express'); 
const path = require('path'); 
const exphbs = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
const passport = require('passport'); 
const mongoose = require('mongoose');
const methodOverride = require('method-override'); 
const flash = require('connect-flash'); 
const session = require('express-session'); 

const app = express();

// Link ideas route 

const ideas = require('./routes/ideas'); 
const users = require('./routes/users'); 

// Passport config

require('./config/passport')(passport); 

//DB Config 
const db = require('./config/database'); 

// Connect to mongoose
mongoose
  .connect(
    db.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch(err => {
    console.log(err);
  });


// Handlebars middleware

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
  }));
app.set('view engine', 'handlebars'); 

// middleware 
app.use( (req, res, next) => {
  console.log(Date.now()); 
  next(); 
}); 

// parse application/x-www-form-urlencoded and json 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); 

// Static folder

app.use(express.static(path.join(__dirname, 'public'))); 

// Method Override Middleware
app.use(methodOverride('_method')); 
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})); 

// Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables

app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg'); 
  res.locals.error_msg = req.flash('error_msg'); 
  res.locals.error = req.flash('error'); 
  res.locals.user = req.user || null; 
  next(); 
})

// Para Heroku, se debe colocar proccess.env.PORT

const port = process.env.PORT || 5000; 


// Index Route

app.get('/', (req, res) => {
    const title = 'Bienvenido'
    res.render('index', {
      title: title
    });  
}); 

// About

app.get('/about', (req, res) => {
  res.render('about'); 
}); 

// Use Routes
app.use('/ideas', ideas); 
app.use('/users', users); 


app.listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`); 
})