const mongoose = require('mongoose')

// order schema
const order_schema = new mongoose.Schema({
        user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        items: [
            {
                product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number, default: 1 }
            }
        ],
        total_price: { type: Number, default:0 }
})

module.exports = order_schema