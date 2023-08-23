const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post('/api/admin/form/update_form/update_out_location_auth', urlEncoded, async(req, res) =>{
    const { student_id, status } = req.body ?? {};

    if(!student_id || !status){
        return res.json({
            status: "FAIL",
            error: `Missing student_id or status`,
        });
    }

    if(status !== 'true' && status !== 'false'){
        return res.json({
            status: "FAIL",
            error: `invalid status option`,
        });
    }

    connection.execute(`UPDATE send_form_table SET out_location_auth=? WHERE student_id=?`, [status.toLowerCase(), student_id], async(error, results, fields) =>{
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
            },
        });
    });
});

router.post('/api/admin/form/update_form/update_in_location_auth', urlEncoded, async(req, res) =>{
    const { student_id, status } = req.body ?? {};

    if(!student_id || !status){
        return res.json({
            status: "FAIL",
            error: `Missing student_id or status`,
        });
    }

    if(status !== 'true' && status !== 'false'){
        return res.json({
            status: "FAIL",
            error: `invalid status option`,
        });
    }

    connection.execute(`UPDATE send_form_table SET in_location_auth=? WHERE student_id=?`, [status.toLowerCase(), student_id], async(error, results, fields) =>{
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
            },
        });
    });
});


module.exports = router;