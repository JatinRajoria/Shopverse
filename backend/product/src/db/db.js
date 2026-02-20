const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB Connected to Product Service');
    }
    catch (error) {
        console.log('Error connection error in products:', error);
    }
}

module.exports = connectDB;