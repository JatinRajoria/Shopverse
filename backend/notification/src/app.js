const express = require('express');
const { connect } = require('./broker/broker');
const setListeners = require("../src/broker/listeners");

const app = express();

connect().then(() => {
    // jab apan successfully connect ho jayenge rabbitMQ tab setListeners chlenge
    setListeners();
})

// ye health check route hai
app.get("/", (req,res) => {
    res.send("Notification service is up and running");
})


module.exports = app;

