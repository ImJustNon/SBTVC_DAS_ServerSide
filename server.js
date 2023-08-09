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
const swaggerUi = require("swagger-ui-express");
const swaggerJSdoc = require("swagger-jsdoc");
// const session = require('express-session');

const urlencoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const config = require("./configs/config.js");


server.use(cors());
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

// swagger definition
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SBTVC Dormitory Access System 2.0 API Document",
            version: "10.2.3",
            description: "API Documentation"
        },
        servers: [
            {
                url: "https://sbtvc-das-api.nonlnwza.xyz",
            },
        ],
        path: [
            {
                get: {
                    description: "asdasd"
                }
            }
        ]
    },
    apis: [
        'server.js',
    ],
}

const swaggerSpec = swaggerJSdoc(swaggerOptions);
server.use('/document', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// database
require("./database/connect.js").connect();


server.listen(config.server.port, async() =>{
    console.log("[SERVER] " + `Localhost : ${config.server.host}:${config.server.port}`);
    console.log("[SERVER] " + `Listening on port : ` + String(config.server.port));
});
