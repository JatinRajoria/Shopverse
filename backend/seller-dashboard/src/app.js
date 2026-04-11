const express = require('express')
const cookieParser = require("cookie-parser")
const sellerRoutes =  require("./routes/seller.routes")
const  cors = require('cors');
const allowedOrigins = [
    "http://localhost:5173",
    "https://xyz-store.netlify.app/"
]

const app = express();

app.use(express.json())
app.use(cookieParser())

//  Backend Service mein 
app.use(cors({
    origin: allowedOrigins,// React URL
    credentials: true
}));

// health check route
// iske through frontend ko pata chalega ki backend service chal rahi hai ya nahi
app.get('/',(req,res)=>{
    res.status(200).json({
        message:"Seller Dashboard Service is running."
    })
})

app.use('/api/seller/dashboard',sellerRoutes)

module.exports = app;