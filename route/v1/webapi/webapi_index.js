const express = require('express')
const route = express.Router()

//users routes
const auth_controller = require('./auth/auth_constrolle')
const user_validation = require('./auth/auth_validation')
route.post('/api/auth/register', user_validation.registration, auth_controller.registration) //register user
route.post('/api/auth/login', user_validation.login, auth_controller.login) //login user

//products routes
const products_controller = require('./products/product_controller')
const task_validation = require('./products/product_validation')
route.post('/api/products', task_validation.add_product, products_controller.add);  // create a new product  
route.get('/api/products', products_controller.get_Products); // get all product with pagination
route.get('/api/products/:id', products_controller.fetch_single_product); // get a specific product
route.put('/api/products/:id', products_controller.update_product); // update a product
route.delete('/api/products/:id', products_controller.delete_product); // delete product


//cart routes
const cart_controller = require('./cart_order/cart_controller')
route.post('/api/cart/add', cart_controller.add_to_cart);  // add Product to Cart 
route.post('/api/orders', cart_controller.place_order);  // place an Order
route.get('/api/orders/:userId', cart_controller.fetch_user_orders); // fetch user orders


module.exports = route