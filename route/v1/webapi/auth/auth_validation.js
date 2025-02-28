const validation = require('../../../../controller/validation')

//registration validation
const registration = (req, res, next)=>{
    let rules = {
        "username": "required",
        "email": "required",
        "password": "required",
        "role": "required"
    }
    validation(req.body, rules, (error, status)=>{
     if(!status){
        res.send({status: status, message: "validation is incorrect.", data: error})
     }else{
        next()
     }
    })
}

//login validation
const login = (req, res, next)=>{
    let rules = {
        email:"required",
        password:"required",
    }
    validation(req.body, rules, (error, status)=>{
        if(!status){
            res.send({status: false, message:"validation faild", data: error})
        }else{
            next()
        }
    })
}

module.exports = {
    registration,
    login
}