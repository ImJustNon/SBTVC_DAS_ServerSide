const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

router.get('/api/old/login/old_check_login_history', (req, res) =>{
    const { client_ip } = req.query ?? {}; 
    
    if(!client_ip){
        return res.json({
            status: "FAIL",
            error: "Cant find 'client_ip' query",
        });
    }

    connection.execute("SELECT * FROM login_history_table WHERE client_ip = ?", [client_ip], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                error: `Cant get data from table : ERROR : ${err}`
            });
        }

        if(results.length === 0){
            return res.json({
                status: "SUCCESS",
                error: null,
                data: {
                    login: false,
                    results: results,
                }
            });
        }

        return res.json({
            status: "SUCCESS",
            error: null,
            data: {
                login: true,
                results: results,
            },
        });
    });
});

module.exports = router;