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
// const session = require('express-session');

const urlencoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const config = require("./configs/config.js");

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust the '*' to restrict access to specific origins
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
server.use(cors());
// server.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Headers', '*');
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
//     res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
//     next(); 
// });
// server.use(session({
//     secret: 'nonlnwza',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false, // Set to true if using HTTPS
//         maxAge: 604800000, // Time in milliseconds, e.g., 1 week
//     }
// }));
server.use(useragent.express());
server.set('views', path.join(__dirname, './views'));
server.set('view engine', 'ejs');
server.use(logger('dev'));
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
