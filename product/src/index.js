const express = require('express');
const expressApp= require("./express-app");
const {PORT} = require("./config/index");

const app = express();

const StartServer = async() => {
    expressApp(app);
    app.listen(PORT,()=>{
        console.log(`Product service started on port ${PORT}`);
    })
}
StartServer();