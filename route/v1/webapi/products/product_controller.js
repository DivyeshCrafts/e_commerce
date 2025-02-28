const common = require('../../../../controller/common')
const db_connection = require('../../../../controller/db_connection')
const product_schema = require('../../../../model/product')

//Create a Product
module.exports.add = async function(req, res){
const decode_token = await common.decodedjwt(req.headers.authorization)
if(decode_token && decode_token.role == "Admin"){

        try {
            let request_body = req.body
            let bdconnect = await db_connection.db_connect()
            let product_connection = bdconnect.model('products', product_schema)
            let create_task = new product_connection(request_body)
            let save_task = await create_task.save()
    
                if(save_task){
                    res.send({message:"Create product successfull.", status: true, data: save_task})
                }else{
                    res.send({message:"Product not created.", status: false})
                }

        } catch (error) {
            console.log("error", error)
            res.send({message: "Something went wrong, please try again."})
        }
}else{
    res.send({message:"Admin can fetch all product or User is invalid.", status: false})
}
}

//Fetch All Products
module.exports.get_Products = async function(req, res){
  const decode_token = await common.decodedjwt(req.headers.authorization)
  if(decode_token && decode_token.role == "Admin"){

    try {

        const request_query = req.query
        console.log("request_query", request_query)
        const bdconnect = await db_connection.db_connect()
        const product_connection = bdconnect.model('products', product_schema)
        let page = parseInt(request_query.page) || 1;   
        let limit = parseInt(request_query.limit) || 5;
        let skip = (page - 1) * limit;

        const products = await product_connection.aggregate([
            {$skip:skip},
            {$limit:limit}
        ])

        if(products.length != 0){
            res.send({message:"product list", status:true, data:products,  page,
                limit,
                totalProducts:products.length,
                totalPages: Math.ceil(products.length / limit),})
        }else{
            res.send({message:"Not found product", status:false,})
        }
    } catch (error) {
        console.log("error", error)
        res.send({message: "Something went wrong, please try again."})
    }
}else{
    res.send({message:"Admin can fetch product or User is invalid.", status: false})
}
}

// Fetch Single Product (GET)
module.exports.fetch_single_product = async function(req, res){
    const decode_token = await common.decodedjwt(req.headers.authorization)
    if(decode_token && decode_token.role == "Admin"){
  
      try {
  
          const bdconnect = await db_connection.db_connect()
          const product_connection = bdconnect.model('products', product_schema)
          const one_product = await product_connection.findById(req.params.id)
          if(one_product){
              res.send({message:"Product", status: true, data:one_product})
          }else{
              res.send({message:"Product not found ", status:false})
          }
      } catch (error) {
          console.log("error", error)
          res.send({message: "Something went wrong, please try again."})
      }
  }else{
      res.send({message:"Admin can fetch product or User is invalid.", status: false})
  }
}

// Update a Product (Admin Only) (PUT)
module.exports.update_product = async function(req, res){
    const decode_token = await common.decodedjwt(req.headers.authorization)
    if(decode_token && decode_token.role == "Admin"){
  
      try {
          let request_body = req.body
          const bdconnect = await db_connection.db_connect()
          const product_connection = bdconnect.model('products', product_schema)

          if(req.params.id){               
            let update_product = await product_connection.updateOne({_id:req.params.id}, {$set: request_body})
            if(update_product){
                res.send({message:"Product updated.", status: true})
            }else{
                res.send({message:"Product not updated.", status: false})
            }
        }else{
        res.send({message: "Id not found", status: false})
        }

      } catch (error) {
          console.log("error", error)
          res.send({message: "Something went wrong, please try again."})
      }
  }else{
      res.send({message:"Admin can update product or User is invalid.", status: false})
  }
}


// Delete a Product (Admin Only) (DELETE)
module.exports.delete_product = async function(req, res){
    const decode_token = await common.decodedjwt(req.headers.authorization)
    if(decode_token && decode_token.role == "Admin"){
  
      try {
          const bdconnect = await db_connection.db_connect()
          const product_connection = bdconnect.model('products', product_schema)

          if(req.params.id){               
            let delete_product = await product_connection.findByIdAndDelete(req.params.id)
            console.log("delete_product", delete_product)
            if(delete_product){
                res.send({message:"Product deleted.", status: true})
            }else{
                res.send({message:"Product not deleted.", status: false})
            }
        }else{
        res.send({message: "Id not found", status: false})
        }

      } catch (error) {
          console.log("error", error)
          res.send({message: "Something went wrong, please try again."})
      }
  }else{
      res.send({message:"Admin can delete product or User is invalid.", status: false})
  }
}
