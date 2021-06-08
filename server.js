
//___________________
//Dependencies
//___________________
const mongoose = require('mongoose')
const express = require('express')
const methodOverride = require('method-override')
const app = express()
const db = mongoose.connection
const path = require('path')
require('dotenv').config()
const productSeed = require('./models/productSeed.js')

//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment

const PORT = process.env.PORT || 3000

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'))

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: true }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project
app.set('view engine', 'ejs');
//use method override
app.use(methodOverride('_method'))

// Perform CRUD on our model
// require the model
const Product = require('./models/products')

// Error / success
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongod connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongod disconnected'));


//___________________
// Routes
//___________________

/* app.get('/products/seed', (req, res) => {

    Product.deleteMany({}, (err, allBooks) => {})
    Product.create(productSeed, (err, data) => {
        res.redirect('/products')
    })
      
}); */

// ROOT
app.get('/' , (req, res) => {
    res.send('Welcome to mongoose store app!');
  });

//  INDEX
app.get('/products', (req, res) => {
     Product.find({}, (error, allProducts) => {
         res.render('index.ejs', {
             products: allProducts,
         })
     })
})

// NEW 
app.get('/products/new', (req, res) => {
    res.render('new.ejs')
})




// CREATE
app.post('/products', (req, res) => {

    if (req.body.completed === 'on') {
        req.body.completed = true
    } else {
        req.body.completed = false
    }
    
    Product.create(req.body, (error, createdProduct) => {
        res.redirect('/products')
    })
  })

  // SHOW
app.get('/products/:id', (req, res) => {
    
	Product.findById(req.params.id, (error, foundProduct) => {
       
		res.render('show.ejs', {
            product: foundProduct,
        })
	})
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log('express is listening on:', PORT));