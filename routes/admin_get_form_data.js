const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post('/api/admin/form/get_form_data', async(req, res) =>{
    const { filter } = req.body ?? {};

    if(!filter){
        return res.json({
            status: "FAIL",
            error: "no fitler provide",
        });
    }

    if(filter.toUpperCase() === "NO_FILTER"){
        connection.execute(`SELECT * FROM send_form_table`, async(error, results, fields) =>{
            if(error){
                return res.json({
                    status: "FAIL",
                    error: `Mysql errpr :: ${error}`,
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

    if(filter.toUpperCase() === "FILTER_NOT_OUT_AUTH"){
        connection.execute(`SELECT * FROM send_form_table WHERE out_location_auth=?`, ["false"], async(error, results, fields) =>{
            if(error){
                return res.json({
                    status: "FAIL",
                    error: `Mysql error :: ${error}`,
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

    if(filter.toUpperCase() === "FILTER_NOT_ALLOW"){
        connection.execute(`SELECT * FROM send_form_table WHERE out_location_auth=? AND allow=?`, ["true", "false"], async(error, results, fields) =>{
            if(error){
                return res.json({
                    status: "FAIL",
                    error: `Mysql error :: ${error}`,
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

    if(filter.toUpperCase() === "FILTER_NOT_IN_AUTH"){
        connection.execute(`SELECT * FROM send_form_table WHERE out_location_auth=? AND allow=? AND in_location_auth=?`, ["true", "true", "false"], async(error, results, fields) =>{
            if(error){
                return res.json({
                    status: "FAIL",
                    error: `Mysql error :: ${error}`,
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

    if(filter.toUpperCase() === "FILTER_NOT_BACKIN"){
        connection.execute(`SELECT * FROM send_form_table WHERE backin=?`, ["false"], async(error, results, fields) =>{
            if(error){
                return res.json({
                    status: "FAIL",
                    error: `Mysql error :: ${error}`,
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
    
    if(filter.toUpperCase() === "FILTER_COMPLETE"){
        connection.execute(`SELECT * FROM send_form_table WHERE backin=?`, ["true"], async(error, results, fields) =>{
            if(error){
                return res.json({
                    status: "FAIL",
                    error: `Mysql error :: ${error}`,
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
});

module.exports = router;