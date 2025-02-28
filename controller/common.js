const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//generate hash password
module.exports.generate_password =async function(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

//check user password
module.exports.check_password = async function(password, db_password){
  return bcrypt.compareSync(password, db_password)
}

// generate jwt token
module.exports.generatejwt = async function(req_obj){
  return jwt.sign(req_obj, process.env.JWT_SECRET)
}

// decoded jwt token
module.exports.decodedjwt = async function(generated_token){
   return jwt.verify(generated_token, process.env.JWT_SECRET, function(err, decoded){
        if(err){
            return false
        }else{
          return decoded
        }
   })
}