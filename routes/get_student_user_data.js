const express = require("express");
const router = express.Router();

const { connection } = require("../database/connect.js");

const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.get('/api/users/:student_id', async(req, res) =>{
    const { student_id } = req.params ?? {};

    if(!student_id){
        return res.json({
            status: "FAIL",
            error: `Cant find data for user ${student_id}`
        });
    }

    connection.execute("SELECT * FROM student_data_table WHERE student_id=?", [student_id], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                error: `mysql error : ERROR : ${err}`
            });
        }
        
        return res.json({
            status: "SUCCESS",
            error: null,
            data: {
                results: await results,
                id: await results[0].id,
                student_prefix: await results[0].student_prefix,
                student_id: await results[0].student_id,
                student_name: await results[0].student_name,
                student_lastname: await results[0].student_lastname,
                student_reg_type: await results[0].student_reg_type
            }
        });
    });
});

module.exports = router;