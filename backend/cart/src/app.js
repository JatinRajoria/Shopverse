const express = require('express')
const cartRoutes = require('./routes/cart.routes')
const  cookieParser =   require('cookie-parser')

const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/cart',cartRoutes);

module.exports = app;