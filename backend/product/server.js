require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

// 3001 isliye kyuki 3000 pr auth service run kr rha h
app.listen(3001, () => {
    console.log('Product Service is running on port 4000');
});