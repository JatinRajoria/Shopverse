const express = require('express');
const cookieParser = require('cookie-parser');
const orderRoutes = require('./routes/order.routes');

const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());

// Backend Service me
app.use(cors({
    origin: 'http://localhost:5173', //React URL
    credentials: true
}));

app.use('/api/orders', orderRoutes);

module.exports = app;