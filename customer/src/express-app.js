const express = require('express');
const cors = require('cors');
const {customer} = require('./api/index');
module.exports = async (app) => {

    // error handling
    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    customer(app);

}