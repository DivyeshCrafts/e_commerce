const mongoose = require('mongoose')

//user schema
const user_schema = new mongoose.Schema({
    username:{type: String, default:""},
    email:{type: String, default:""},
    password:{type: String, default:""},
    role:{type: String, enum:["Admin", "User"]}
})

module.exports = user_schema