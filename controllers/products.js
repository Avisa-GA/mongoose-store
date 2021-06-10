// REQUIRE AND SET UP DEPENDENCIES
const express = require('express')
const productsRouter = express.Router()
const Product = require('../models/product.js')

// SEED
const productSeed = require('../models/productSeed.js')

productsRouter.get('/seed', (req, res) => {

    Product.deleteMany({}, (err, allBooks) => {})
    Product.create(productSeed, (err, data) => {
        res.redirect('/products')
    })
      
}); 

//  INDEX
productsRouter.get('/', (req, res) => {
    Product.find({}, (error, allProducts) => {
        res.render('index.ejs', {
            products: allProducts,

        })
    })
})

// NEW 
productsRouter.get('/new', (req, res) => {
    res.render('new.ejs')
})

// DELETE
productsRouter.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id, (err, deletedProduct) => {
        res.redirect('/products')
    })
})

// UPDATE BUY BUTTON 
productsRouter.put('/:id/buy', (req, res) => {

    Product.findOneAndUpdate(req.params.id, {
        $inc: {
            qty: -1
        }
    }, {
        new: true
    }).then((results) => {
        res.redirect(`/products/${req.params.id}`)
    });
});

// UPDATE
productsRouter.put('/:id', (req, res) => {
   
    // step 2: find the book in mongodb and update it with req.body
    Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    }, (err, updatedProduct) => {
        res.redirect(`/products/${req.params.id}`)
    })

})




// CREATE
productsRouter.post('/', (req, res) => {

    Product.create(req.body, (error, createdProduct) => {
        res.redirect('/products')
    })
})

// EDIT
productsRouter.get('/:id/edit', (req, res) => {
    // We need to find the book We are editing
    // We need to insert the book into template
    Product.findById(req.params.id, (err, foundProduct) => {
        res.render('edit.ejs', {
            /* Context Object */
            product: foundProduct
        })
    })
})

// SHOW
productsRouter.get('/:id', (req, res) => {

    Product.findById(req.params.id, (error, foundProduct) => {

        res.render('show.ejs', {
            product: foundProduct,
        })
    })
});

// EXPORT FUNCTIOANLITY
module.exports = productsRouter