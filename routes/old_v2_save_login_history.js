const express = require("express");
const router = express.Router();
const { connection } = require("../database/connect.js");
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});

router.post("/api/old/login/old_v2_save_login_history", urlEncoded, async(req, res) =>{
    const { student_id } = req.body ?? {};   
    
    if(!student_id){
        return res.json({
            status: "FAIL",
            error: "cant find 'student_id'"
        });
    }

    connection.execute('SELECT * FROM student_data_table WHERE student_id=?', [student_id], (error, results, fields) =>{
        if(error){
            return res.json({
                status: "FAIL",
                error: `Mysql error : ERROR : ${error}`,
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                error: "Cant find student data from this student_id",
            });
        }

        req.session.is_logged_in = true;
        req.session.student_id = student_id;

        return res.json({
            status: "SUCCESS",
            error: null,
            data: {
                is_logged_in: req.body.is_logged_in,
                student_id: req.body.student_id,
            }
        }); 
    });
});

module.exports = router;