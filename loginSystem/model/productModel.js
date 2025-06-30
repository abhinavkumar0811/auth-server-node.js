const mongoose = require('mongoose');

const productSchemas = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }, 
  category: {
    type: String,  //bullter ka tanki
    required: true,
  },
});

const productSchema = mongoose.model('product', productSchemas);

module.exports = productSchema;