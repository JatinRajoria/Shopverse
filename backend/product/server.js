require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { connect } = require("./src/broker/broker");
const listener = require('./src/broker/listener')

connectDB();

connect().then(() => {
    listener();
})

// 3001 isliye kyuki 3000 pr auth service run kr rha h
app.listen(3001, () => {
    console.log('Product Service is running on port 3001');
});