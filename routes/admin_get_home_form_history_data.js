const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post('/api/admin/form/get_home_form_history_data', urlEncoded, async(req, res) =>{
    const { form_id } = req.body ?? {};

    if(!form_id){
        connection.execute(`SELECT * FROM home_form_history_table`, async(error, results, fields) =>{
            if(error){
                return reset.json({
                    status: "FAIL",
                    error: `Mysql error :: ${error}`
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
    else {
        connection.execute(`SELECT * FROM home_form_history_table WHERE id=?`, [parseInt(form_id)], async(error, results, fields) =>{
            if(error){
                return res.json({
                    status: "FAIL",
                    error: `Mysql error :: ${error}`,
                });
            }

            if(results.length == 0){
                return res.json({
                    status: "FAIL",
                    error: `cant find data for this form_id : ${form_id}`
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