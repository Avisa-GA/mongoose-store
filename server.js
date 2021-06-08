
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
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride('_method'))

// Perform CRUD on our model
// require the model
const Product = require('./models/product')

// Error / success
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongod connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongod disconnected'));


//___________________
// Routes
//___________________
//localhost:3000
app.get('/' , (req, res) => {
    res.send('Hello World!');
  });

//  INDEX
app.get('/products', (req, res) => {
  Product.find({}, (error, foundProducts) => {
      res.render('index.ejs', {
          allProducts: foundProducts,
      })
  })
})


// SHOW
app.get('/products/:id', (req, res) => {
    
	Product.findById(req.params.id, (error, foundProduct) => {
       
		res.render('show.ejs', {
            product: foundProduct,
            x: req.params.id
        })
	})
});

// DELETE
app.delete('/products/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, deletedProduct) => {
        res.send(deletedProduct)
    })
})



// UPDATE 
app.put('/products/:id', (req, res) => {
    Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
        (error, updatedProduct) => {
            res.render('edit.ejs', {
                product: updatedProduct
            })
        }
    )
    res.redirect('/products')
})

// CREATE
app.post('/products', (req, res) => {
    Product.create(req.body, function(err, newProduct) {
        res.send(newProduct)
    })
  })

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log('express is listening on:', PORT));