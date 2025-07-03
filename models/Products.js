const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const productSchema= new mongoose.Schema({
    id: { type: String, default: uuidv4, unique:true},
    name: { type: String,},
    description: { type: String},
    price: { type: Number },
    category: { type: String},
    inStock: { type: Boolean, default:false}
})

module.exports = mongoose.model('Products', productSchema);