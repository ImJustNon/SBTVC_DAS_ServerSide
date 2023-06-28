const express = require("express");
const server = express();


const cors = require("cors");
const fs = require("fs");
const path = require("path");
const logger = require("morgan");
const request = require("request");
const axios = require("axios");
const useragent = require('express-useragent');
const mysql = require("mysql2");
const bodyparser = require("body-parser");


const urlencoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const config = require("./configs/config.js");


server.use(cors());
server.use(useragent.express());
server.use(logger('combined'));
server.use(express.static(path.join(__dirname,'./public')));
server.use(express.static(path.join(__dirname,'./node_modules')));
server.use(express.json({
    limit: '50mb',
}));
server.use(urlencoded);

// route loader
fs.readdirSync("./routes").forEach(async files => { 
    try {
        let router = require(`./routes/${files}`);
        server.use(router);
        console.log('[Router] ' + `Loaded : ` + files);
    }
    catch (e){
        console.log('[Router] ' + `Fail to Load : ` + files);
    }
});

// database
require("./database/connect.js").connect();


server.listen(config.server.port, async() =>{
    console.log("[SERVER] " + `Localhost : ${config.server.host}:${config.server.port}`);
    console.log("[SERVER] " + `Listening on port : ` + String(config.server.port));
});
