const mongoose = require('mongoose')
mongoose.set('debug', true)

//mongoodb connection
module.exports.db_connect = async function(){
    try {
        return mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log("mongodb error", error)
    }
}