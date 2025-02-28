const validation  = require('../../../../controller/validation')

const add_product = (req, res, next)=>{

    let rules = {
        name: "required",
        price: "required",
        stock: "required",
        category: "required",
        image: "required",

    }
    validation(req.body, rules, (error, status)=>{
        if(!status){
            res.send({message:"Validation faild", status: status, data: error})
        }else{
            next()
        }
    })
}

const update_task = (req, res, next)=>{
    const { id } = req.params;
    const requestBody = req.body;

    //check id
    if (!id) {
        return res.status(400).json({ message: "Task ID is required", status: false });
    }

    //Check if request body
    if (requestBody.length === 0) {
        return res.status(400).json({ message: "Request body cannot be empty", status: false });
    }

    next()
}

module.exports = {
    add_product,
    update_task
}