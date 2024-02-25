const express = require('express');
const cors = require('cors');
const {product} = require('./api/index');
module.exports = async (app) => {

  
    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    product(app);

}