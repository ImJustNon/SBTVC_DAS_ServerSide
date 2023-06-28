require("dotenv").config();

module.exports = {
    server: {
        port: process.env.PORT || 8080,
        host: process.env.HOST || "http://127.0.0.1"
    },
    database: {
        mysql: {
            host: process.env.MYSQL_HOST || "",                                     
            user: process.env.MYSQL_USER || "",     
            password: process.env.MYSQL_PASSWORD || "",                                     
            port: 3306,                                             
            database: process.env.MYSQL_DATABASE || "",            
            /* ssl: {
                rejectUnauthorized: true,
                },
            */                                                
        },
    },
    api: {
        secret_key: "nonlnwza", // key for auth scanner to api
    }
}