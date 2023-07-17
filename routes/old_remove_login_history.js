const express = require("express");
const router = express.Router();
const { connection } = require("../database/connect.js");
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/login/old_remove_login_history", urlEncoded, async(req, res) =>{
    const { student_id } = req.body ?? {};

    if(!student_id){
        return res.json({
            status: "FAIL",
            error: "You have to provide 'student_id' json",
        });
    }

    connection.execute('DELETE FROM login_history_table WHERE student_id=?', [student_id], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                error: `Cant delete data from mysql table : ERROR : ${err}`,
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
});

module.exports = router;