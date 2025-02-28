const http = require("http")
const express = require("express")
const app = express()
require('dotenv').config();

app.use(express.json({limit:"50mb"}))

// Simple error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};
app.use(errorHandler)

const webapi_index = require('./route/v1/webapi/webapi_index')
app.use('/', webapi_index)

app.use((error, req, res, next)=>{
console.error(error.stack)
res.status(500).send('something went wrong')
})

http.createServer(app).listen(process.env.PORT,()=>{
    console.log(`App listen on port ${process.env.PORT}`)
})