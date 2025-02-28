const mongoose = require('mongoose')

// cart schema
const cart_schema = new mongoose.Schema({
    user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    items: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ],
}, { timestamps: true })

module.exports = cart_schema