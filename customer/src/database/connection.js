const { Client } = require('pg');
const {DB_PORT,DB_USER,DB_PASSWORD,DB_CONNECTION,SCHEMA} = require("../config/index");

const client = new Client({
            host: "localhost",
            user: DB_USER,
            port: DB_PORT,
            password: DB_PASSWORD,
            database: DB_CONNECTION      
});

module.exports = client;
        
  

