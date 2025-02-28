const mongoose = require('mongoose')

// product schema
const product_schema = new mongoose.Schema({
    name:{type:String, default:""},
    price:{type:Number, default:0},
    description:{type:String, default:""},
    stock:{type:Number, default:0},
    category:{type:String, default:""},
    image:{type:String, default:""},
})

module.exports = product_schema