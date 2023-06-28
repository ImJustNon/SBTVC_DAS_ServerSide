const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});

router.post('/api/auth/esp/auth_receiver', urlEncoded, (req, res) =>{
    const { location_auth_id, type, for_ } = req.body ?? {};

    if(!location_auth_id || !type || !for_){
        return res.json({
            status: "FAIL",
            error: "Please provide 'location_auth_id', 'type', 'for_' query",
        });
    }

    if(type === "home"){
        if(for_ === "out"){
            connection.execute('UPDATE send_form_table SET out_location_auth = ? WHERE location_auth_id = ?', ["true", location_auth_id], (err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        error: `Cant update 'out_location_auth' table : ERROR : ${err}`,
                    });
                }

                return res.json({
                    status: "SUCCESS",
                    error: null,
                    data: {
                        results: results,
                    }
                });
            });
        }
        if(for_ === "in"){
            connection.execute('UPDATE send_form_table SET in_location_auth = ? WHERE location_auth_id = ?', ["true", location_auth_id], (err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        error: `Cant update 'out_location_auth' table : ERROR : ${err}`,
                    });
                }

                return res.json({
                    status: "SUCCESS",
                    error: null,
                    data: {
                        results: results,
                    }
                });
            });
        }
    }
    else if(type === "market"){
        
    }
});

module.exports = router;