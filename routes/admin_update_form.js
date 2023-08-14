const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post('/api/admin/form/update_form/update_allow', async(req, res) =>{
    const { update_allow, student_id } = req.body ?? {};

    if(!update_allow){
        return res.json({
            status: "FAIL",
            error: "Cant find update_allow from body"
        });
    }

    if(update_allow.toLowerCase() === "true"){
        connection.execute(`UPDATE send_form_table SET allow='true' WHERE student_id=?`, [student_id], async(error, results, fields) =>{
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
                    student_id: student_id,
                }
            });
        });
    }

    if(update_allow.toLowerCase() === "false"){
        connection.execute(`UPDATE send_form_table SET allow='false' WHERE student_id=?`, [student_id], async(error, results, fields) =>{
            if(error){
                return res.json({
                    status: "FAIL",
                    error: null,
                });
            }
        });
    }   
    

});

module.exports = router;