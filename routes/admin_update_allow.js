const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post('/api/admin/form/update_allow', async(req, res) =>{
    const { student_id } = req.body ?? {};

    if(!student_id){
        return res.json({
            status: "FAIL",
            error: `student_id not found`,
        });
    }

    connection.execute("UPDATE send_form_date SET allow=? WHERE student_id=?", ["true", student_id], async(error, results, fields) =>{
        if(error){
            return res.json({
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
});

module.exports = router;