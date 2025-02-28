const common = require('../../../../controller/common')
const db_connection = require('../../../../controller/db_connection')
const cart_schema = require('../../../../model/cart')
const product_schema = require('../../../../model/product')
const order_schema = require('../../../../model/order')



// Add Product to Cart (POST)
module.exports.add_to_cart = async function(req, res){
const decode_token = await common.decodedjwt(req.headers.authorization)
if(decode_token){

        try {
            let request_body = req.body
            let bdconnect = await db_connection.db_connect()
            let product_connection = bdconnect.model('products', product_schema)
            let cart_connection = bdconnect.model('carts', cart_schema)

            const one_product = await product_connection.findById(request_body.product_id);
                if(one_product){

                    //find user cart
                    let user_cart = await cart_connection.findOne({ user_id: decode_token._id});
                    if(user_cart){

                        // check if product is already in cart
                        const existingItem = user_cart.items.find(item => item.product_id.toString() === request_body.product_id);
                       if(existingItem){

                        // increment the quantity of the existing product
                        await cart_connection.updateOne(
                            { user_id: decode_token._id, "items.product_id": request_body.product_id }, 
                            { $inc: { "items.$.quantity": request_body.items[0].quantity } }
                        );
                       }else{
                          // if product does not exist in cart, update it to the cart
                          await cart_connection.updateOne(
                            { user_id: decode_token._id },
                            { $push: { items: { product_id: request_body.product_id, quantity: request_body.items[0].quantity } } }
                        );
                       }

                    }else{
                      // Create new cart if not exists
                      let item_obj = {
                        user_id: decode_token._id,
                        items: request_body.items
                      }
                      const add_to_cart = await cart_connection.insertOne(item_obj)
                      if(add_to_cart){
                         res.send({message:"Product added to cart successfully.", status: true, data: add_to_cart})
                      }

                    }
                }else{
                    res.send({message:"Product not found.", status: false})
                }

        } catch (error) {
            console.log("error", error)
            res.send({message: "Something went wrong, please try again."})
        }
}else{
    res.send({message:"User is invalid.", status: false})
}
}

// Place an Order (POST)
module.exports.place_order = async function(req, res){
    const decode_token = await common.decodedjwt(req.headers.authorization)
    if(decode_token){
    
            try {
                let bdconnect = await db_connection.db_connect()
                let product_connection = bdconnect.model('proordersducts', product_schema)
                let cart_connection = bdconnect.model("carts", cart_schema);
                let order_connection = bdconnect.model('orders', order_schema)
    
                let user_cart = await cart_connection.findOne({ user_id: decode_token._id});
                if(user_cart){

                    //order save
                    let total_price = 0
                    console.log("user_cart.items", user_cart.items)
                    for (let item of user_cart.items) {
                        let product = await product_connection.findById(item.product_id);
                        console.log("product", product)
                        if (product) {
                            total_price += product.price * item.quantity;
                        }
                    }
                    console.log("total_price", total_price)

                    let new_order = {
                        user_id: decode_token._id,
                        items: user_cart.items,
                        total_price: total_price
        
                    }
                    let order = await order_connection.insertOne(new_order);
                    if(order){
                        //delete cart
                        await cart_connection.deleteOne({ user_id: decode_token._id });
                        res.send({ message: "Order placed successfully.", status: true, data: order });
                    }else{
                        res.send({ message: "Order not placed.", status: false });
                    }

                }else{
                    res.send({message:"Cart is empty.", status: false,})
                }
    
            } catch (error) {
                console.log("error", error)
                res.send({message: "Something went wrong, please try again."})
            }
    }else{
        res.send({message:"User is invalid.", status: false})
    }
}

// Fetch User Orders (GET)
module.exports.fetch_user_orders = async function(req, res){
    const decode_token = await common.decodedjwt(req.headers.authorization)
    if(decode_token){
  
      try {
  
          const bdconnect = await db_connection.db_connect()
          const orders_connection = bdconnect.model('orders', order_schema)
          console.log("req.params.userId", req.params.userId)
          const all_orders = await orders_connection.find({user_id:req.params.userId})
          console.log("all_orders", all_orders)
          if(all_orders){
              res.send({message:"Orders", status: true, data:all_orders})
          }else{
              res.send({message:"Orders not found ", status:false})
          }
      } catch (error) {
          console.log("error", error)
          res.send({message: "Something went wrong, please try again."})
      }

  }else{
      res.send({message:"User is invalid.", status: false})
  }
}
