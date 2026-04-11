const  express = require('express')

const app = express();

// health check route
app.get('/',(req,res)=>{
    res.status(200).json({
        message:"AI Service is running"
    })
})

module.exports = app;