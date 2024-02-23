const express = require('express');

module.exports = async (app) => {

    // error handling
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));  
}