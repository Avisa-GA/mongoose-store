

// Requiring our dependencies
// SINGLETON PATTERN
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema( {
          name: String,
          description: String,
          img: String,
          price: {
              type: Number,
              required: true
          },
          qty: {
            type: Number,
            required: true
          },
          completed: Boolean,

        },  { timestamps: true })
        
const Product = mongoose.model('Product', productSchema)

module.exports = Product